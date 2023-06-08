import {
  AdvancedFilter,
  Collection
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';

export const resolveFiltersWithOptions = async (
  dataSources: DataSources,
  collection: Collection
): Promise<AdvancedFilter[]> => {
  const kind: string =
    collection == Collection.Mediafiles ? 'mediafileFilters' : 'entityFilters';
  const filters = (await dataSources.CollectionAPI.getConfig()).filters[
    kind
  ] as AdvancedFilter[];
  return filters;
};
