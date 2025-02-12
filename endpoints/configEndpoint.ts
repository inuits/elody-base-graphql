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
          storageApiUrl: config.api.storageApiUrlExt,
        },
        features: {
          simpleSearch: {
            hasSimpleSearch: config.features.simpleSearch.hasSimpleSearch,
            itemTypes: config.features.simpleSearch.itemTypes,
            simpleSearchMetadataKey:
              config.features.simpleSearch.simpleSearchMetadataKey,
          },
          hasTenantSelect: config.features.hasTenantSelect,
          hasBulkOperations:
            config.features.hasBulkSelect === undefined
              ? true
              : config.features.hasBulkOperations,
          hasBulkSelect:
            config.features.hasBulkSelect === undefined
              ? true
              : config.features.hasBulkSelect,
          hideSuperTenant:
            config.features.hideSuperTenant === undefined
              ? false
              : config.features.hideSuperTenant,
          hasSavedSearch: config.features.hasSavedSearch === undefined
              ? false
              : config.features.hasSavedSearch,
          advancedSearch: {
              queryBy: config.features.advancedSearch?.queryBy === undefined
                  ? ""
                  : config.features.advancedSearch.queryBy,
              queryByWeights: config.features.advancedSearch?.queryByWeights === undefined
                  ? ""
                  : config.features.advancedSearch.queryByWeights,
              filterBy: config.features.advancedSearch?.filterBy === undefined
                  ? ""
                  : config.features.advancedSearch?.filterBy,
              sortBy: config.features.advancedSearch.sortBy === undefined
                  ? ""
                  : config.features.advancedSearch?.sortBy,
              limit: config.features.advancedSearch.limit === undefined
                  ? 10
                  : config.features.advancedSearch.limit,
              perPage: config.features.advancedSearch?.perPage === undefined
                  ? 10
                  : config.features.advancedSearch?.perPage,
          },
              
        },
        customization: {
          applicationTitle: config.customization.applicationTitle,
          applicationLocale: config.customization.applicationLocale,
          hideEmptyFields:
            config.customization.hideEmptyFields === undefined
              ? false
              : config.customization.hideEmptyFields,
          entityIdKey: config.customization.entityIdKey || '_id',
        },
        allowAnonymousUsers: config.allowAnonymousUsers,
        tenantDefiningTypes: config.tenantDefiningTypes,
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
