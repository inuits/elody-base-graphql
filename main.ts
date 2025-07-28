import { applyAuthSession, applyEnvironmentConfig } from './auth';
import { AuthRESTDataSource } from './auth/AuthRESTDataSource';
import {
  resolveMetadata,
  resolveId,
  resolveRelations,
  simpleReturn,
} from './resolvers/entityResolver';
import * as Sentry from '@sentry/node';
import applyPromEndpoint from './endpoints/promEndpoint';
import cors from 'cors';
import express, { Express } from 'express';
import compression from 'compression';
import http from 'http';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { createApplication } from 'graphql-modules';
import { applySEOEndpoint } from './endpoints/seoEndpoint';
import { getRoutesObject } from './routes/routesHelper';
import { baseFields } from './sources/forms';
import { baseModule, baseSchema } from './baseModule/baseModule';
import { baseTypeCollectionMapping } from './sources/typeCollectionMapping';
import {
  getRelationsByType,
  getPrimaryMediaFileIDOfEntity,
  alterDimensionsOfIIIFUrl,
} from './helpers/helpers';
import {
  Collection,
  InputField,
  PermissionRequestInfo,
} from '../../generated-types/type-defs';
import {
  ContextValue,
  DataSources,
  FormattersConfig,
  TypeUrlMapping,
} from './types';
import { Environment } from './environment';
import { expressMiddleware } from '@apollo/server/express4';
import { getMetadataItemValueByKey, getEntityId } from './helpers/helpers';
import { loadTranslations } from './translations/loadTranslations';
import { parseIdToGetMoreData } from './parsers/entity';
import {
  configureFrontendForEnvironment,
  renderPageForEnvironment,
} from './endpoints/frontendEndpoint';
import type {
  CollectionAPIEntity,
  CollectionAPIMediaFile,
  CollectionAPIMetadata,
  CollectionAPIRelation,
} from './types/collectionAPITypes';
import { defaultElodyEndpointMapping } from './sources/defaultElodyEndpointMapping';
import { createMongoConnectionString } from './sources/mongo';
import {
  isRequiredDataSources,
  createFullElodyConfig,
  getDataSourcesFromMapping,
  ElodyConfig,
  addAdditionalOptionalDataSources,
  generateElodyConfig,
} from './helpers/elodyModuleHelpers';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import helmet from 'helmet';
import { deepSanitize, sanitizeRequestBody } from './utilities/sanitize';

let environment: Environment | undefined = undefined;
const baseTranslations: Object = loadTranslations(
  path.join(__dirname, './translations/baseTranslations.json')
);

const applyCustomEndpoints = (
  app: Express,
  customEndpoints: ((app: any) => void)[] = []
) => {
  customEndpoints.forEach((customEndpoint: Function) => {
    customEndpoint(app);
  });
};

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

const start = (
  elodyConfig: ElodyConfig,
  appConfig: Environment,
  appTranslations: Object,
  customEndpoints: ((app: any) => void)[] = [],
  customInputFields: { [key: string]: InputField } | undefined = undefined,
  customTypeCollectionMapping:
    | { [key: string]: Collection }
    | undefined = undefined,
  customPermissions: { [key: string]: PermissionRequestInfo } = {},
  customFormatters: FormattersConfig = {},
  customTypeUrlMapping: TypeUrlMapping = { mapping: {}, reverseMapping: {}}
): void => {
  const fullElodyConfig: ElodyConfig = createFullElodyConfig(elodyConfig);
  addAdditionalOptionalDataSources(appConfig);

  const application = createApplication({
    modules: fullElodyConfig.modules,
  });
  environment = appConfig;

  if (appConfig.sentryEnabled) {
    Sentry.init({
      dsn: appConfig.sentryDsn,
      sendClientReports: false,
      environment: appConfig.nomadNamespace,
    });
  }
  
  const configureMiddleware = (app: any, appConfig: Environment) => {
    applyAuthSession(
      app,
      appConfig.sessionSecret,
      createMongoConnectionString(appConfig),
      appConfig
    );
    applyEnvironmentConfig({
      tokenLogging: appConfig.apollo.tokenLogging,
      staticJWT: appConfig.staticToken,
    });
  };

  const startApolloServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    httpServer.setTimeout(120000);

    let viteServer: ViteDevServer | undefined;
    if (appConfig.environment !== 'production') {
      viteServer = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: {
            port: 24678,
            clientPort: 24678
          }
        },
        appType: 'spa',
        root: path.join(__dirname, '../dashboard'),
      });
    }

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

    app.use(compression());

    app.use(sanitizeRequestBody)

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-eval'"],
        },
      })
    );

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

    configureMiddleware(app, appConfig);

    app.use(
      appConfig.apollo.graphqlPath,
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { cache } = server;
          const session = { ...req.session };
          const clientIp: string = req.headers['x-forwarded-for'] as string;
          const dataSources = getDataSourcesFromMapping(
            fullElodyConfig,
            session,
            cache,
            clientIp
          );
          if (!isRequiredDataSources(dataSources)) {
            throw new Error('All DataSources properties must be defined');
          }

          if (req.body.variables) {
            const sanitizedVariables = deepSanitize(req.body.variables)
            req.body.variables = sanitizedVariables;
          }

          return {
            dataSources,
            customPermissions,
            customFormatters,
          };
        },
      })
    );

    const defaultElodyEndpointVariableMapping: Record<string, any[]> = {
      authEndpoint: [app, appConfig.oauth.baseUrl, appConfig.clientSecret],
      configEndpoint: [app, appConfig],
      urlMappingEndpoint: [app, customTypeUrlMapping],
      versionEndpoint: [app, appConfig],
      downloadEndpoint: [app],
      uploadEndpoint: [app],
      exportEndpoint: [app],
      mediafileEndpoint: [
        app,
        appConfig.api.storageApiUrl,
        appConfig.api.iiifUrl,
        appConfig.staticToken,
      ],
      translationEndpoint: [app, appTranslations],
      tenantEndpoint: [app],
      healthEndpoint: [app],
      // linkedOpenDataEndpoint: [app],
    };

    Object.keys(defaultElodyEndpointMapping).forEach((key: string) => {
      const applyEndpointFunction: Function = defaultElodyEndpointMapping[key];
      const endpointVariables: any[] = defaultElodyEndpointVariableMapping[key];
      if (!endpointVariables) {
        console.warn(
          `Variables for endpoint with key ${key} not found, please add them to the defaultElodyEndpointVariableMapping`
        );
      }
      applyEndpointFunction(...endpointVariables);
    });

    app.set('views', path.join(__dirname + '/views'));
    app.set('view engine', 'pug');

    if (appConfig.features.SEO.hasSEO)
      applySEOEndpoint(app, environment as Environment);

    if (appConfig.api.promUrl !== 'no-prom') {
      applyPromEndpoint(app, appConfig.api.promUrl);
    }

    if (customEndpoints) {
      applyCustomEndpoints(app, customEndpoints);
    }

    if (customInputFields) {
      addCustomFieldsToBaseFields(customInputFields);
    }

    if (customTypeCollectionMapping) {
      addCustomTypeCollectionMapping(customTypeCollectionMapping);
    }

    configureFrontendForEnvironment(app, viteServer);

    httpServer.listen(appConfig.port, () => {
      console.log(`Server is running on port ${appConfig.port}`);
    });

    return { app };
  };

  startApolloServer();
};

export default start;
export type {
  ContextValue,
  DataSources,
  Environment,
  FormattersConfig,
  CollectionAPIEntity,
  CollectionAPIMediaFile,
  CollectionAPIMetadata,
  CollectionAPIRelation,
  ElodyConfig,
};
export {
  environment,
  baseModule,
  baseSchema,
  resolveMetadata,
  getRelationsByType,
  getPrimaryMediaFileIDOfEntity,
  alterDimensionsOfIIIFUrl,
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
  getRoutesObject,
  renderPageForEnvironment,
  generateElodyConfig,
};
