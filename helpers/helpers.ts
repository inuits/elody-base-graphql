import {
  AdvancedFilterInput,
  AdvancedFilterTypes,
  Entitytyping,
  Metadata,
  Unit
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import { environment } from '../main';
import {parseRelationTypesForEntityType} from "../parsers/entity";

export const customSort = (
  customSortOrder: string[],
  arrayToSort: any[],
  sortKey: string
) => {
  const ordering: any = {};
  for (let i = 0; i < customSortOrder.length; i++) {
    ordering[customSortOrder[i]] = i;
  }

  arrayToSort.sort(function (a: any, b: any) {
    return ordering[a[sortKey]] - ordering[b[sortKey]];
  });
  return arrayToSort;
};

export const setPreferredLanguageForDataSources = (
  dataSources: DataSources,
  preferredLanguage: string
) => {
  dataSources.CollectionAPI.preferredLanguage = preferredLanguage;
};

export const getMetadataItemValueByKey = (
  metadataKey: string,
  metadata: Metadata[],
  backupValue: string = ''
): string => {
  return (
    metadata.find((metadataItem: Metadata) => metadataItem.key === metadataKey)
      ?.value || backupValue
  );
};

export const getEntityId = (entity: any) => {
  const key: string = environment?.customization?.entityIdKey || '_id';
  return entity[key];
};

export const capitalizeString = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const determineAdvancedFiltersForIteration = (entityType: Entitytyping, advancedFilterInputs: AdvancedFilterInput[]) => {
  const relations = parseRelationTypesForEntityType(entityType)
  let filtersIteration = advancedFilterInputs.filter((advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Type);
  if (filtersIteration.length > 0) {
    filtersIteration = JSON.parse(JSON.stringify(filtersIteration));
    filtersIteration[0].value = filtersIteration[0].value.filter((value: string) => value === entityType)[0];
  }
  advancedFilterInputs.filter((advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Selection).forEach((filter: AdvancedFilterInput) => {
    if (Array.isArray(filter.key)) {
      if (compareRelationsFilterKey(filter.key[0], relations.relationType) || compareRelationsFilterKey(filter.key[0], relations.fromRelationType))
        filtersIteration.push(filter);
    }
    else {
      if (filter.key === relations.relationType || filter.key === relations.fromRelationType) {
        filtersIteration.push(filter);
      }
    }
  });
  return filtersIteration;
};

function compareRelationsFilterKey(key: string, comparison: string): boolean {
  const match = key.match(/relations\.(.*?)\.key/);
  if (!match || match.length < 2)
    return false;
  return match[1] === comparison;
}