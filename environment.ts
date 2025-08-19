import { Entitytyping } from '../../generated-types/type-defs';
export interface Environment {
  apollo: {
    graphqlPath: string;
    introspection: boolean;
    playground: boolean;
    tokenLogging: string;
  };
  port: number | string;
  environment: string;
  sessionSecret: string;
  clientSecret: string;
  version: string;
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
    fileSystemImporterServiceUrl?: string;
    iiifUrl: string;
    iiifUrlFrontend: string;
    storageApiUrl: string;
    storageApiUrlExt: string;
    promUrl: 'no-prom' | string;
    transcodeService?: string;
    ocrService?: string;
  };
  db: {
    mongodb: {
      username?: string;
      password?: string;
      port: string;
      hostname: string;
      dbName: string;
      replicaSet?: string;
    };
  };
  features: {
    simpleSearch: {
      hasSimpleSearch: boolean;
      itemTypes?: Entitytyping[];
      simpleSearchMetadataKey?: string[];
    };
    ipWhiteListing?: {
      whiteListedIpAddresses: string[];
      tokenToUseForWhiteListedIpAddresses: string;
    };
    hasTenantSelect?: boolean;
    hasBulkOperations?: boolean;
    hasBulkSelect?: boolean;
    hideSuperTenant?: boolean;
    hasSavedSearch?: boolean;
    advancedSearch?: {
      queryBy: string;
      queryByWeights?: string;
      filterBy: string;
      sortBy?: string;
      limit?: number;
      perPage?: number;
      facetBy?: string;
    };
    SEO: {
      hasSEO: boolean;
      seoMetadataKeys?: {
        title: string;
        description: string;
        image: string;
      };
    };
    hasPersistentSessions?: boolean;
    supportsMultilingualMetadataEditing?: boolean;
  };
  customization: {
    applicationTitle: string;
    applicationLocale: string;
    hideEmptyFields?: boolean;
    availableLanguages?: string[];
    excludedLanguages?: string[];
    uploadEntityTypeToCreate?: Entitytyping;
    entityIdKey?: string;
  };
  allowAnonymousUsers: boolean;
  tenantDefiningTypes?: string;
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
  skeletonLayouts?: Record<string, string[]>;
}
