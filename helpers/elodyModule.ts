import type { Express } from 'express';
import type { Module } from 'graphql-modules';
import { mergeObjects } from 'json-merger';
import type {
  Collection,
  InputField,
  PermissionRequestInfo,
} from '../generated-types/type-defs';
import type { FormattersConfig, TypeUrlMapping } from '../types';
import type { Environment } from '../types/environmentTypes';
import type { AuthRESTDataSource } from '../auth/AuthRESTDataSource';

export type ElodyDataSourceClass = new (options: {
  environment: Environment;
  session: any;
  cache: any;
  clientIp: string;
  clientOrigin?: string;
  context: { tenantId?: string };
}) => AuthRESTDataSource;

export type ElodyDataSource = {
  name: string;
  source: ElodyDataSourceClass;
  enabled?: (environment: Environment) => boolean;
};

export type ElodyEndpoint = (app: Express, environment: Environment) => void;

export type ModuleFeature = { enabled: boolean; permission?: string };

export interface ElodyModule {
  name: string;
  graphqlModule?: Module;
  dataSources: ElodyDataSource[];
  endpoints: ElodyEndpoint[];
  translations: { [language: string]: object };
  permissions: { [key: string]: PermissionRequestInfo };
  features: { [key: string]: ModuleFeature };
  inputFields: { [key: string]: InputField };
  formatters: FormattersConfig;
  typeCollectionMapping: { [type: string]: Collection };
  typeUrlMapping: TypeUrlMapping;
  typePillLabelMapping: { [type: string]: string[] };
  filterMatchers: { [key: string]: string[] };
  initialize: (environment: Environment) => void;
}

export type ElodyModuleDefinition = { name: string } & Partial<
  Omit<ElodyModule, 'name'>
>;

export const defineElodyModule = (
  definition: ElodyModuleDefinition
): ElodyModule => ({
  dataSources: [],
  endpoints: [],
  translations: {},
  permissions: {},
  features: {},
  inputFields: {},
  formatters: {},
  typeCollectionMapping: {},
  typeUrlMapping: { mapping: {}, reverseMapping: {} },
  typePillLabelMapping: {},
  filterMatchers: {},
  initialize: () => {},
  ...definition,
});

export type AssembledElodyModules = Omit<
  ElodyModule,
  'name' | 'graphqlModule' | 'initialize'
> & { graphqlModules: Module[] };

const mergeKeyed = <T>(modules: ElodyModule[], pick: (module: ElodyModule) => T) =>
  Object.assign({}, ...modules.map(pick)) as T;

const collectDataSources = (modules: ElodyModule[]): ElodyDataSource[] => {
  const registeredBy = new Map<string, string>();
  return modules.flatMap((module) =>
    module.dataSources.map((dataSource) => {
      const owner = registeredBy.get(dataSource.name);
      if (owner)
        throw new Error(
          `Data source ${dataSource.name} is registered by both ${owner} and ${module.name}`
        );
      registeredBy.set(dataSource.name, module.name);
      return dataSource;
    })
  );
};

// Later modules win on a key clash, so a client module listed last overrides
// what the shared modules contribute.
export const assembleElodyModules = (
  modules: ElodyModule[]
): AssembledElodyModules => ({
  graphqlModules: modules.flatMap((module) =>
    module.graphqlModule ? [module.graphqlModule] : []
  ),
  dataSources: collectDataSources(modules),
  endpoints: modules.flatMap((module) => module.endpoints),
  translations: mergeObjects([{}, ...modules.map((module) => module.translations)]),
  formatters: mergeObjects([{}, ...modules.map((module) => module.formatters)]),
  permissions: mergeKeyed(modules, (module) => module.permissions),
  features: mergeKeyed(modules, (module) => module.features),
  inputFields: mergeKeyed(modules, (module) => module.inputFields),
  typeCollectionMapping: mergeKeyed(modules, (module) => module.typeCollectionMapping),
  typePillLabelMapping: mergeKeyed(modules, (module) => module.typePillLabelMapping),
  filterMatchers: mergeKeyed(modules, (module) => module.filterMatchers),
  typeUrlMapping: {
    mapping: mergeKeyed(modules, (module) => module.typeUrlMapping.mapping),
    reverseMapping: mergeKeyed(
      modules,
      (module) => module.typeUrlMapping.reverseMapping
    ),
  },
});

export const initializeElodyModules = (
  modules: ElodyModule[],
  environment: Environment
): void => {
  const failures = modules.flatMap((module) => {
    try {
      module.initialize(environment);
      return [];
    } catch (error) {
      return [`- ${module.name}: ${(error as Error).message}`];
    }
  });
  if (failures.length)
    throw new Error(
      `Elody modules failed to initialize:\n${failures.join('\n')}`
    );
};

const readEnvironmentPath = (environment: Environment, path: string): any =>
  path.split('.').reduce((value: any, key) => value?.[key], environment);

// Maps an environment path (e.g. 'api.fileSystemImporterServiceUrl') to the
// env variable that sets it, so the error names what to configure.
export const requireSettings = (
  environment: Environment,
  settings: { [environmentPath: string]: string }
): void => {
  const missing = Object.entries(settings)
    .filter(([path]) => !readEnvironmentPath(environment, path))
    .map(([, envVariable]) => envVariable);
  if (missing.length)
    throw new Error(`settings are not set: ${missing.join(', ')}`);
};
