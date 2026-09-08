import { Express } from 'express';
import { Environment } from '../types/environmentTypes';
import { TypeUrlMapping } from '../types';
import { mergeObjects } from 'json-merger';
import { loadTranslationsFromDirectory } from '../translations/loadTranslations';
import { resolveKeyboardLayouts } from '../sources/virtualKeyboardLayouts';
import path from 'path';
import { DataSources } from '../types';
import { Permission, PermissionRequestInfo } from '../generated-types/type-defs';
import {
  evaluateAdvancedPermission,
  isEntityTypePermitted,
} from '../helpers/permissions';
import type { ModuleFeature } from '../helpers/moduleContributions';

export type AppConfigRequestContext = {
  buildDataSources: (req: any) => DataSources;
  permissions: { [key: string]: PermissionRequestInfo };
  features: { [key: string]: ModuleFeature };
};

export const getConfig = (config: Environment) => {
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
      enableCrossTabAuthSync:
        config.features.enableCrossTabAuthSync === undefined
          ? true
          : config.features.enableCrossTabAuthSync,
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
    listingCountCap: config.listingCountCap,
    GLITCH_TIP_ENABLED: config.glitchtipEnabled,
    GLITCH_TIP_DSN_FRONTEND: config.glitchtipDsnFrontend,
    NOMAD_NAMESPACE: config.nomadNamespace,
    DEPLOYMENT_ENVIRONMENT: process.env.DEPLOYMENT_ENVIRONMENT || '',
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
        virtualKeyboardLayouts: resolveKeyboardLayouts(
          config.features.simpleSearch.virtualKeyboardLayouts
        ),
      },
    });

  if (config.features.globalNotification) {
    Object.assign(baseConfig.features, {
      globalNotification: {
        title: config.features.globalNotification.title,
        description: config.features.globalNotification.description,
      },
    });
  }

  return baseConfig;
};

const getAvailableTranslations = (
  config: { [key: string]: any },
  translations: { [key: string]: Object }
) => {
  const baseTranslations: Object = loadTranslationsFromDirectory(
    path.join(__dirname, `../translations`)
  );
  const fullTranslations = mergeObjects([baseTranslations, translations]);

  const includedTranslationKeys: string[] | undefined =
    config.customization?.availableLanguages;

  if (!includedTranslationKeys) {
    return fullTranslations;
  }

  let availableTranslations: { [key: string]: Object } = {};

  if (includedTranslationKeys) {
    includedTranslationKeys.forEach((key: string) => {
      if (!(key in translations)) {
        console.error(
          `Language with key ${key} not available in translations, check if you are using the correct key or add translations for '${key}'`
        );
      } else {
        availableTranslations[key] = fullTranslations[key];
      }
    });
  } else {
    availableTranslations = { ...fullTranslations };
  }

  return availableTranslations;
};

// Features an installed module contributes. One that names a permission is
// reported as enabled only to a user who passes it, so the frontend can render
// on the flag alone.
export const resolveModuleFeatures = async (
  req: any,
  requestContext?: AppConfigRequestContext
): Promise<{ [key: string]: { enabled: boolean } }> => {
  if (!requestContext) return {};

  const featureNames = Object.keys(requestContext.features);
  const dataSources = featureNames.some(
    (name) => requestContext.features[name].permission
  )
    ? requestContext.buildDataSources(req)
    : undefined;

  const resolved = await Promise.all(
    featureNames.map(async (name) => {
      const feature = requestContext.features[name];
      if (!feature.enabled || !feature.permission || !dataSources)
        return [name, { enabled: feature.enabled }] as const;
      const isPermitted = await evaluateAdvancedPermission(
        feature.permission,
        dataSources,
        requestContext.permissions
      );
      return [name, { enabled: isPermitted }] as const;
    })
  );

  return Object.fromEntries(resolved);
};

// Simple search offers only the item types the user may read, so the frontend
// builds its filter off the config it was handed.
export const resolveReadableSimpleSearchTypes = async (
  req: any,
  itemTypes: string[],
  requestContext?: AppConfigRequestContext
): Promise<string[]> => {
  if (!itemTypes.length || !requestContext) return itemTypes;

  const dataSources = requestContext.buildDataSources(req);
  const verdicts = await Promise.all(
    itemTypes.map((itemType) =>
      isEntityTypePermitted(itemType, Permission.Canread, dataSources)
    )
  );
  return itemTypes.filter((_itemType, index) => verdicts[index]);
};

const resolveSimpleSearch = async (
  req: any,
  simpleSearch: { itemTypes?: string[] } | undefined,
  requestContext?: AppConfigRequestContext
) => {
  if (!simpleSearch) return {};
  return {
    simpleSearch: {
      ...simpleSearch,
      itemTypes: await resolveReadableSimpleSearchTypes(
        req,
        simpleSearch.itemTypes ?? [],
        requestContext
      ),
    },
  };
};

export const applyAppConfigsEndpoint = (
  app: Express,
  config: Environment,
  translations: { [key: string]: Object },
  urlMapping: TypeUrlMapping,
  requestContext?: AppConfigRequestContext
) => {
  app.get('/api/app-configs', async (req, res) => {
    const appConfig = getConfig(config);
    const [moduleFeatures, simpleSearch] = await Promise.all([
      resolveModuleFeatures(req, requestContext),
      resolveSimpleSearch(
        req,
        (appConfig.features as { simpleSearch?: { itemTypes?: string[] } })
          .simpleSearch,
        requestContext
      ),
    ]);
    res.end(
      JSON.stringify({
        config: {
          ...appConfig,
          features: { ...appConfig.features, ...moduleFeatures, ...simpleSearch },
        },
        translations: getAvailableTranslations(config, translations),
        urlMapping,
        version: { 'apollo-graphql-version': config.version },
      })
    );
  });
};
