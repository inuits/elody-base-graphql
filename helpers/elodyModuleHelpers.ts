import { Module } from 'graphql-modules';
import { baseModule } from '../baseModule/baseModule';
import { StorageAPI } from '../sources/storage';
import { CollectionAPI } from '../sources/collection';
import { GraphqlAPI } from '../sources/graphql';
import { DataSources, OptionalDataSources } from '../types';
import { AuthRESTDataSource, Environment, environment } from '../main';
import { TranscodeService } from '../sources/transcode';
import { OcrService } from '../sources/ocr';

export type ElodyConfig = {
  modules: Module[];
  dataSources: ((session: any, cache: any) => OptionalDataSources)[];
};

const baseElodyElodyConfig: ElodyConfig = {
  modules: [baseModule],
  dataSources: [
    (session: any, cache: any) => {
      return { CollectionAPI: new CollectionAPI({ session, cache }) };
    },
    (session: any, cache: any) => {
      return { StorageAPI: new StorageAPI({ session, cache }) };
    },
    (session: any, cache: any) => {
      return { GraphqlAPI: new GraphqlAPI({ session, cache }) };
    },
  ],
};

export const addAdditionalOptionalDataSources = (environment: Environment) => {
  if (environment?.api.fileSystemImporterServiceUrl) {
    baseElodyElodyConfig.dataSources.push((session: any, cache: any) => {
      return { TranscodeService: new TranscodeService({ session, cache }) };
    });
  }
  if (environment?.api.ocrService) {
    baseElodyElodyConfig.dataSources.push((session: any, cache: any) => {
      return { OcrService: new OcrService({ session, cache }) };
    });
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
  cache: any
): DataSources => {
  const dataSourceArray = ElodyConfig.dataSources.map((mappingItem) =>
    mappingItem(session, cache)
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
        }) => AuthRESTDataSource;
      }
    | undefined = undefined
): ElodyConfig => {
  if (!dataSources) return { modules, dataSources: [] };
  const dataSourceKeys = Object.keys(dataSources);
  const dataSourcesToInitialize = dataSourceKeys.map(
    (dataSourceKey: string) => {
      return (session: any, cache: any) => {
        return {
          [dataSourceKey]: new dataSources[dataSourceKey]({ session, cache }),
        };
      };
    }
  );

  return { modules, dataSources: dataSourcesToInitialize };
};
