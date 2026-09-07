import { Module } from 'graphql-modules';
import { PermissionRequestInfo } from '../generated-types/type-defs';

// A module that owns permission definitions or feature flags attaches them to
// itself, so installing the module is all a client has to do.
export type ElodyModuleContributions = Module & {
  elodyPermissions?: { [key: string]: PermissionRequestInfo };
  elodyFeatures?: { [key: string]: ModuleFeature };
};

// A feature that names a permission is only reported as enabled to a user who
// passes that permission.
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
