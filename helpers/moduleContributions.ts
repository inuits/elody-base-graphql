import { Module } from 'graphql-modules';
import { InputField, PermissionRequestInfo } from '../generated-types/type-defs';

export type ElodyModuleContributions = Module & {
  elodyPermissions?: { [key: string]: PermissionRequestInfo };
  elodyFeatures?: { [key: string]: ModuleFeature };
  elodyInputFields?: { [key: string]: InputField };
};

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
