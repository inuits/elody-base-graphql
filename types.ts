import { ImportAPI } from 'import-module';
import { CollectionAPI } from './sources/collection';
import { StorageAPI } from './sources/storage';
import {
  AdvancedFilter,
  Maybe,
  MetadataFieldOption,
} from '../../generated-types/type-defs';
import { TranscodeService } from './sources/transcode';
import {OcrService} from "./sources/ocr";

export interface DataSources {
  CollectionAPI: CollectionAPI;
  ImportAPI: ImportAPI;
  StorageAPI: StorageAPI;
  TranscodeService?: TranscodeService;
  OcrService?: OcrService;
}

export interface ContextValue {
  dataSources: DataSources;
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

export type Config = Record<string, Array<string>> & Filters;
