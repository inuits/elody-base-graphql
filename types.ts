import { ImportAPI } from 'import-module';
import { CollectionAPI } from './sources/collection';
import { StorageAPI } from './sources/storage';
import {
  AdvancedFilter,
  Maybe,
  MetadataFieldOption,
  PermissionRequestInfo,
  Formatters,
} from '../../generated-types/type-defs';
import { TranscodeService } from './sources/transcode';
import { OcrService } from './sources/ocr';
import { AuthRESTDataSource } from "./auth/AuthRESTDataSource";

export interface OptionalDataSources {
  CollectionAPI?: CollectionAPI;
  ImportAPI?: ImportAPI;
  StorageAPI?: StorageAPI;
  TranscodeService?: TranscodeService;
  OcrService?: OcrService;
  [key: string]: AuthRESTDataSource;
}

export interface DataSources {
  CollectionAPI: CollectionAPI;
  ImportAPI: ImportAPI;
  StorageAPI: StorageAPI;
  TranscodeService: TranscodeService;
  OcrService: OcrService;
  [key: string]: AuthRESTDataSource;
}

export interface ContextValue {
  dataSources: DataSources;
  customPermissions: { [key: string]: PermissionRequestInfo };
  customFormatters: FormattersConfig;
}
// TODO: Remove if unused
export type filter = {
  key: string;
  label: string;
  type: string;
  options?: Maybe<MetadataFieldOption>[];
  isRelation?: boolean;
};

type Filters = {
  filters: Record<string, Array<AdvancedFilter>>;
};

export type FormattersConfig = {
  [formatterType: string]: {
    [key: string]: Formatters;
  };
};

export type TypeUrlMapping = {
  mapping: { [key: string]: string }, 
  reverseMapping: { [key: string]: string }
}

export type Config = Record<string, Array<string>> & Filters;
