import { Module } from 'graphql-modules';
import { InputField, PermissionRequestInfo } from '../generated-types/type-defs';

export type ElodyModuleContributions = Module & {
  elodyPermissions?: { [key: string]: PermissionRequestInfo };
  elodyFeatures?: { [key: string]: ModuleFeature };
  elodyInputFields?: { [key: string]: InputField };
  elodyRequirements?: ModuleRequirements;
};

export type ModuleRequirements = { dataSources?: string[] };

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

export const findUnmetModuleRequirements = (
  modules: Module[],
  registeredDataSources: string[]
): string[] =>
  modules.flatMap((module) => {
    const required =
      (module as ElodyModuleContributions).elodyRequirements?.dataSources ?? [];
    const missing = required.filter(
      (dataSource) => !registeredDataSources.includes(dataSource)
    );
    return missing.length
      ? [
          `${module.id} requires data sources that are not registered: ${missing.join(', ')}`,
        ]
      : [];
  });
