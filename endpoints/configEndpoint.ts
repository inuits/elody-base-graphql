import { Express } from 'express';
import { Environment } from '../environment';

const applyConfigEndpoint = (app: Express, config: Environment) => {
  app.get('/api/config', async (req, res) => {
    res.end(
      JSON.stringify({
        graphQlLink: config.graphqlEndpoint,
        iiifLink: config.api.iiifUrlFrontend,
        oidc: {
          baseUrl: config.oauth.baseUrlFrontend,
          clientId: config.oauth.clientId,
          tokenEndpoint: config.oauth.tokenEndpoint,
          authEndpoint: config.oauth.authEndpoint,
          apiCodeEndpoint: config.oauth.apiCodeEndpoint,
          logoutEndpoint: config.oauth.logoutEndpoint,
          redirectUri: config.damsFrontend,
        },
        api: {
          storageApiUrl: config.api.storageApiUrl,
        },
        features: {
          hasSimpleSearch: config.features.hasSimpleSearch,
          hasTenantSelect: config.features.hasTenantSelect,
          hasDirectoryImport:
            config.features.hasDirectoryImport === undefined
              ? true
              : config.features.hasDirectoryImport,
          hasGridView:
            config.features.hasGridView === undefined
              ? true
              : config.features.hasGridView,
        },
        customization: {
          applicationTitle: config.customization.applicationTitle,
          applicationLocale: config.customization.applicationLocale,
          hideEmptyFields:
            config.customization.hideEmptyFields === undefined
              ? false
              : config.customization.hideEmptyFields,
        },
        routerConfig: config.routerConfig,
        bulkSelectAllSizeLimit: config.bulkSelectAllSizeLimit,
        SENTRY_ENABLED: config.sentryEnabled,
        SENTRY_DSN_FRONTEND: config.sentryDsnFrontend,
        NOMAD_NAMESPACE: config.nomadNamespace,
        IGNORE_PERMISSIONS: config.ignorePermissions,
      })
    );
  });
};

export default applyConfigEndpoint;
