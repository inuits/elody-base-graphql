import { applyAuthEndpoints } from '../auth';
import { Express } from 'express';
import { Environment } from '../types/environmentTypes';
import { applyDownloadEndpoint } from '../endpoints/downloadEndpoint';
import { applyExportEndpoint } from '../endpoints/exportEndpoint';
import { applyHealthEndpoint } from '../endpoints/healthEndpoint';
import { applyAppConfigsEndpoint } from '../endpoints/appConfigEndpoint';
import { applyVersionEndpoint } from '../endpoints/versionEndpoint';
import { applyUploadEndpoint } from '../endpoints/uploadEndpoint';
import { TypeUrlMapping } from '../types';

export const defaultElodyEndpointMapping: Record<string, Function> = {
  authEndpoint: (
    app: Express,
    oauthBaseUrl: string,
    clientSecret: string,
    environment: Environment
  ) => applyAuthEndpoints(app, oauthBaseUrl, clientSecret, environment),
  baseUploadEndpoint: (app: Express) => applyUploadEndpoint(app),
  downloadEndpoint: (app: Express) => applyDownloadEndpoint(app),
  exportEndpoint: (app: Express) => applyExportEndpoint(app),
  versionEndpoint: (app: Express, config: Environment) =>
    applyVersionEndpoint(app, config),
  healthEndpoint: (app: Express) => applyHealthEndpoint(app),
  configsEndoint: (
    app: Express,
    config: Environment,
    appTranslations: { [key: string]: string },
    urlMapping: TypeUrlMapping
  ) => applyAppConfigsEndpoint(app, config, appTranslations, urlMapping),
};
