import applyConfigEndpoint from '../endpoints/configEndpoint';
import { applyAuthEndpoints } from '../auth';
import { Express } from 'express';
import { Environment } from '../environment';
import { applyVersionEndpoint } from '../endpoints/versionEndpoint';
import { applyUrlMappingEndpoint } from '../endpoints/urlMappingEndpoint';
import { applyDownloadEndpoint } from '../endpoints/downloadEndpoint';
import { applyUploadEndpoint } from '../endpoints/uploadEndpoint';
import { applyExportEndpoint } from '../endpoints/exportEndpoint';
import applyMediaFileEndpoint from '../endpoints/mediafilesEndpoint';
import { applyTranslationEndpoint } from '../endpoints/translationEndpoint';
import { applyTenantEndpoint } from '../endpoints/tenantEndpoint';
import { applyHealthEndpoint } from '../endpoints/healthEndpoint';
import { TypeUrlMapping } from '../types';

export const defaultElodyEndpointMapping: Record<string, Function> = {
  authEndpoint: (app: Express, oauthBaseUrl: string, clientSecret: string) =>
    applyAuthEndpoints(app, oauthBaseUrl, clientSecret),
  configEndpoint: (app: Express, config: Environment) =>
    applyConfigEndpoint(app, config),
  versionEndpoint: (app: Express, config: Environment) =>
    applyVersionEndpoint(app, config),
  urlMappingEndpoint: (app: Express, urlMapping: TypeUrlMapping) =>
    applyUrlMappingEndpoint(app, urlMapping),
  downloadEndpoint: (app: Express) => applyDownloadEndpoint(app),
  uploadEndpoint: (app: Express) => applyUploadEndpoint(app),
  exportEndpoint: (app: Express) => applyExportEndpoint(app),
  mediafileEndpoint: (
    app: Express,
    storageApiUrl: string,
    iiifURLFrontend: string,
    staticTokenInput: any
  ) =>
    applyMediaFileEndpoint(
      app,
      storageApiUrl,
      iiifURLFrontend,
      staticTokenInput
    ),
  translationEndpoint: (app: Express, appTranslations: Object) =>
    applyTranslationEndpoint(app, appTranslations),
  tenantEndpoint: (app: Express) => applyTenantEndpoint(app),
  healthEndpoint: (app: Express) => applyHealthEndpoint(app),
};
