import { applyAuthEndpoints } from '../auth';
import { Express } from 'express';
import { Environment } from '../types/environmentTypes';
import { applyDownloadEndpoint } from '../endpoints/downloadEndpoint';
import { applyUploadEndpoint } from '../endpoints/uploadEndpoint';
import { applyExportEndpoint } from '../endpoints/exportEndpoint';
import applyMediaFileEndpoint from '../endpoints/mediafilesEndpoint';
import { applyHealthEndpoint } from '../endpoints/healthEndpoint';
import { applyDocumentsEndpoint } from '../endpoints/documentsEndpoint';
import { applyAppConfigsEndpoint } from '../endpoints/appConfigEndpoint';
import { applyVersionEndpoint } from '../endpoints/versionEndpoint';
import { applyLinkedOpenDataEndpoint } from '../endpoints/linkedOpenDataEndpoint';
import { TypeUrlMapping } from '../types';

export const defaultElodyEndpointMapping: Record<string, Function> = {
  authEndpoint: (app: Express, oauthBaseUrl: string, clientSecret: string, environment: Environment) =>
    applyAuthEndpoints(app, oauthBaseUrl, clientSecret, environment),
  downloadEndpoint: (app: Express) => applyDownloadEndpoint(app),
  uploadEndpoint: (app: Express) => applyUploadEndpoint(app),
  exportEndpoint: (app: Express) => applyExportEndpoint(app),
  versionEndpoint: (app: Express, config: Environment) =>
    applyVersionEndpoint(app, config),
  mediafileEndpoint: (app: Express, environment: Environment) =>
    applyMediaFileEndpoint(app, environment),
  healthEndpoint: (app: Express) => applyHealthEndpoint(app),
  documentsEndpoint: (app: Express) => applyDocumentsEndpoint(app),
  configsEndoint: (
    app: Express,
    config: Environment,
    appTranslations: { [key: string]: string },
    urlMapping: TypeUrlMapping
  ) => applyAppConfigsEndpoint(app, config, appTranslations, urlMapping),
  // linkedOpenDataEndpoint: (app: Express) => applyLinkedOpenDataEndpoint(app),
};
