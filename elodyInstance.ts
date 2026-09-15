import { applyAuthSession, applyEnvironmentConfig } from './auth';
import * as Sentry from '@sentry/node';
import applyPromEndpoint from './endpoints/promEndpoint';
import express, { Express } from 'express';
import compression from 'compression';
import http from 'http';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { createApplication, Application } from 'graphql-modules';
import { applySEOEndpoint } from './endpoints/seoEndpoint';
import { baseFields } from './sources/forms';
import { baseTypePillLabelMapping } from './sources/typePillLabelMapping';
import {
  checkRequestContentType,
  setTypeCollectionMapping,
  getClientOrigin,
} from './helpers/helpers';
import {
  Collection,
  InputField,
  PermissionRequestInfo,
} from './generated-types/type-defs';
import { ContextValue, FormattersConfig, TypeUrlMapping } from './types';
import {
  createElodyEnvironment,
  getCurrentEnvironment,
  setCurrentEnvironment,
} from './environment';
import { applyOidcDiscovery } from './auth/oidcDiscovery';
import { printStartupBanner } from './helpers/startupBanner';
import {
  Environment,
  FullyOptionalEnvironmentInput,
} from './types/environmentTypes';
import { expressMiddleware } from '@as-integrations/express4';
import { configureFrontendForEnvironment } from './endpoints/frontendEndpoint';
import { defaultElodyEndpointMapping } from './sources/defaultElodyEndpointMapping';
import { createMongoConnectionString } from './sources/mongo';
import {
  isRequiredDataSources,
  findMissingRequiredDataSources,
  createFullElodyConfig,
  getDataSourcesFromMapping,
  ElodyConfig,
  addAdditionalOptionalDataSources,
  generateElodyConfig,
  ElodyModuleConfig,
} from './helpers/elodyModuleHelpers';
import {
  collectModuleFeatures,
  collectModulePermissions,
} from './helpers/moduleContributions';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import depthLimit from 'graphql-depth-limit';
import { enableCors } from './helpers/corsHelper';
import { enableContentSecurityPolicy } from './helpers/contentSecurityPolicyHelper';

export interface ElodyInstanceOptions {
  customModuleConfig: ElodyModuleConfig;
  appConfig: FullyOptionalEnvironmentInput;
  customTranslations: { [key: string]: object };
  customEndpoints?: ((app: any, environment: Environment) => void)[];
  customInputFields?: { [key: string]: InputField };
  customTypeCollectionMapping?: { [key: string]: Collection };
  customPermissions?: { [key: string]: PermissionRequestInfo };
  customFormatters?: FormattersConfig;
  customTypeUrlMapping?: TypeUrlMapping;
  customTypePillLabelMapping?: { [key: string]: string[] };
  customFilterMatchers?: { [key: string]: string[] };
}

type ResolvedOptions = ElodyInstanceOptions &
  Required<
    Pick<
      ElodyInstanceOptions,
      | 'customEndpoints'
      | 'customPermissions'
      | 'customFormatters'
      | 'customTypeUrlMapping'
    >
  >;

// ponytail: one instance per process — createFullElodyConfig and setCurrentEnvironment
// both mutate module-level singletons, so a second instance duplicates modules.
export class ElodyInstance {
  private options: ResolvedOptions;
  private environment!: Environment;
  private elodyConfig!: ElodyConfig;
  private permissions!: { [key: string]: PermissionRequestInfo };
  private application!: Application;
  private app!: Express;
  private httpServer!: http.Server;
  private apolloServer!: ApolloServer<ContextValue>;
  private viteServer?: ViteDevServer;

  constructor(options: ElodyInstanceOptions) {
    this.options = {
      ...options,
      customEndpoints: options.customEndpoints ?? [],
      customPermissions: options.customPermissions ?? {},
      customFormatters: options.customFormatters ?? {},
      customTypeUrlMapping: options.customTypeUrlMapping ?? {
        mapping: {},
        reverseMapping: {},
      },
    };
  }

  async start(): Promise<void> {
    this.configure();
    await applyOidcDiscovery(this.environment);
    await this.buildApp();
    this.httpServer.listen(this.environment.port, () => {
      printStartupBanner(this.environment);
    });
  }

  async buildApp(): Promise<Express> {
    if (!this.application) this.configure();

    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.httpServer.setTimeout(120000);

    await this.createViteDevServer();
    this.createApolloServer();
    this.applyExpressMiddleware();
    await this.apolloServer.start();
    this.applySessionMiddleware();
    this.applyGraphqlEndpoint();
    this.applyDefaultEndpoints();
    this.applyModuleEndpoints();
    this.applyViewEngineAndOptionalEndpoints();
    this.applyFrontend();

    return this.app;
  }

  private configure() {
    this.configureEnvironment();
    this.configureApplication();
  }

  private configureEnvironment() {
    setCurrentEnvironment(createElodyEnvironment(this.options.appConfig));
    if (this.options.customTypeCollectionMapping) {
      setTypeCollectionMapping(this.options.customTypeCollectionMapping);
    }
    this.environment = getCurrentEnvironment();
  }

  private configureApplication() {
    this.elodyConfig = createFullElodyConfig(
      generateElodyConfig(this.options.customModuleConfig)
    );
    this.permissions = {
      ...collectModulePermissions(this.elodyConfig.modules),
      ...this.options.customPermissions,
    };
    addAdditionalOptionalDataSources(this.environment);

    this.application = createApplication({ modules: this.elodyConfig.modules });

    if (this.environment.glitchtipEnabled) {
      Sentry.init({
        dsn: this.environment.glitchtipDsn,
        sendClientReports: false,
        environment: this.environment.nomadNamespace,
      });
    }
  }

  private async createViteDevServer() {
    if (this.environment.environment === 'production') return;
    this.viteServer = await createViteServer({
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

  private createApolloServer() {
    const authExtensionPlugin = {
      async requestDidStart() {
        return {
          async willSendResponse({
            response,
            contextValue,
          }: {
            response: any;
            contextValue: any;
          }) {
            if (!contextValue.session?.auth) {
              if (response.body.kind === 'single') {
                response.body.singleResult.extensions = {
                  ...response.body.singleResult.extensions,
                  authStatus: 'UNAUTHENTICATED',
                };
              }
            }
          },
        };
      },
    };

    const application = this.application;
    this.apolloServer = new ApolloServer<ContextValue>({
      csrfPrevention: true,
      validationRules: [
        depthLimit(this.environment?.apollo.maxQueryDepth || 15),
      ],
      introspection: this.environment?.apollo.introspection || false,
      plugins: [authExtensionPlugin],
      nodeEnv: this.environment.environment,
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
  }

  private applyExpressMiddleware() {
    enableCors(this.app, this.environment);
    enableContentSecurityPolicy(this.app, this.environment);

    this.app.use(compression());

    this.app.use(
      express.json({ limit: this.environment.maxUploadSize }),
      express.urlencoded({
        extended: true,
        limit: this.environment.maxUploadSize,
        parameterLimit: 1000000,
      })
    );
  }

  private applySessionMiddleware() {
    applyAuthSession(
      this.app,
      createMongoConnectionString(this.environment),
      this.environment
    );
    applyEnvironmentConfig({
      tokenLogging: this.environment.apollo.tokenLogging,
      staticJWT: this.environment.staticToken,
    });
  }

  private buildDataSources(req: any) {
    return getDataSourcesFromMapping(
      this.elodyConfig,
      this.environment,
      { ...req.session },
      this.apolloServer.cache,
      req.ip,
      getClientOrigin(req.headers),
      req.headers['x-tenant-id'] as string
    );
  }

  private applyGraphqlEndpoint() {
    this.app.use(
      this.environment.apollo.graphqlPath,
      expressMiddleware(this.apolloServer, {
        context: async ({ req, res }) => {
          if (checkRequestContentType(req, res)) return {} as ContextValue;
          const session = { ...req.session };
          if (this.environment.features?.ipWhiteListing)
            console.log(`[GraphQL] clientIp: ${req.ip}, path: ${req.path}`);
          const dataSources = this.buildDataSources(req);

          if (!isRequiredDataSources(dataSources)) {
            const missing = findMissingRequiredDataSources(dataSources);
            throw new Error(
              `Missing required data sources: ${missing.join(', ')}`
            );
          }

          return {
            dataSources,
            customPermissions: this.permissions,
            customFormatters: this.options.customFormatters,
            customFilterMatchers: this.options.customFilterMatchers,
            session,
            parentEntityId: req.headers['x-parent-entity-id'] as string,
          };
        },
      })
    );
  }

  private applyDefaultEndpoints() {
    const endpointVariableMapping: Record<string, any[]> = {
      authEndpoint: [
        this.app,
        this.environment.oauth.baseUrl,
        this.environment.clientSecret,
        this.environment,
      ],
      versionEndpoint: [this.app, this.environment],
      baseUploadEndpoint: [this.app],
      downloadEndpoint: [this.app],
      exportEndpoint: [this.app],
      exportXlsxEndpoint: [this.app],
      healthEndpoint: [this.app],
      documentsEndpoint: [this.app],
      configsEndoint: [
        this.app,
        this.environment,
        this.options.customTranslations,
        this.options.customTypeUrlMapping,
        {
          buildDataSources: (req: any) => this.buildDataSources(req),
          permissions: this.permissions,
          features: collectModuleFeatures(this.elodyConfig.modules),
        },
      ],
    };

    Object.keys(defaultElodyEndpointMapping).forEach((key: string) => {
      const applyEndpointFunction: Function = defaultElodyEndpointMapping[key];
      const endpointVariables: any[] = endpointVariableMapping[key];
      if (!endpointVariables) {
        console.warn(
          `Variables for endpoint with key ${key} not found, please add them to the defaultElodyEndpointVariableMapping`
        );
      }
      applyEndpointFunction(...endpointVariables);
    });
  }

  private applyModuleEndpoints() {
    this.elodyConfig.endpoints.forEach((fn) => fn(this.app, this.environment));
  }

  private applyViewEngineAndOptionalEndpoints() {
    this.app.set('views', path.join(__dirname + '/views'));
    this.app.set('view engine', 'pug');

    if (this.environment.features.SEO)
      applySEOEndpoint(this.app, this.environment);

    if (this.environment.api.promUrl !== 'no-prom') {
      applyPromEndpoint(this.app, this.environment.api.promUrl);
    }

    this.options.customEndpoints.forEach((customEndpoint) => {
      customEndpoint(this.app, this.environment);
    });

    if (this.options.customInputFields) {
      this.addCustomFieldsToBaseFields(this.options.customInputFields);
    }

    if (this.options.customTypePillLabelMapping) {
      Object.entries(this.options.customTypePillLabelMapping).forEach(
        ([key, value]) => {
          baseTypePillLabelMapping[key] = value;
        }
      );
    }
  }

  private addCustomFieldsToBaseFields(customInputFields: {
    [key: string]: InputField;
  }) {
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
  }

  private applyFrontend() {
    configureFrontendForEnvironment(this.app, this.viteServer);
  }
}
