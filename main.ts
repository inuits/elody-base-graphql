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
import { ContextValue } from './types';
// import { applyCodegenEndpoints } from './codegenEndpoint';

const start = (application: any) => {
  if (environment.sentryEnabled) {
    Sentry.init({
      dsn: environment.sentryDsn,
      sendClientReports: false,
      environment: environment.nomadNamespace,
    });
  }

  const configureMiddleware = (app: any) => {
    applyAuthSession(app, environment.sessionSecret);
    applyConfigEndpoint(app, environment);
    applyEnvironmentConfig({
      tokenLogging: environment.apollo.tokenLogging,
      staticJWT: environment.staticToken,
    });
    applyAuthEndpoints(
      app,
      environment.oauth.baseUrl,
      environment.clientSecret
    );

    applyMediaFileEndpoint(
      app,
      environment.api.storageApiUrl,
      environment.api.iiifUrl,
      environment.staticToken
    );
    // applyCodegenEndpoints(app);
  };

  const startApolloServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer<ContextValue>({
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
      express.json(),
      express.urlencoded({ extended: true })
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

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: environment.port }, resolve)
    );
    console.log(`Server is running on port ${environment.port}`);

    return { app };
  };

  startApolloServer();
};

export default start;
export type { ContextValue };
export { environment };
