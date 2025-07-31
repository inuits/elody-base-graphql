import { applyAuthEndpoints } from '../auth';
import { Express } from 'express';
import { Environment } from '../environment';
import { applyDownloadEndpoint } from '../endpoints/downloadEndpoint';
import { applyUploadEndpoint } from '../endpoints/uploadEndpoint';
import { applyExportEndpoint } from '../endpoints/exportEndpoint';
import applyMediaFileEndpoint from '../endpoints/mediafilesEndpoint';
import { applyTenantEndpoint } from '../endpoints/tenantEndpoint';
import { applyHealthEndpoint } from '../endpoints/healthEndpoint';
import { applyAppConfigsEndpoint } from '../endpoints/appConfigEndpoint';
import { applyVersionEndpoint } from '../endpoints/versionEndpoint';
import { applyLinkedOpenDataEndpoint } from '../endpoints/linkedOpenDataEndpoint';
import { TypeUrlMapping } from '../types';

export const defaultElodyEndpointMapping: Record<string, Function> = {
  authEndpoint: (app: Express, oauthBaseUrl: string, clientSecret: string) =>
    applyAuthEndpoints(app, oauthBaseUrl, clientSecret),
  downloadEndpoint: (app: Express) => applyDownloadEndpoint(app),
  uploadEndpoint: (app: Express) => applyUploadEndpoint(app),
  exportEndpoint: (app: Express) => applyExportEndpoint(app),
  versionEndpoint: (app: Express, config: Environment) =>
  applyVersionEndpoint(app, config),
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
  tenantEndpoint: (app: Express) => applyTenantEndpoint(app),
  healthEndpoint: (app: Express) => applyHealthEndpoint(app),
  configsEndoint: (app: Express, config: Environment, appTranslations: Object, urlMapping: TypeUrlMapping) => 
    applyAppConfigsEndpoint(app, config, appTranslations, urlMapping)
  // linkedOpenDataEndpoint: (app: Express) => applyLinkedOpenDataEndpoint(app),
};
