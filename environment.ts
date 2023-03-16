const defaultPort = 4000;

export interface Environment {
  apollo: {
    graphqlPath: string;
    introspection: boolean;
    playground: boolean;
    tokenLogging: string;
  };
  port: number | string;
  sessionSecret: string;
  clientSecret: string;
  oauth: {
    baseUrl: string;
    baseUrlFrontend: string;
    clientId: string;
    tokenEndpoint: string;
    authEndpoint: string;
    apiCodeEndpoint: string;
    logoutEndpoint: string;
  };
  api: {
    collectionApiUrl: string;
    searchApiUrl: string;
    csvImportServiceUrl: string;
    iiifUrl: string;
    iiifUrlFrontend: string;
    storageApiUrl: string;
  };
  features: {
    useOldSingleEntityComponent: boolean;
  };
  damsFrontend: string;
  graphqlEndpoint: string;
  staticToken: string | undefined | null;
  sentryEnabled: boolean;
  sentryDsn: string;
  sentryDsnFrontend: string;
  nomadNamespace: string;
  ignorePermissions: boolean;
  maxUploadSize: number;
}

export const environment: Environment = {
  apollo: {
    graphqlPath: process.env.APOLLO_GRAPHQL_PATH || '/api/graphql',
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true',
    tokenLogging: process.env.APOLLO_TOKENLOGGING || 'false',
  },
  port: process.env.PORT || defaultPort,
  sessionSecret: process.env.APOLLO_SESSION_SECRET || '',
  clientSecret:
    process.env.APOLLO_CLIENT_SECRET || 'c9d9c9f7-e4b2-4bf3-b5a7-ad5e53d7ee31',
  oauth: {
    baseUrl:
      process.env.OAUTH_BASE_URL || 'http://keycloak:8080/auth/realms/dams',
    baseUrlFrontend:
      process.env.OAUTH_BASE_URL_FRONTEND ||
      'http://keycloak.dams.localhost:8100/auth/realms/dams',
    clientId: process.env.OAUTH_CLIENT_ID || 'dams-dashboard',
    tokenEndpoint:
      process.env.OAUTH_TOKEN_ENDPOINT || '/protocol/openid-connect/token',
    logoutEndpoint:
      process.env.OAUTH_LOGOUT_ENDPOINT || '/protocol/openid-connect/logout',
    authEndpoint:
      process.env.OAUTH_AUTH_ENDPOINT || '/protocol/openid-connect/auth',
    apiCodeEndpoint: process.env.OAUTH_API_CODE_ENDPOINT || '/api/auth_code',
  },
  api: {
    collectionApiUrl:
      process.env.COLLECTION_API_URL || 'http://collection-api:8000',
    searchApiUrl: process.env.SEARCH_API_URL || 'http://search-api:8002',
    csvImportServiceUrl:
      process.env.CSV_IMPORTER_URL || 'http://dams-csv-import-service:8003',
    iiifUrl: process.env.IMAGE_API_URL || 'http://cantaloupe:8182/iiif/image',
    iiifUrlFrontend:
      process.env.IMAGE_API_URL_EXT || 'http://localhost:8182/iiif/image',
    storageApiUrl:
      process.env.STORAGE_API_URL || 'http://storage-api.dams.localhost:8100/',
  },
  features: {
    useOldSingleEntityComponent:
      process.env.OLD_SINGLE_ENTITY_COMPONENT === 'true',
  },
  damsFrontend:
    process.env.DAMS_FRONTEND_URL || 'http://dashboard.dams.localhost:8100',
  graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || '/api/graphql',
  staticToken: process.env.STATIC_JWT || undefined,
  sentryEnabled: process.env.SENTRY_ENABLED === 'true',
  sentryDsn: process.env.SENTRY_DSN || '',
  sentryDsnFrontend: process.env.SENTRY_DSN_FRONTEND || '',
  nomadNamespace: process.env.NOMAD_NAMESPACE || '',
  ignorePermissions: process.env.IGNORE_PERMISSIONS === 'true',
  maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE) || 250 * 1024000,
};
