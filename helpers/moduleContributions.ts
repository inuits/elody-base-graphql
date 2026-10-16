import { Module } from 'graphql-modules';
import { InputField, PermissionRequestInfo } from '../generated-types/type-defs';
import type { Environment } from '../types/environmentTypes';
import type { ElodyModuleConfig } from './elodyModuleHelpers';

export type ElodyModuleContributions = Module & {
  elodyPermissions?: { [key: string]: PermissionRequestInfo };
  elodyFeatures?: { [key: string]: ModuleFeature };
  elodyInputFields?: { [key: string]: InputField };
  elodyDataSources?: ElodyModuleConfig['dataSources'];
  elodyRequirements?: ModuleRequirements;
};

// Maps an environment path (e.g. 'api.fileSystemImporterServiceUrl') to the
// env variable that sets it, so the boot error can name what to configure.
export type ModuleRequirements = { environment?: Record<string, string> };

export type ModuleFeature = { enabled: boolean; permission?: string };

export const collectModulePermissions = (
  modules: Module[]
): { [key: string]: PermissionRequestInfo } =>
  modules.reduce(
    (collected, module) => ({
      ...collected,
      ...(module as ElodyModuleContributions).elodyPermissions,
    }),
    {}
  );

export const collectModuleFeatures = (
  modules: Module[]
): { [key: string]: ModuleFeature } =>
  modules.reduce(
    (collected, module) => ({
      ...collected,
      ...(module as ElodyModuleContributions).elodyFeatures,
    }),
    {}
  );

export const collectModuleInputFields = (
  modules: Module[]
): { [key: string]: InputField } =>
  modules.reduce(
    (collected, module) => ({
      ...collected,
      ...(module as ElodyModuleContributions).elodyInputFields,
    }),
    {}
  );

export const collectModuleDataSources = (
  modules: Module[]
): NonNullable<ElodyModuleConfig['dataSources']> =>
  modules.reduce(
    (collected, module) => ({
      ...collected,
      ...(module as ElodyModuleContributions).elodyDataSources,
    }),
    {}
  );

const readEnvironmentPath = (environment: Environment, path: string): any =>
  path.split('.').reduce((value: any, key) => value?.[key], environment);

export const findUnmetModuleRequirements = (
  modules: Module[],
  environment: Environment
): string[] =>
  modules.flatMap((module) => {
    const required =
      (module as ElodyModuleContributions).elodyRequirements?.environment ?? {};
    const missing = Object.entries(required)
      .filter(([path]) => !readEnvironmentPath(environment, path))
      .map(([, envVariable]) => envVariable);
    return missing.length
      ? [
          `${module.id} requires settings that are not set: ${missing.join(', ')}`,
        ]
      : [];
  });
