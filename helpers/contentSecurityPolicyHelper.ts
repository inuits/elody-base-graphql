import type { Environment } from '../types/environmentTypes';
import { Express } from 'express';
import helmet from 'helmet';
import { Route } from '../routes/routesHelper';
import { RouteNames } from '../../../generated-types/type-defs';

const baseDirectives = {
  ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  'script-src': ["'self'", "'unsafe-eval'", 'blob:'],
  'worker-src': ["'self'", 'blob:'],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://server.arcgisonline.com',
    'https://*.openstreetmap.org',
  ],
  'connect-src': [
    "'self'",
    'blob:',
    '*',
  ],
  'frame-ancestors': ["'self'"],
};

export const createCspMiddleware = (overrides: any) => {
  const merged:{[key: string]: string[]} = { ...baseDirectives };

  for (const key in overrides) {
    if (Array.isArray(merged[key]) && Array.isArray(overrides[key])) {
      merged[key] = [...new Set([...merged[key], ...overrides[key]])];
    } else {
      merged[key] = overrides[key];
    }
  }

  return helmet.contentSecurityPolicy({ directives: merged });
};

export const enableContentSecurityPolicy = (
  app: Express,
  environment: Environment
) => {
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  const appContainsEmbeddedViewer: boolean =
    environment.routerConfig.find(
      (route: Route) => route.name === RouteNames.EmbeddedViewer
    ) !== undefined;

  if (appContainsEmbeddedViewer) {
    const embedDirectives = { ...baseDirectives, 'frame-ancestors': ['*'] };
    app.use(
      '*/embed/viewer',
      helmet.contentSecurityPolicy({
        directives: embedDirectives,
      })
    );
  }

  app.use(helmet.contentSecurityPolicy({ directives: baseDirectives }));
};
