import { Entitytyping } from '../../generated-types/type-defs';
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
    storageApiUrlExt: string;
    promUrl: 'no-prom' | string;
    transcodeService?: string;
  };
  features: {
    simpleSearch: {
      hasSimpleSearch: boolean;
      simpleSearchEntityTypes?: Entitytyping[];
      itemTypes?: Entitytyping[];
      simpleSearchMetadataKey?: string[];
    };
    hasDirectoryImport?: boolean;
    hasTenantSelect?: boolean;
    hasBulkSelect?: boolean;
    hideSuperTenant?: boolean;
    SEO: {
      hasSEO: boolean;
      seoMetadataKeys?: {
        title: string;
        description: string;
        image: string;
      };
    };
    useFiltersV2?: boolean;
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
