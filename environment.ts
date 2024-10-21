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
  features: {
    simpleSearch: {
      hasSimpleSearch: boolean;
      itemTypes?: Entitytyping[];
      simpleSearchMetadataKey?: string[];
    };
    hasTenantSelect?: boolean;
    hasBulkOperations?: boolean;
    hasBulkSelect?: boolean;
    hideSuperTenant?: boolean;
    hasSavedSearch?: boolean;
    SEO: {
      hasSEO: boolean;
      seoMetadataKeys?: {
        title: string;
        description: string;
        image: string;
      };
    };
  };
  customization: {
    applicationTitle: string;
    applicationLocale: string;
    hideEmptyFields?: boolean;
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
}
