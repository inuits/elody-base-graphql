import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import { environment } from './environment';
import { CollectionAPI } from './sources/collection';
import {
  applyAuthEndpoints,
  applyAuthSession,
  applyEnvironmentConfig,
} from 'inuits-apollo-server-auth';
import { SearchAPI } from './sources/search';
import { ImportAPI } from 'import-module/sources/import';
import { StorageAPI } from './sources/storage';
import applyConfigEndpoint from './configEndpoint';
import applyMediaFileEndpoint from './sources/mediafiles';
import * as Sentry from '@sentry/node';
import { ApolloServer } from '@apollo/server';
import { ContextValue, DataSources } from './types';
import { applyCodegenEndpoints } from './codegenEndpoint';
import { applyUploadEndpoint } from './uploadEndpoint';
import { Application } from 'graphql-modules';
import { baseModule } from './baseModule/baseModule';

const addApplicationEndpoints = (applicationEndpoints: Function[]) => {
  applicationEndpoints.forEach((endpoint: Function) => {
    endpoint();
  });
};

const start = (
  application: Application,
  customEndpoints: Function[] = [],
  queries: any
) => {
  if (environment.sentryEnabled) {
    Sentry.init({
      dsn: environment.sentryDsn,
      sendClientReports: false,
      environment: environment.nomadNamespace,
    });
  }

  const configureMiddleware = (app: any) => {
    applyAuthSession(app, environment.sessionSecret);
    applyEnvironmentConfig({
      tokenLogging: environment.apollo.tokenLogging,
      staticJWT: environment.staticToken,
    });
  };

  const startApolloServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);

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
        origin: [environment.damsFrontend],
      }),
      express.json({ limit: environment.maxUploadSize }),
      express.urlencoded({
        extended: true,
        limit: environment.maxUploadSize,
        parameterLimit: 1000000,
      })
    );

    await server.start();

    configureMiddleware(app);

    app.use(
      environment.apollo.graphqlPath,
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { cache } = server;
          const session = { auth: req.session };
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
          environment.oauth.baseUrl,
          environment.clientSecret
        );
      },
      function () {
        applyConfigEndpoint(app);
      },
      function () {
        applyCodegenEndpoints(app, queries, application.schema);
      },
      function () {
        applyUploadEndpoint(app);
      },
      function () {
        applyMediaFileEndpoint(
          app,
          environment.api.storageApiUrl,
          environment.api.iiifUrl,
          environment.staticToken
        );
      },
      ...customEndpoints,
    ];

    if (applicationEndpoints) {
      addApplicationEndpoints(applicationEndpoints);
    }

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: environment.port }, resolve)
    );
    console.log(`Server is running on port ${environment.port}`);

    return { app };
  };

  startApolloServer();
};

export default start;
export type { ContextValue, DataSources };
export { environment, applyCodegenEndpoints, baseModule };
