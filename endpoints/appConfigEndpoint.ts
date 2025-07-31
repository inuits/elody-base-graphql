import { Express } from 'express';
import { Environment } from '../environment';
import { TypeUrlMapping } from '../types';

const getConfig = (config: Environment) => {
  console.log(config)
  const baseConfig = {
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
      hasSavedSearch:
        config.features.hasSavedSearch === undefined
          ? false
          : config.features.hasSavedSearch,
      supportsMultilingualMetadataEditing:
        config.features.supportsMultilingualMetadataEditing === undefined
          ? false
          : config.features.supportsMultilingualMetadataEditing,
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
    skeletonLayouts: config.skeletonLayouts,
  };

  if (config.features.advancedSearch)
    Object.assign(baseConfig.features, {
      advancedSearch: {
        queryBy: config.features.advancedSearch.queryBy || '',
        queryByWeights: config.features.advancedSearch.queryByWeights || '',
        filterBy: config.features.advancedSearch.filterBy || '',
        sortBy: config.features.advancedSearch.sortBy || '',
        limit: config.features.advancedSearch.limit || 10,
        perPage: config.features.advancedSearch.perPage || 10,
        facetBy: config.features.advancedSearch.facetBy || '',
      },
    });

  if (config.features.simpleSearch)
    Object.assign(baseConfig.features, {
      simpleSearch: {
        itemTypes: config.features.simpleSearch.itemTypes,
        simpleSearchMetadataKey:
          config.features.simpleSearch.simpleSearchMetadataKey,
      },
    });

  return baseConfig;
};

export const applyAppConfigsEndpoint = (app: Express, config: Environment, translations: Object, urlMapping: TypeUrlMapping ) => {
  app.get('/api/app-configs', async (req, res) => {
    res.end(JSON.stringify({ 
        config: getConfig(config), 
        translations, 
        urlMapping, 
        version: { 'apollo-graphql-version': config.version } 
      }));
  });
};