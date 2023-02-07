import { Express } from 'express';
import { environment } from './environment';

const applyConfigEndpoint = (app: Express) => {
  app.get('/api/config', async (req, res) => {
    res.end(
      JSON.stringify({
        graphQlLink: environment.graphqlEndpoint,
        iiifLink: environment.api.iiifUrlFrontend,
        oidc: {
          baseUrl: environment.oauth.baseUrlFrontend,
          clientId: environment.oauth.clientId,
          tokenEndpoint: environment.oauth.tokenEndpoint,
          authEndpoint: environment.oauth.authEndpoint,
          apiCodeEndpoint: environment.oauth.apiCodeEndpoint,
          logoutEndpoint: environment.oauth.logoutEndpoint,
          redirectUri: environment.damsFrontend,
        },
        SENTRY_ENABLED: environment.sentryEnabled,
        SENTRY_DSN_FRONTEND: environment.sentryDsnFrontend,
        NOMAD_NAMESPACE: environment.nomadNamespace,
        IGNORE_PERMISSIONS: environment.ignorePermissions,
      })
    );
  });
};

export default applyConfigEndpoint;
