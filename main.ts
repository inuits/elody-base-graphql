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
import { baseTypePillLabelMapping } from './sources/typePillLabelMapping';
import {
  getRelationsByType,
  getPrimaryMediaFileIDOfEntity,
  alterDimensionsOfIIIFUrl,
  checkRequestContentType,
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
import {
  createElodyEnvironment,
  getCurrentEnvironment,
  setCurrentEnvironment,
} from './environment';
import {
  Environment,
  FullyOptionalEnvironmentInput,
} from './types/environmentTypes';
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
  ElodyModuleConfig,
} from './helpers/elodyModuleHelpers';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import helmet from 'helmet';
import depthLimit from 'graphql-depth-limit';

const baseTranslations: Object = {
  en: loadTranslations(path.join(__dirname, './translations/en.json'))['en'],
  nl: loadTranslations(path.join(__dirname, './translations/nl.json'))['nl'],
  ar: loadTranslations(path.join(__dirname, './translations/ar.json'))['ar'],
};

const applyCustomEndpoints = (
  app: Express,
  environment: Environment,
  customEndpoints: ((app: any, environment: Environment) => void)[] = []
) => {
  customEndpoints.forEach((customEndpoint: Function) => {
    customEndpoint(app, environment);
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

const addCustomTypePillLabelMapping = (customTypePillLabelMapping: {
  [key: string]: string[];
}) => {
  Object.keys(customTypePillLabelMapping).forEach((key: string) => {
    baseTypePillLabelMapping[key] = customTypePillLabelMapping[key];
  });
};

const start = (
  customModuleConfig: ElodyModuleConfig,
  appConfig: FullyOptionalEnvironmentInput,
  appTranslations: { [key: string]: string },
  customEndpoints: ((app: any, environment: Environment) => void)[] = [],
  customInputFields: { [key: string]: InputField } | undefined = undefined,
  customTypeCollectionMapping:
    | { [key: string]: Collection }
    | undefined = undefined,
  customPermissions: { [key: string]: PermissionRequestInfo } = {},
  customFormatters: FormattersConfig = {},
  customTypeUrlMapping: TypeUrlMapping = { mapping: {}, reverseMapping: {} },
  customTypePillLabelMapping:
    | { [key: string]: string[] }
    | undefined = undefined
): void => {
  setCurrentEnvironment(createElodyEnvironment(appConfig));
  const environment = getCurrentEnvironment();
  const fullElodyConfig: ElodyConfig = createFullElodyConfig(
    generateElodyConfig(customModuleConfig)
  );
  addAdditionalOptionalDataSources(environment);

  const application = createApplication({
    modules: fullElodyConfig.modules,
  });

  if (environment.sentryEnabled) {
    Sentry.init({
      dsn: environment.sentryDsn,
      sendClientReports: false,
      environment: environment.nomadNamespace,
    });
  }

  const configureMiddleware = (app: any, environment: Environment) => {
    applyAuthSession(
      app,
      environment.sessionSecret,
      createMongoConnectionString(environment),
      environment
    );
    applyEnvironmentConfig({
      tokenLogging: environment.apollo.tokenLogging,
      staticJWT: environment.staticToken,
    });
  };

  const startApolloServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    httpServer.setTimeout(120000);

    let viteServer: ViteDevServer | undefined;
    if (environment.environment !== 'production') {
      viteServer = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: {
            port: 24678,
            clientPort: 24678,
          },
        },
        appType: 'spa',
        root: path.join(__dirname, '../dashboard'),
      });
    }

    const server = new ApolloServer<ContextValue>({
      csrfPrevention: true,
      validationRules: [depthLimit(environment?.apollo.maxQueryDepth || 10)],
      introspection: environment?.apollo.introspection || false,
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

    app.use(helmet());

    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-eval'", 'blob:'],
          'worker-src': ["'self'", 'blob:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://server.arcgisonline.com',
            'https://*.openstreetmap.org',
          ],
          'connect-src': [
            "'self'",
            'blob:',
            '*',
            ...(environment.sentryEnabled && environment.sentryDsn
              ? [new URL(environment.sentryDsn).origin]
              : []),
          ],
        },
      })
    );

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

    configureMiddleware(app, environment);

    app.use(
      environment.apollo.graphqlPath,
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          if (checkRequestContentType(req, res)) return {} as ContextValue;
          const { cache } = server;
          const session = { ...req.session };
          const clientIp: string = req.headers['x-forwarded-for'] as string;
          const dataSources = getDataSourcesFromMapping(
            fullElodyConfig,
            environment,
            session,
            cache,
            clientIp
          );
          if (!isRequiredDataSources(dataSources)) {
            throw new Error('All DataSources properties must be defined');
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
      authEndpoint: [app, environment.oauth.baseUrl, environment.clientSecret],
      versionEndpoint: [app, environment],
      downloadEndpoint: [app],
      uploadEndpoint: [app],
      exportEndpoint: [app],
      mediafileEndpoint: [
        app,
        environment.api.storageApiUrl,
        environment.api.iiifUrl,
        environment.staticToken,
      ],
      tenantEndpoint: [app],
      healthEndpoint: [app],
      configsEndoint: [app, environment, appTranslations, customTypeUrlMapping],
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

    if (environment.features.SEO)
      applySEOEndpoint(app, environment as Environment);

    if (environment.api.promUrl !== 'no-prom') {
      applyPromEndpoint(app, environment.api.promUrl);
    }

    if (customEndpoints) {
      applyCustomEndpoints(app, environment, customEndpoints);
    }

    if (customInputFields) {
      addCustomFieldsToBaseFields(customInputFields);
    }

    if (customTypeCollectionMapping) {
      addCustomTypeCollectionMapping(customTypeCollectionMapping);
    }

    if (customTypePillLabelMapping) {
      addCustomTypePillLabelMapping(customTypePillLabelMapping);
    }

    configureFrontendForEnvironment(app, viteServer);

    httpServer.listen(environment.port, () => {
      console.log(`Server is running on port ${environment.port}`);
    });

    return { app };
  };

  startApolloServer();
};

export default start;
export * from './types';
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
  getCurrentEnvironment,
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
};
