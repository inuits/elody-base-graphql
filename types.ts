import { CollectionAPI } from './modules/baseGraphql/sources/collection';
import { SearchAPI } from './modules/baseGraphql/sources/search';
import { ImportAPI } from './modules/baseGraphql/sources/import';
import { StorageAPI } from './modules/baseGraphql/sources/storage';
import { AuthSessionResponse } from 'inuits-apollo-server-auth';
import { Cookie, Session, SessionData } from 'express-session';
import {
  FilterOption,
  Maybe,
  MetadataFieldOption,
} from './generated-types/type-defs';
import { BaseContext } from '@apollo/server';

export interface DataSources {
  CollectionAPI: CollectionAPI;
  SearchAPI: SearchAPI;
  ImportAPI: ImportAPI;
  StorageAPI: StorageAPI;
}

export interface ContextValue {
  dataSources: DataSources;
}

export type filter = {
  key: string;
  label: string;
  type: string;
  options?: Maybe<MetadataFieldOption>[];
  isRelation?: boolean;
};

type Filters = {
  filters: Record<string, Array<filter>>;
};

export type Config = Record<string, Array<string>> & Filters;
