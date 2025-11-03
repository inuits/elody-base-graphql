import {
  Environment,
  FullyOptionalEnvironmentInput,
} from './types/environmentTypes';

export let currentEnvironment: Environment | undefined = undefined;

export const setCurrentEnvironment = (environment: Environment): void => {
  currentEnvironment = environment;
};

export const getCurrentEnvironment = (): Environment => {
  if (!currentEnvironment) throw new Error('Environment not found');
  return currentEnvironment;
};

export const baseEnvironment: Environment = {
  apollo: {
    graphqlPath: process.env.APOLLO_GRAPHQL_PATH || '/api/graphql',
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true',
    tokenLogging: process.env.APOLLO_TOKEN_LOGGING || 'false',
    maxQueryDepth: Number(process.env.APOLLO_MAX_QUERY_DEPTH) || 10,
  },
  environment: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  sessionSecret: process.env.SESSION_SECRET || 'heelgeheim',
  clientSecret:
    process.env.CLIENT_SECRET || 'c9d9c9f7-e4b2-4bf3-b5a7-ad5e53d7ee31',
  version: process.env.VERSION || 'development-version',
  oauth: {
    baseUrl:
      process.env.OAUTH_BASE_URL || 'http://keycloak:8080/auth/realms/elody',
    baseUrlFrontend:
      process.env.OAUTH_BASE_URL_FRONTEND ||
      'http://keycloak.elody.localhost:8100/auth/realms/elody',
    clientId: process.env.OAUTH_CLIENT_ID || 'elody-dashboard',
    tokenEndpoint:
      process.env.OAUTH_TOKEN_ENDPOINT || '/protocol/openid-connect/token',
    logoutEndpoint:
      process.env.OAUTH_LOGOUT_ENDPOINT || '/protocol/openid-connect/logout',
    authEndpoint:
      process.env.OAUTH_AUTH_ENDPOINT || '/protocol/openid-connect/auth',
    apiCodeEndpoint: process.env.OAUTH_API_CODE_ENDPOINT || '/api/auth_code',
  },
  api: {
    promUrl: 'no-prom',
    collectionApiUrl:
      process.env.COLLECTION_API_URL || 'http://collection-api-elody:5000/',
    csvImportServiceUrl:
      process.env.CSV_IMPORTER_URL || 'http://dams-csv-import-service:8003',
    fileSystemImporterServiceUrl:
      process.env.FILE_SYSTEM_IMPORTER_URL ||
      'http://filesystem-importer-service:5000',
    iiifUrl: process.env.IMAGE_API_URL || 'http://cantaloupe:8182',
    iiifUrlFrontend:
      process.env.IMAGE_API_URL_EXT || 'http://cantaloupe.elody.localhost:8000',
    storageApiUrl:
      process.env.STORAGE_API_URL || 'http://storage-api-elody:5000/',
    storageApiUrlExt:
      process.env.STORAGE_API_URL_EXT ||
      'http://storage-api.elody.localhost:8000/',
    transcodeService:
      process.env.TRANSCODE_SERVICE_URL || 'http://transcode-service:5000/',
    ocrService: process.env.OCR_SERVICE_URL || 'http://ocr-service:5000/',
  },
  db: {
    mongodb: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
      port: process.env.MONGODB_PORT || '27017',
      hostname: process.env.MONGODB_HOSTS || 'mongo',
      dbName: process.env.MONGODB_DB_NAME || 'dams',
      replicaSet: process.env.MONGODB_REPLICA_SET,
      tls: process.env.MONGODB_TLS === 'true' || undefined,
      authSource: process.env.MONGODB_AUTH_SOURCE,
    },
  },
  features: {
    hasTenantSelect: false,
    hasBulkOperations: true,
    hasBulkSelect: true,
    hideSuperTenant: true,
    hasSavedSearch: false,
    hasPersistentSessions: true,
    supportsMultilingualMetadataEditing: false,
  },
  customization: {
    applicationTitle: process.env.APPLICATION_TITLE || 'Elody',
    applicationLocale: process.env.APPLICATION_LOCALE || 'en',
    hideEmptyFields: false,
    excludedLanguages: ['ar'],
    entityIdKey: '_id',
  },
  allowAnonymousUsers:
    process.env.ALLOW_ANONYMOUS_USERS?.toLowerCase() === 'true',
  routerConfig: [],
  damsFrontend:
    process.env.DAMS_FRONTEND_URL || 'http://dashboard.dams.localhost:8100',
  graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || '/api/graphql',
  staticToken: process.env.STATIC_JWT || undefined,
  sentryEnabled: process.env.SENTRY_ENABLED === 'true',
  sentryDsn: process.env.SENTRY_DSN || '',
  sentryDsnFrontend: process.env.SENTRY_DSN_FRONTEND || '',
  nomadNamespace: process.env.NOMAD_NAMESPACE || '',
  ignorePermissions: false,
  maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE) || 250 * 1024000,
  bulkSelectAllSizeLimit: 1000,
};

const deepMerge = <TBase, TOverride>(
  target: TBase,
  source: TOverride
): TBase & TOverride => {
  const output: any = { ...target };
  for (const key in source) {
    const sourceValue = (source as any)[key];
    const targetValue = (target as any)[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      output[key] = deepMerge(targetValue || {}, sourceValue);
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  }
  return output;
};

export const createElodyEnvironment = (
  environmentInput: FullyOptionalEnvironmentInput
): Environment => {
  const merged = deepMerge(baseEnvironment, environmentInput);
  return merged as Environment;
};
