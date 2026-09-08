import { Module } from 'graphql-modules';
import { PermissionRequestInfo } from '../generated-types/type-defs';

export type ElodyModuleContributions = Module & {
  elodyPermissions?: { [key: string]: PermissionRequestInfo };
  elodyFeatures?: { [key: string]: ModuleFeature };
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
