import { CollectionAPI } from './sources/collection';
import {
  AdvancedFilter,
  Maybe,
  MetadataFieldOption,
  PermissionRequestInfo,
  Formatters,
} from './generated-types/type-defs';
import { GraphqlAPI } from './sources/graphql';
import { AuthRESTDataSource } from './auth/AuthRESTDataSource';

export interface OptionalDataSources {
  CollectionAPI?: CollectionAPI;
  GraphqlAPI?: GraphqlAPI;
}

interface DefaultDataSources {
  CollectionAPI: CollectionAPI;
  GraphqlAPI: GraphqlAPI;
}

export interface DataSources extends DefaultDataSources {
  [key: string]: AuthRESTDataSource;
}

export interface ContextValue {
  dataSources: DataSources;
  customPermissions: { [key: string]: PermissionRequestInfo };
  customFormatters: FormattersConfig;
  customFilterMatchers?: Record<string, string[]>;
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
  mapping: { [key: string]: string };
  reverseMapping: { [key: string]: string };
};

export type Config = Record<string, Array<string>> & Filters;
