import { DataSources } from '../types';
import {
  EntitiesResults,
  AdvancedFilterInput,
  AdvancedFilterTypes,
  Entitytyping,
  SearchFilter,
  Entity,
} from '../../../generated-types/type-defs';
import { getTypesFromFilterInputs } from '../helpers/helpers';

export const resolveAdvancedEntities = async (
  dataSources: DataSources,
  entityType: Entitytyping = Entitytyping.BaseEntity,
  advancedFilterInputs: AdvancedFilterInput[],
  limit: number = 20,
  skip: number = 1,
  searchValue: SearchFilter = { value: '' }
): Promise<EntitiesResults> => {
  const entitiesMap = new Map<string, Entity>();
  let limitResult = limit;

  let entityTypes = getTypesFromFilterInputs(advancedFilterInputs, entityType);

  for await (const entityType of entityTypes as Entitytyping[]) {
    const iterationFilters: AdvancedFilterInput[] = advancedFilterInputs.filter(
      (filter: AdvancedFilterInput) => filter.type !== AdvancedFilterTypes.Type
    );

    const containsTypeFilter = iterationFilters.some(
      (filter: AdvancedFilterInput) => filter.type === AdvancedFilterTypes.Type
    );
    if (!containsTypeFilter) {
      iterationFilters.push({
        type: AdvancedFilterTypes.Type,
        value: entityType as string,
        match_exact: true,
      });
    }

    const iterationResult = await dataSources.CollectionAPI.GetAdvancedEntities(
      entityType,
      limit,
      skip,
      iterationFilters,
      searchValue
    );

    const iterationEntities: Entity[] = iterationResult?.results as Entity[];
    if (!iterationEntities) break;

    iterationEntities.forEach((entity) => {
      if (entity.id) {
        entitiesMap.set(entity.id, entity); // overwrite duplicates
      }
    });
  }

  return {
    results: Array.from(entitiesMap.values()),
    sortKeys: [],
    limit: limitResult,
    count: entitiesMap.size,
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
