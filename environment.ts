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
    promUrl: 'no-prom' | string;
  };
  features: {
    hasSimpleSearch?: boolean;
    hasDirectoryImport?: boolean;
    hasTenantSelect?: boolean;
  };
  customization: {
    applicationTitle: string;
    applicationLocale: string;
  };
  routerConfig: any;
  damsFrontend: string;
  graphqlEndpoint: string;
  staticToken: string | undefined | null;
  sentryEnabled: boolean;
  sentryDsn: string;
  sentryDsnFrontend: string;
  nomadNamespace: string;
  ignorePermissions: boolean;
  maxUploadSize: number;
  bulkSelectAllSizeLimit: number;
}
