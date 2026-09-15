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
import { baseModule, baseSchema } from './baseModule/baseModule';
import {
  getRelationsByType,
  getPrimaryMediaFileIDOfEntity,
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
import type {
  CollectionAPIEntity,
  CollectionAPIMediaFile,
  CollectionAPIMetadata,
  CollectionAPIRelation,
} from './types/collectionAPITypes';
import { fetchWithTokenRefresh } from './endpoints/fetchWithToken';
import { ElodyModuleConfig } from './helpers/elodyModuleHelpers';
import { setId, setType } from './parsers/entity';
import { createCspMiddleware } from './helpers/contentSecurityPolicyHelper';
import { ElodyInstance, ElodyInstanceOptions } from './elodyInstance';
import { TranscodeService } from './sources/transcode';

const start = (options: ElodyInstanceOptions) =>
  new ElodyInstance(options).start();

export { ElodyInstance };
export type { ElodyInstanceOptions };
export default start;
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
  ElodyModuleConfig,
};
export {
  loadTranslationsFromDirectory,
  getCurrentEnvironment,
  baseModule,
  baseSchema,
  resolveMetadata,
  getRelationsByType,
  getPrimaryMediaFileIDOfEntity,
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
};
