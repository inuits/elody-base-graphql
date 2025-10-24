import { Express } from 'express';
import { Environment } from '../environment';
import { TypeUrlMapping } from '../types';

const getConfig = (config: Environment) => {
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
        clientKeyFormat: config.features.simpleSearch.clientKeyFormat,
      },
    });

  return baseConfig;
};

const getAvailableTranslations = (
  config: { [key: string]: any },
  translations: { [key: string]: string }
) => {
  const includedTranslationKeys: string[] | undefined =
    config.customization?.availableLanguages;
  const excludedTranslationKeys: string[] | undefined =
    config.customization?.excludedLanguages;

  if (!includedTranslationKeys && !excludedTranslationKeys) {
    return translations;
  }

  let availableTranslations: { [key: string]: string } = {};

  if (includedTranslationKeys) {
    includedTranslationKeys.forEach((key: string) => {
      if (!(key in translations)) {
        console.error(
          `Language with key ${key} not available in translations, check if you are using the correct key or add translations for '${key}'`
        );
      } else {
        availableTranslations[key] = translations[key];
      }
    });
  } else {
    availableTranslations = { ...translations };
  }

  if (excludedTranslationKeys) {
    excludedTranslationKeys.forEach((key: string) => {
      if (key in availableTranslations) {
        delete availableTranslations[key];
      }
    });
  }

  return availableTranslations;
};

export const applyAppConfigsEndpoint = (
  app: Express,
  config: Environment,
  translations: { [key: string]: string },
  urlMapping: TypeUrlMapping
) => {
  app.get('/api/app-configs', async (req, res) => {
    res.end(
      JSON.stringify({
        config: getConfig(config),
        translations: getAvailableTranslations(config, translations),
        urlMapping,
        version: { 'apollo-graphql-version': config.version },
      })
    );
  });
};
