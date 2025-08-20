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

type RawFacetGroup = {
  [facetName: string]: { _id: string; count: number; }[];
};

export const resolveAdvancedEntities = async (
  dataSources: DataSources,
  entityType: Entitytyping = Entitytyping.BaseEntity,
  advancedFilterInputs: AdvancedFilterInput[],
  limit: number = 20,
  skip: number = 1,
  searchValue: SearchFilter = { value: '' }
): Promise<EntitiesResults> => {
  const entitiesMap = new Map<string, Entity>();
  const facetsList: RawFacetGroup[] = [];
  let limitResult = limit;

  let typesFromFilters = getTypesFromFilterInputs(advancedFilterInputs);
  let entityTypes = typesFromFilters.length > 0 ? typesFromFilters : [entityType];
  let entityTypesToLoop = entityTypes;
  let totalCount = 0;

  const containSelectionFilterWithMultipleValues = advancedFilterInputs.some(
    (filter: AdvancedFilterInput) =>
      filter.type === AdvancedFilterTypes.Selection && filter.key === 'type' && filter.value?.length > 1
  );
  if (containSelectionFilterWithMultipleValues) {
    entityTypesToLoop = [entityTypesToLoop[0]];
  }

  for await (const entityType of entityTypesToLoop as Entitytyping[]) {
    const iterationFilters: AdvancedFilterInput[] = advancedFilterInputs.filter(
      (filter: AdvancedFilterInput) => filter.type !== AdvancedFilterTypes.Type || filter.facets
    );

    const containsTypeFilter =
      iterationFilters.some(
        (filter: AdvancedFilterInput) =>
          filter.type === AdvancedFilterTypes.Type
      ) ||
      iterationFilters.some(
        (filter: AdvancedFilterInput) =>
          filter.type === AdvancedFilterTypes.Selection && filter.key === 'type'
      );

    if (!containsTypeFilter) {
      iterationFilters.push({
        type: AdvancedFilterTypes.Type,
        value: entityType as string,
        match_exact: true,
      });
    }

    if (containSelectionFilterWithMultipleValues) {
      const selectionFilter = iterationFilters.find(filter => filter.type === AdvancedFilterTypes.Selection && filter.key === 'type')
      if (selectionFilter) selectionFilter.value = entityTypes
    }

    const iterationResult = await dataSources.CollectionAPI.GetAdvancedEntities(
      entityType,
      limit,
      skip,
      iterationFilters,
      searchValue
    );

    const iterationEntities: Entity[] = iterationResult?.results as Entity[];
    totalCount += iterationResult.count ?? 0;

    if (!iterationEntities) break;


    if (iterationResult?.facets) {
      facetsList.push(...iterationResult.facets);
    }

    iterationEntities.forEach((entity) => {
      if (entity.id) {
        entitiesMap.set(entity.id, entity); // overwrite duplicates
      }
    });
  }

  return {
    results: Array.from(entitiesMap.values()),
    sortKeys: [],
    facets: facetsList,
    limit: limitResult,
    count: totalCount,
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
