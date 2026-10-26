import { AuthRESTDataSource } from './auth/AuthRESTDataSource';
import {
  resolveMetadata,
  resolveId,
  resolveRelations,
  simpleReturn,
} from './resolvers/entityResolver';
import applyPromEndpoint from './endpoints/promEndpoint';
import path from 'path';
import { getRoutesObject } from './routes/routesHelper';
import type {
  Route,
  RouteMeta,
  RouteQueries,
  RouteLogo,
  Breadcrumb,
  BreadcrumbTitle,
  SimpleSearch,
  LandingRedirect,
} from './routes/routesHelper';
import { baseModule, baseSchema } from './baseModule/baseModule';
import {
  getRelationsByType,
  getPrimaryThumbnailIDOfEntity,
  isIpAddressWhitelisted,
  getClientOrigin,
  isDomainWhitelisted,
} from './helpers/helpers';
import { ContextValue, DataSources, FormattersConfig } from './types';
import { getCurrentEnvironment } from './environment';
import {
  Environment,
  FullyOptionalEnvironmentInput,
} from './types/environmentTypes';
import {
  getMetadataItemValueByKey,
  getEntityId,
  extractErrorCode,
} from './helpers/helpers';
import { mayUpdateEntity, mayDeleteEntity } from './helpers/permissions';
import { loadTranslationsFromDirectory } from './translations/loadTranslations';
import {
  allKeyboardLayouts,
  resolveKeyboardLayouts,
} from './sources/virtualKeyboardLayouts';
import { parseIdToGetMoreData } from './parsers/entity';
import { renderPageForEnvironment } from './endpoints/frontendEndpoint';
import {
  entityFormats,
  proxyEntityInFormat,
} from './endpoints/linkedOpenDataEndpoint';
import type {
  CollectionAPIEntity,
  CollectionAPIMediaFile,
  CollectionAPIMetadata,
  CollectionAPIRelation,
} from './types/collectionAPITypes';
import { fetchWithTokenRefresh } from './endpoints/fetchWithToken';
import {
  defineElodyModule,
  requireSettings,
} from './helpers/elodyModule';
import type {
  ElodyModule,
  ElodyModuleDefinition,
  ElodyDataSource,
  ElodyDataSourceClass,
  ElodyEndpoint,
} from './helpers/elodyModule';
import { setId, setType } from './parsers/entity';
import { createCspMiddleware } from './helpers/contentSecurityPolicyHelper';
import { ElodyInstance, ElodyInstanceOptions } from './elodyInstance';
import { TranscodeService } from './sources/transcode';
import { saveEntityRelations } from './resolvers/saveEntityRelations';

export { ElodyInstance, defineElodyModule, requireSettings };
export type {
  ElodyInstanceOptions,
  ElodyModule,
  ElodyModuleDefinition,
  ElodyDataSource,
  ElodyDataSourceClass,
  ElodyEndpoint,
};
export type {
  ContextValue,
  DataSources,
  FullyOptionalEnvironmentInput,
  Environment,
  FormattersConfig,
  CollectionAPIEntity,
  CollectionAPIMediaFile,
  CollectionAPIMetadata,
  CollectionAPIRelation,
  Route,
  RouteMeta,
  RouteQueries,
  RouteLogo,
  Breadcrumb,
  BreadcrumbTitle,
  SimpleSearch,
  LandingRedirect,
};
export {
  loadTranslationsFromDirectory,
  getCurrentEnvironment,
  baseModule,
  baseSchema,
  resolveMetadata,
  getRelationsByType,
  getPrimaryThumbnailIDOfEntity,
  parseIdToGetMoreData,
  applyPromEndpoint,
  AuthRESTDataSource,
  getMetadataItemValueByKey,
  getEntityId,
  extractErrorCode,
  fetchWithTokenRefresh,
  resolveId,
  resolveRelations,
  simpleReturn,
  getRoutesObject,
  renderPageForEnvironment,
  entityFormats,
  proxyEntityInFormat,
  createCspMiddleware,
  setId,
  setType,
  TranscodeService,
  isIpAddressWhitelisted,
  getClientOrigin,
  isDomainWhitelisted,
  allKeyboardLayouts,
  resolveKeyboardLayouts,
  mayUpdateEntity,
  mayDeleteEntity,
  saveEntityRelations,
};
