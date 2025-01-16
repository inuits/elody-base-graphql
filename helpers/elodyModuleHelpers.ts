import { Module } from 'graphql-modules';
import { baseModule } from '../baseModule/baseModule';
import { StorageAPI } from '../sources/storage';
import { CollectionAPI } from '../sources/collection';
import { DataSources, OptionalDataSources } from '../types';
import { Environment, environment } from '../main';
import { TranscodeService } from '../sources/transcode';
import { OcrService } from '../sources/ocr';

export type ModuleDataSourceMapping = {
  module: Module;
  dataSources: ((session: any, cache: any) => OptionalDataSources)[];
};

const baseElodyModuleDataSourceMapping: ModuleDataSourceMapping = {
  module: baseModule,
  dataSources: [
    (session: any, cache: any) => {
      return { CollectionAPI: new CollectionAPI({ session, cache }) };
    },
    (session: any, cache: any) => {
      return { StorageAPI: new StorageAPI({ session, cache }) };
    },
  ],
};

export const addAdditionalOptionalDataSources = (environment: Environment) => {
  if (environment?.api.fileSystemImporterServiceUrl) {
    baseElodyModuleDataSourceMapping.dataSources.push(
      (session: any, cache: any) => {
        return { TranscodeService: new TranscodeService({ session, cache }) };
      }
    );
  }
  if (environment?.api.ocrService) {
    baseElodyModuleDataSourceMapping.dataSources.push(
      (session: any, cache: any) => {
        return { OcrService: new OcrService({ session, cache }) };
      }
    );
  }
};

export const createFullElodyModuleDataSourceMapping = (
  customModuleDataSourceMapping: ModuleDataSourceMapping[]
): ModuleDataSourceMapping[] => {
  return [baseElodyModuleDataSourceMapping, ...customModuleDataSourceMapping];
};

export const getModulesFromMapping = (
  moduleDataSourceMapping: ModuleDataSourceMapping[]
): Module[] => {
  return moduleDataSourceMapping.map((mappingItem) => mappingItem.module);
};

export const getDataSourcesFromMapping = (
  moduleDataSourceMapping: ModuleDataSourceMapping[],
  session: any,
  cache: any
): DataSources => {
  const dataSourceArrays: Array<OptionalDataSources[]> =
    moduleDataSourceMapping.map((mappingItem) =>
      mappingItem.dataSources.map((factory) => factory(session, cache))
    );
  return dataSourceArrays.flat().reduce((acc, curr) => {
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
