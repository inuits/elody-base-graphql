import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import { Environment } from './environment';
import { CollectionAPI } from './sources/collection';
import {
  applyAuthEndpoints,
  applyAuthSession,
  applyEnvironmentConfig,
} from './auth/index';
import { SearchAPI } from './sources/search';
import { ImportAPI } from 'import-module';
import { StorageAPI } from './sources/storage';
import applyConfigEndpoint from './endpoints/configEndpoint';
import applyMediaFileEndpoint from './endpoints/mediafilesEndpoint';
import * as Sentry from '@sentry/node';
import { ApolloServer } from '@apollo/server';
import { ContextValue, DataSources } from './types';
import { applyUploadEndpoint } from './endpoints/uploadEndpoint';
import { Application } from 'graphql-modules';
import { baseModule, baseSchema } from './baseModule/baseModule';
import { InputField } from '../../generated-types/type-defs';
import { baseFields } from './sources/forms';
import { applyExportEndpoint } from './endpoints/exportEndpoint';
import { applyTenantEndpoint } from './endpoints/tenantEndpoint';
import applyPromEndpoint from './endpoints/promEndpoint';
import {
  resolveMedia,
  resolveMetadata,
  resolvePermission,
} from './resolvers/entityResolver';
import { parseIdToGetMoreData } from './parsers/entity';
import { applyTranslationEndpoint } from './endpoints/translationEndpoint';
import { applyHealthEndpoint } from './endpoints/healthEndpoint';
import { loadTranslations } from './translations/loadTranslations';
import path from 'path';

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
  customInputFields: { [key: string]: InputField } | undefined = undefined
) => {
  environment = appConfig;
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
    httpServer.setTimeout(60000)
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
          return {
            dataSources: {
              CollectionAPI: new CollectionAPI({ session, cache }),
              SearchAPI: new SearchAPI({ session, cache }),
              ImportAPI: new ImportAPI({ session, cache }),
              StorageAPI: new StorageAPI({ session, cache }),
            },
          };
        },
      })
    );

    const applicationEndpoints: Function[] = [
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
      ...customEndpoints,
    ];

    if (appConfig.api.promUrl !== 'no-prom') {
      applyPromEndpoint(app, appConfig.api.promUrl);
    }

    if (applicationEndpoints) {
      addApplicationEndpoints(applicationEndpoints);
    }
    if (customInputFields) {
      addCustomFieldsToBaseFields(customInputFields);
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
  resolveMedia,
  resolveMetadata,
  parseIdToGetMoreData,
  resolvePermission,
  applyPromEndpoint,
  loadTranslations,
  baseTranslations,
};
