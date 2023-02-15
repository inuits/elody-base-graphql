import { CollectionAPI } from '../baseGraphql/sources/collection';
import { SearchAPI } from '../baseGraphql/sources/search';
import { ImportAPI } from '../importModule/sources/import';
import { StorageAPI } from '../baseGraphql/sources/storage';
import {
  AdvancedFilter,
  Maybe,
  MetadataFieldOption,
} from '../../generated-types/type-defs';

export interface DataSources {
  CollectionAPI: CollectionAPI;
  SearchAPI: SearchAPI;
  ImportAPI: ImportAPI;
  StorageAPI: StorageAPI;
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
