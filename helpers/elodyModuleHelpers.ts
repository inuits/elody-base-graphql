import { Module } from 'graphql-modules';
import { baseModule } from '../baseModule/baseModule';
import { StorageAPI } from '../sources/storage';
import { CollectionAPI } from '../sources/collection';
import { GraphqlAPI } from '../sources/graphql';
import { DataSources, OptionalDataSources } from '../types';
import { AuthRESTDataSource } from '../main';
import { TranscodeService } from '../sources/transcode';
import { OcrService } from '../sources/ocr';
import { Environment } from '../types/environmentTypes';

export type ElodyConfig = {
  modules: Module[];
  dataSources: ((
    session: any,
    cache: any,
    clientIp: string
  ) => OptionalDataSources)[];
};

const baseElodyElodyConfig: ElodyConfig = {
  modules: [baseModule],
  dataSources: [
    (session: any, cache: any, clientIp: string) => {
      return { CollectionAPI: new CollectionAPI({ session, cache, clientIp }) };
    },
    (session: any, cache: any, clientIp: string) => {
      return { StorageAPI: new StorageAPI({ session, cache, clientIp }) };
    },
    (session: any, cache: any) => {
      return { GraphqlAPI: new GraphqlAPI({ session, cache }) };
    },
  ],
};

export const addAdditionalOptionalDataSources = (environment: Environment) => {
  if (environment.api.fileSystemImporterServiceUrl) {
    baseElodyElodyConfig.dataSources.push(
      (session: any, cache: any, clientIp: string) => {
        return {
          TranscodeService: new TranscodeService({ session, cache, clientIp }),
        };
      }
    );
  }
  if (environment.api.ocrService) {
    baseElodyElodyConfig.dataSources.push(
      (session: any, cache: any, clientIp: string) => {
        return { OcrService: new OcrService({ session, cache, clientIp }) };
      }
    );
  }
};

export const createFullElodyConfig = (
  customElodyConfig: ElodyConfig
): ElodyConfig => {
  const fullConfig = baseElodyElodyConfig;
  fullConfig.modules.push(...customElodyConfig.modules);
  fullConfig.dataSources.push(...customElodyConfig.dataSources);
  return fullConfig;
};

export const getDataSourcesFromMapping = (
  ElodyConfig: ElodyConfig,
  session: any,
  cache: any,
  clientIp: string
): DataSources => {
  const dataSourceArray = ElodyConfig.dataSources.map((mappingItem) =>
    mappingItem(session, cache, clientIp)
  );
  return dataSourceArray.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {}) as DataSources;
};

export const isRequiredDataSources = (
  dataSources: OptionalDataSources
): dataSources is DataSources => {
  return (
    dataSources.CollectionAPI !== undefined &&
    dataSources.StorageAPI !== undefined
  );
};

export const generateElodyConfig = (
  modules: Module[],
  dataSources:
    | {
        [key: string]: new ({
          session,
          cache,
        }: {
          session: any;
          cache: any;
          clientIp: string;
        }) => AuthRESTDataSource;
      }
    | undefined = undefined
): ElodyConfig => {
  if (!dataSources) return { modules, dataSources: [] };
  const dataSourceKeys = Object.keys(dataSources);
  const dataSourcesToInitialize = dataSourceKeys.map(
    (dataSourceKey: string) => {
      return (session: any, cache: any, clientIp: string) => {
        return {
          [dataSourceKey]: new dataSources[dataSourceKey]({
            session,
            cache,
            clientIp,
          }),
        };
      };
    }
  );

  return { modules, dataSources: dataSourcesToInitialize };
};
