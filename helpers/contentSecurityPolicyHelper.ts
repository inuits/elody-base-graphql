import type { Environment } from '../types/environmentTypes';
import { Express } from 'express';
import helmet from 'helmet';
import { Route } from '../routes/routesHelper';
import { RouteNames } from '../../../generated-types/type-defs';

export const enableContentSecurityPolicy = (
  app: Express,
  environment: Environment
) => {
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  const directives = {
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
      ...(environment.sentryEnabled && environment.sentryDsn
        ? [new URL(environment.sentryDsn).origin]
        : []),
    ],
    'frame-ancestors': ["'self'"],
  };

  const appContainsEmbeddedViewer: boolean =
    environment.routerConfig.find(
      (route: Route) => route.name === RouteNames.EmbeddedViewer
    ) !== undefined;

  if (appContainsEmbeddedViewer) {
    const embedDirectives = directives
    embedDirectives['frame-ancestors'] = ["*"];
    app.use(
      '*/embed/viewer',
      helmet.contentSecurityPolicy({
        embedDirectives,
      })
    );
  }

  app.use(helmet.contentSecurityPolicy({ directives }));
};
