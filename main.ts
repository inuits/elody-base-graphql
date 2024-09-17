import {
  applyAuthEndpoints,
  applyAuthSession,
  applyEnvironmentConfig,
} from './auth';
import { AuthRESTDataSource } from './auth/AuthRESTDataSource';
import {
  resolveMetadata,
  resolveId,
  resolveRelations,
  simpleReturn,
} from './resolvers/entityResolver';
import * as Sentry from '@sentry/node';
import applyConfigEndpoint from './endpoints/configEndpoint';
import applyMediaFileEndpoint from './endpoints/mediafilesEndpoint';
import applyPromEndpoint from './endpoints/promEndpoint';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { Application } from 'graphql-modules';
import { applyExportEndpoint } from './endpoints/exportEndpoint';
import { applyHealthEndpoint } from './endpoints/healthEndpoint';
import { applySEOEndpoint } from './endpoints/seoEndpoint';
import { applyTenantEndpoint } from './endpoints/tenantEndpoint';
import { applyTranslationEndpoint } from './endpoints/translationEndpoint';
import { applyUploadEndpoint } from './endpoints/uploadEndpoint';
import { applyDownloadEndpoint } from './endpoints/downloadEndpoint';

import { mergeRoutes } from './routes/routesHelper';
import { baseFields } from './sources/forms';
import { baseModule, baseSchema } from './baseModule/baseModule';
import { baseTypeCollectionMapping } from './sources/typeCollectionMapping';
import { Collection, InputField } from '../../generated-types/type-defs';
import { CollectionAPI } from './sources/collection';
import { ContextValue, DataSources } from './types';
import { Environment } from './environment';
import { expressMiddleware } from '@apollo/server/express4';
import { getMetadataItemValueByKey, getEntityId } from './helpers/helpers';
import { ImportAPI } from 'import-module';
import { loadTranslations } from './translations/loadTranslations';
import { parseIdToGetMoreData } from './parsers/entity';
import { StorageAPI } from './sources/storage';
import { TranscodeService } from './sources/transcode';
import { OcrService } from './sources/ocr';

let environment: Environment | undefined = undefined;
const baseTranslations: Object = loadTranslations(
  path.join(__dirname, './translations/baseTranslations.json')
);

const addCustomFieldsToBaseFields = (customInputFields: {
  [key: string]: InputField;
}) => {
  try {
    Object.keys(customInputFields).forEach((fieldKey: string) => {
      if (baseFields[fieldKey]) {
        throw Error(
          `The key ${fieldKey} does already exist in baseFields, please choose another one`
        );
      }
      baseFields[fieldKey] = customInputFields[fieldKey];
    });
  } catch (e) {
    console.log(e);
  }
};

const addCustomTypeCollectionMapping = (customTypeCollectionMapping: {
  [key: string]: Collection;
}) => {
  Object.keys(customTypeCollectionMapping).forEach((key: string) => {
    baseTypeCollectionMapping[key] = customTypeCollectionMapping[key];
  });
};

const addApplicationEndpoints = (applicationEndpoints: Function[]) => {
  applicationEndpoints.forEach((endpoint: Function) => {
    endpoint();
  });
};

const start = (
  application: Application,
  appConfig: Environment,
  appTranslations: Object,
  customEndpoints: Function[] = [],
  customInputFields: { [key: string]: InputField } | undefined = undefined,
  customTypeCollectionMapping:
    | { [key: string]: Collection }
    | undefined = undefined
) => {
  environment = appConfig;

  const applicationEndpoints: Function[] = [];

  if (appConfig.sentryEnabled) {
    Sentry.init({
      dsn: appConfig.sentryDsn,
      sendClientReports: false,
      environment: appConfig.nomadNamespace,
    });
  }

  const configureMiddleware = (app: any) => {
    applyAuthSession(app, appConfig.sessionSecret);
    applyEnvironmentConfig({
      tokenLogging: appConfig.apollo.tokenLogging,
      staticJWT: appConfig.staticToken,
    });
  };

  const startApolloServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    httpServer.setTimeout(120000);
    const server = new ApolloServer<ContextValue>({
      csrfPrevention: true,
      gateway: {
        async load() {
          return { executor: application.createApolloExecutor() };
        },
        onSchemaLoadOrUpdate(callback) {
          callback({ apiSchema: application.schema } as any);
          return () => {};
        },
        async stop() {},
      },
    });

    app.use(
      cors({
        credentials: false,
        origin: [appConfig.damsFrontend],
      }),
      express.json({ limit: appConfig.maxUploadSize }),
      express.urlencoded({
        extended: true,
        limit: appConfig.maxUploadSize,
        parameterLimit: 1000000,
      })
    );

    await server.start();

    configureMiddleware(app);

    app.use(
      appConfig.apollo.graphqlPath,
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { cache } = server;
          const session = { ...req.session };
          const dataSources = {
            CollectionAPI: new CollectionAPI({ session, cache }),
            ImportAPI: new ImportAPI({ session, cache }),
            StorageAPI: new StorageAPI({ session, cache }),
          };
          if (environment?.api.transcodeService)
            Object.assign(dataSources, {
              TranscodeService: new TranscodeService({ session, cache }),
            });
          if (environment?.api.ocrService)
            Object.assign(dataSources, {
              OcrService: new OcrService({ session, cache }),
            });

          return { dataSources };
        },
      })
    );

    applicationEndpoints.push(
      ...[
        function () {
          applyAuthEndpoints(
            app,
            appConfig.oauth.baseUrl,
            appConfig.clientSecret
          );
        },
        function () {
          applyConfigEndpoint(app, appConfig);
        },
        function () {
          applyDownloadEndpoint(app);
        },
        function () {
          applyUploadEndpoint(app);
        },
        function () {
          applyExportEndpoint(app);
        },
        function () {
          applyMediaFileEndpoint(
            app,
            appConfig.api.storageApiUrl,
            appConfig.api.iiifUrl,
            appConfig.staticToken
          );
        },
        function () {
          applyTranslationEndpoint(app, appTranslations);
        },
        function () {
          applyTenantEndpoint(app);
        },
        function () {
          applyHealthEndpoint(app);
        },
      ]
    );
    applicationEndpoints.push(...customEndpoints);

    app.set('views', path.join(__dirname + '/views'));
    app.set('view engine', 'pug');

    if (appConfig.features.SEO.hasSEO)
      applicationEndpoints.push(function () {
        applySEOEndpoint(app, environment as Environment);
      });

    if (appConfig.api.promUrl !== 'no-prom') {
      applyPromEndpoint(app, appConfig.api.promUrl);
    }

    if (applicationEndpoints) {
      addApplicationEndpoints(applicationEndpoints);
    }

    if (customInputFields) {
      addCustomFieldsToBaseFields(customInputFields);
    }

    if (customTypeCollectionMapping) {
      addCustomTypeCollectionMapping(customTypeCollectionMapping);
    }

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: appConfig.port }, resolve)
    );
    console.log(`Server is running on port ${appConfig.port}`);

    return { app };
  };

  startApolloServer();
};

export default start;
export type { ContextValue, DataSources, Environment };
export {
  environment,
  baseModule,
  baseSchema,
  resolveMetadata,
  parseIdToGetMoreData,
  applyPromEndpoint,
  loadTranslations,
  baseTranslations,
  AuthRESTDataSource,
  getMetadataItemValueByKey,
  getEntityId,
  resolveId,
  resolveRelations,
  simpleReturn,
  mergeRoutes,
};
