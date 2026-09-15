import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../auth', () => ({
  applyAuthEndpoints: vi.fn(),
  applyAuthSession: vi.fn((app: any) => {
    app.use(function authSession(_req: any, _res: any, next: any) {
      next();
    });
  }),
  applyEnvironmentConfig: vi.fn(),
}));

vi.mock('graphql-modules', async (importOriginal) => ({
  ...(await importOriginal<typeof import('graphql-modules')>()),
  createApplication: vi.fn(() => ({
    createApolloExecutor: () => async () => ({ data: null }),
    schema: {},
  })),
}));

vi.mock('@apollo/server', () => ({
  ApolloServer: vi.fn(() => ({
    start: vi.fn(async () => {}),
    cache: {},
  })),
}));

vi.mock('@as-integrations/express4', () => ({
  expressMiddleware: vi.fn(
    () =>
      function graphqlHandler(_req: any, _res: any, next: any) {
        next();
      }
  ),
}));

import { ElodyInstance } from '../elodyInstance';

const buildInstance = () =>
  new ElodyInstance({
    customModuleConfig: { modules: [] },
    appConfig: {
      environment: 'production',
      api: { promUrl: 'no-prom' },
      features: { SEO: false },
    } as any,
    customTranslations: {},
  });

const layerNames = (app: any): string[] =>
  app._router.stack.map((layer: any) => layer.name);

describe('ElodyInstance.buildApp', () => {
  let app: any;

  beforeAll(async () => {
    app = await buildInstance().buildApp();
  });

  it('builds an express app without listening', () => {
    expect(typeof app.use).toBe('function');
    expect(app.get('view engine')).toBe('pug');
  });

  it('registers middleware in the load-bearing order', () => {
    const names = layerNames(app);
    const order = (name: string) => names.indexOf(name);

    expect(order('corsMiddleware')).toBeGreaterThan(-1);
    expect(names.some((name) => name.startsWith('helmet'))).toBe(true);
    expect(order('compression')).toBeGreaterThan(order('corsMiddleware'));
    expect(order('jsonParser')).toBeGreaterThan(order('compression'));
    expect(order('urlencodedParser')).toBeGreaterThan(order('jsonParser'));
    expect(order('authSession')).toBeGreaterThan(order('urlencodedParser'));
    expect(order('graphqlHandler')).toBeGreaterThan(order('authSession'));
  });

  it('mounts the graphql endpoint on the configured path', () => {
    const graphqlLayer = app._router.stack.find(
      (layer: any) => layer.name === 'graphqlHandler'
    );
    expect(graphqlLayer.regexp.test('/api/graphql')).toBe(true);
  });

  it('mounts the frontend catch-all last', () => {
    expect(app._router.stack.at(-1).route?.path).toBe('*');
  });
});
