import { Entitytyping, ViewModes } from '../../generated-types/type-defs';
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
    simpleSearch: {
      hasSimpleSearch: boolean;
      simpleSearchEntityTypes?: Entitytyping[];
      simpleSearchMetadataKey?: string;
    };
    hasDirectoryImport?: boolean;
    hasTenantSelect?: boolean;
    hasBulkSelect?: boolean;
    hideSuperTenant?: boolean;
    allowedViewModes?: ViewModes[];
  };
  customization: {
    applicationTitle: string;
    applicationLocale: string;
    hideEmptyFields?: boolean;
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
