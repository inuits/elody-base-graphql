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
  ApolloServer: vi.fn(function () {
    return {
      start: vi.fn(async () => {}),
      cache: {},
    };
  }),
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
    expect(order('sanitizeGraphqlVariables')).toBe(order('graphqlHandler') - 1);
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

describe('ElodyInstance module contributions', () => {
  const buildInstanceWith = (module: any, api: any = { promUrl: 'no-prom' }) =>
    new ElodyInstance({
      customModuleConfig: { modules: [module], dataSources: {} },
      appConfig: {
        environment: 'production',
        api,
        features: { SEO: false },
      } as any,
      customTranslations: {},
    });

  it('registers the data sources a module ships', async () => {
    class ShippedAPI {
      constructor(public options: any) {}
    }
    const instance: any = buildInstanceWith({
      id: 'shippingModule',
      elodyDataSources: { ShippedAPI },
    });
    await instance.buildApp();

    const dataSources = instance.buildDataSources({ session: {}, headers: {} });
    expect(dataSources.ShippedAPI).toBeInstanceOf(ShippedAPI);
  });

  it('starts when a module requirement is met by the app config', async () => {
    const instance = buildInstanceWith(
      {
        id: 'importModule',
        elodyRequirements: {
          environment: {
            'api.fileSystemImporterServiceUrl': 'FILE_SYSTEM_IMPORTER_URL',
          },
        },
      },
      { promUrl: 'no-prom', fileSystemImporterServiceUrl: 'http://importer' }
    );

    await expect(instance.buildApp()).resolves.toBeDefined();
  });

  it('refuses to start when a module needs a setting that is not set', async () => {
    const instance = buildInstanceWith({
      id: 'importModule',
      elodyRequirements: {
        environment: {
          'api.fileSystemImporterServiceUrl': 'FILE_SYSTEM_IMPORTER_URL',
        },
      },
    });

    await expect(instance.buildApp()).rejects.toThrow(
      'importModule requires settings that are not set: FILE_SYSTEM_IMPORTER_URL'
    );
  });
});
