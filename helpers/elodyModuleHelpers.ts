import { Module } from 'graphql-modules';
import { baseModule } from '../baseModule/baseModule';
import { CollectionAPI } from '../sources/collection';
import { GraphqlAPI } from '../sources/graphql';
import { DataSources, OptionalDataSources } from '../types';
import { AuthRESTDataSource } from '../main';
import { Environment } from '../types/environmentTypes';
import { Express } from 'express';

export type ElodyModuleConfig = {
  modules: Module[];
  dataSources:
    | {
        [key: string]: new ({
          session,
          cache,
        }: {
          environment: Environment;
          session: any;
          cache: any;
          clientIp: string;
          context: { tenantId?: string };
        }) => AuthRESTDataSource;
      }
    | undefined;
  endpoints?: ((app: Express, environment: Environment) => void)[];
};

export type ElodyConfig = {
  modules: Module[];
  dataSources: ((
    environment: Environment,
    session: any,
    cache: any,
    clientIp: string,
    tenantId?: string
  ) => OptionalDataSources)[];
  endpoints: ((app: Express, environment: Environment) => void)[];
};

const baseElodyElodyConfig: ElodyConfig = {
  modules: [baseModule],
  dataSources: [
    (environment: Environment, session: any, cache: any, clientIp: string, tenantId?: string) => {
      return {
        CollectionAPI: new CollectionAPI({
          environment,
          session,
          cache,
          clientIp,
          context: { tenantId }
        }),
      };
    },
    (environment: Environment, session: any, cache: any, clientIp: string, tenantId?: string) => {
      return { GraphqlAPI: new GraphqlAPI({ environment, session, cache, context: { tenantId } }) };
    },
  ],
  endpoints: [],
};

export const addAdditionalOptionalDataSources = (_environment: Environment) => {};

export const createFullElodyConfig = (
  customElodyConfig: ElodyConfig
): ElodyConfig => {
  const fullConfig = baseElodyElodyConfig;
  fullConfig.modules.push(...customElodyConfig.modules);
  fullConfig.dataSources.push(...customElodyConfig.dataSources);
  fullConfig.endpoints.push(...customElodyConfig.endpoints);
  return fullConfig;
};

export const getDataSourcesFromMapping = (
  ElodyConfig: ElodyConfig,
  environment: Environment,
  session: any,
  cache: any,
  clientIp: string,
  tenantId: string
): DataSources => {
  const dataSourceArray = ElodyConfig.dataSources.map((mappingItem) =>
    mappingItem(environment, session, cache, clientIp, tenantId)
  );
  return dataSourceArray.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {}) as DataSources;
};

export const isRequiredDataSources = (
  dataSources: OptionalDataSources
): dataSources is DataSources => {
  return dataSources.CollectionAPI !== undefined;
};

export const generateElodyConfig = (
  elodyModuleConfig: ElodyModuleConfig
): ElodyConfig => {
  const { dataSources, modules, endpoints = [] } = elodyModuleConfig;

  if (!dataSources) return { modules, dataSources: [], endpoints };

  const dataSourceKeys = Object.keys(dataSources);
  const dataSourcesToInitialize = dataSourceKeys.map(
    (dataSourceKey: string) => {
      return (
        environment: Environment,
        session: any,
        cache: any,
        clientIp: string,
        tenantId?: string
      ) => {
        return {
          [dataSourceKey]: new dataSources[dataSourceKey]({
            environment,
            session,
            cache,
            clientIp,
            context: { tenantId }
          }),
        };
      };
    }
  );

  return {
    modules: modules,
    dataSources: dataSourcesToInitialize,
    endpoints,
  };
};
