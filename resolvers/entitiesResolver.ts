import { DataSources } from '../types';
import {
  EntitiesResults,
  AdvancedFilterInput,
  AdvancedFilterTypes,
  Entitytyping,
  SearchFilter,
  Entity,
} from '../../../generated-types/type-defs';
import { determineAdvancedFiltersForIteration } from '../helpers/helpers';

export const resolveAdvancedEntities = async (
  dataSources: DataSources,
  entityType: Entitytyping = Entitytyping.BaseEntity,
  advancedFilterInputs: AdvancedFilterInput[],
  limit: number = 20,
  skip: number = 1,
  searchValue: SearchFilter = { value: '' }
): Promise<EntitiesResults> => {
  const entitiesResult: any[] = [];
  let countResult = 0;
  let limitResult = limit;

  const typeFilters: AdvancedFilterInput[] = advancedFilterInputs.filter(
    (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Type
  );

  if (!typeFilters.length)
    typeFilters.push({
      type: AdvancedFilterTypes.Type,
      value: entityType as string,
      match_exact: true,
    });

  for await (const typeFilter of typeFilters) {
    const entityType: Entitytyping = typeFilter.value;

    const iterationFilters: AdvancedFilterInput[] =
      determineAdvancedFiltersForIteration(entityType, advancedFilterInputs);
    const iterationResult = await dataSources.CollectionAPI.GetAdvancedEntities(
      entityType,
      limit,
      skip,
      iterationFilters,
      searchValue
    );

    const iterationEntities: Entity[] = iterationResult?.results as Entity[];
    if (!iterationEntities) break;

    entitiesResult.push(...iterationEntities);
    countResult += iterationResult.count || 0;
  }

  return {
    results: entitiesResult,
    sortKeys: [],
    limit: limitResult,
    count: countResult,
  };
};

export const resolveSimpleEntities = (
  dataSources: DataSources
): EntitiesResults => {
  let entities: EntitiesResults = {
    results: [],
    sortKeys: [],
    count: 0,
    limit: 0,
  };
  return entities;
};
