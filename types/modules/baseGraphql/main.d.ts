import { AuthRESTDataSource } from './auth/AuthRESTDataSource';
import { resolveMetadata, resolveId, resolveRelations, simpleReturn } from './resolvers/entityResolver';
import applyPromEndpoint from './endpoints/promEndpoint';
import { getRoutesObject } from './routes/routesHelper';
import { baseModule, baseSchema } from './baseModule/baseModule';
import { getRelationsByType, getPrimaryMediaFileIDOfEntity } from './helpers/helpers';
import { Collection, InputField, PermissionRequestInfo } from '../../generated-types/type-defs';
import { ContextValue, DataSources, FormattersConfig, TypeUrlMapping } from './types';
import { getCurrentEnvironment } from './environment';
import { Environment, FullyOptionalEnvironmentInput } from './types/environmentTypes';
import { getMetadataItemValueByKey, getEntityId } from './helpers/helpers';
import { loadTranslationsFromDirectory } from './translations/loadTranslations';
import { parseIdToGetMoreData } from './parsers/entity';
import { renderPageForEnvironment } from './endpoints/frontendEndpoint';
import type { CollectionAPIEntity, CollectionAPIMediaFile, CollectionAPIMetadata, CollectionAPIRelation } from './types/collectionAPITypes';
import { ElodyModuleConfig } from './helpers/elodyModuleHelpers';
import { createCspMiddleware } from './helpers/contentSecurityPolicyHelper';
declare const start: (customModuleConfig: ElodyModuleConfig, appConfig: FullyOptionalEnvironmentInput, customTranslations: {
    [key: string]: Object;
}, customEndpoints?: ((app: any, environment: Environment) => void)[], customInputFields?: {
    [key: string]: InputField;
} | undefined, customTypeCollectionMapping?: {
    [key: string]: Collection;
} | undefined, customPermissions?: {
    [key: string]: PermissionRequestInfo;
}, customFormatters?: FormattersConfig, customTypeUrlMapping?: TypeUrlMapping, customTypePillLabelMapping?: {
    [key: string]: string[];
} | undefined) => void;
export default start;
export type { ContextValue, DataSources, FullyOptionalEnvironmentInput, Environment, FormattersConfig, CollectionAPIEntity, CollectionAPIMediaFile, CollectionAPIMetadata, CollectionAPIRelation, ElodyModuleConfig, };
export { loadTranslationsFromDirectory, getCurrentEnvironment, baseModule, baseSchema, resolveMetadata, getRelationsByType, getPrimaryMediaFileIDOfEntity, parseIdToGetMoreData, applyPromEndpoint, AuthRESTDataSource, getMetadataItemValueByKey, getEntityId, resolveId, resolveRelations, simpleReturn, getRoutesObject, renderPageForEnvironment, createCspMiddleware, };
