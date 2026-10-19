import { baseModule } from '../baseModule/baseModule';
import { CollectionAPI } from '../sources/collection';
import { GraphqlAPI } from '../sources/graphql';
import { HistoryServiceAPI } from '../sources/historyService';
import { DataSources, OptionalDataSources } from '../types';
import { Environment } from '../types/environmentTypes';
import {
  defineElodyModule,
  ElodyDataSource,
  ElodyDataSourceClass,
  ElodyModule,
} from './elodyModule';

export const createBaseElodyModule = (): ElodyModule =>
  defineElodyModule({
    name: 'baseModule',
    graphqlModule: baseModule,
    dataSources: [
      { name: 'CollectionAPI', source: CollectionAPI as ElodyDataSourceClass },
      { name: 'GraphqlAPI', source: GraphqlAPI as ElodyDataSourceClass },
      {
        name: 'HistoryServiceAPI',
        source: HistoryServiceAPI as ElodyDataSourceClass,
        enabled: (environment) => !!environment.api.historyServiceUrl,
      },
    ],
  });

export const buildDataSources = (
  dataSources: ElodyDataSource[],
  environment: Environment,
  session: any,
  cache: any,
  clientIp: string,
  clientOrigin: string | undefined,
  tenantId?: string
): OptionalDataSources =>
  Object.fromEntries(
    dataSources
      .filter((dataSource) => dataSource.enabled?.(environment) ?? true)
      .map((dataSource) => [
        dataSource.name,
        new dataSource.source({
          environment,
          session,
          cache,
          clientIp,
          clientOrigin,
          context: { tenantId },
        }),
      ])
  ) as OptionalDataSources;

// Required data sources live in base. Optional ones (transcode, storage, ocr,
// import, etc.) belong in extension modules and are never listed here.
// If a future extension needs a data source to be required, promote it to base.
export const REQUIRED_DATA_SOURCES = ['CollectionAPI'] as const;

export const findMissingRequiredDataSources = (
  dataSources: OptionalDataSources
): string[] =>
  REQUIRED_DATA_SOURCES.filter(
    (key) => (dataSources as any)[key] === undefined
  );

export const isRequiredDataSources = (
  dataSources: OptionalDataSources
): dataSources is DataSources => {
  return findMissingRequiredDataSources(dataSources).length === 0;
};
