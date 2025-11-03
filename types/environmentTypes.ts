import { Entitytyping } from '../../../generated-types/type-defs';
import { Route } from '../routes/routesHelper';

export interface Environment {
  apollo: {
    graphqlPath: string;
    introspection: boolean;
    playground: boolean;
    tokenLogging: string;
    maxQueryDepth: number;
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
      tls?: boolean;
      authSource?: string;
    };
  };
  features: {
    simpleSearch?: {
      itemTypes: Entitytyping[];
      simpleSearchMetadataKey: string[];
      clientKeyFormat?: string[];
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
    SEO?: {
      seoMetadataKeys: {
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
  routerConfig: Route[];
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

// Todo: Find a better way to create a fully optional mirror of Environment
export interface FullyOptionalEnvironmentInput {
  apollo?: {
    graphqlPath?: string;
    introspection?: boolean;
    playground?: boolean;
    tokenLogging?: string;
    maxQueryDepth?: number;
  };
  port?: number | string;
  environment?: string;
  sessionSecret?: string;
  clientSecret?: string;
  version?: string;
  oauth?: {
    baseUrl?: string;
    baseUrlFrontend?: string;
    clientId?: string;
    tokenEndpoint?: string;
    authEndpoint?: string;
    apiCodeEndpoint?: string;
    logoutEndpoint?: string;
  };
  api?: {
    collectionApiUrl?: string;
    csvImportServiceUrl?: string;
    fileSystemImporterServiceUrl?: string;
    iiifUrl?: string;
    iiifUrlFrontend?: string;
    storageApiUrl?: string;
    storageApiUrlExt?: string;
    promUrl?: 'no-prom' | string;
    transcodeService?: string;
    ocrService?: string;
  };
  db?: {
    mongodb?: {
      username?: string;
      password?: string;
      port?: string;
      hostname?: string;
      dbName?: string;
      replicaSet?: string;
      tls?: boolean;
      authSource?: string;
    };
  };
  features?: {
    simpleSearch?: {
      itemTypes?: Entitytyping[];
      simpleSearchMetadataKey?: string[];
      clientKeyFormat?: string[];
    };
    ipWhiteListing?: {
      whiteListedIpAddresses?: string[];
      tokenToUseForWhiteListedIpAddresses?: string;
    };
    hasTenantSelect?: boolean;
    hasBulkOperations?: boolean;
    hasBulkSelect?: boolean;
    hideSuperTenant?: boolean;
    hasSavedSearch?: boolean;
    advancedSearch?: {
      queryBy?: string;
      queryByWeights?: string;
      filterBy?: string;
      sortBy?: string;
      limit?: number;
      perPage?: number;
      facetBy?: string;
    };
    SEO?: {
      seoMetadataKeys?: {
        title?: string;
        description?: string;
        image?: string;
      };
    };
    hasPersistentSessions?: boolean;
    supportsMultilingualMetadataEditing?: boolean;
  };
  customization?: {
    applicationTitle?: string;
    applicationLocale?: string;
    hideEmptyFields?: boolean;
    availableLanguages?: string[];
    excludedLanguages?: string[];
    uploadEntityTypeToCreate?: Entitytyping;
    entityIdKey?: string;
  };
  allowAnonymousUsers?: boolean;
  tenantDefiningTypes?: string;
  routerConfig?: Route[];
  damsFrontend?: string;
  graphqlEndpoint?: string;
  staticToken?: string | undefined | null;
  sentryEnabled?: boolean;
  sentryDsn?: string;
  sentryDsnFrontend?: string;
  nomadNamespace?: string;
  ignorePermissions?: boolean;
  maxUploadSize?: number;
  bulkSelectAllSizeLimit?: number;
  skeletonLayouts?: Record<string, string[]>;
}
