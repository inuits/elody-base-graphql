import {
  AdvancedFilterInput,
  AdvancedFilterTypes,
  Entitytyping,
  Metadata,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import {
  CollectionAPIEntity,
  environment,
  CollectionAPIRelation,
} from '../main';
import { parseRelationTypesForEntityType } from '../parsers/entity';
import { baseTypeCollectionMapping as collection } from '../sources/typeCollectionMapping';
import { CollectionAPI } from '../sources/collection';

export const getCollectionValueForEntityType = (entityType: string): string => {
  if (!collection.hasOwnProperty(entityType)) {
    throw new Error(
      `Type "${entityType}" does not exist inside the collection dictionary. Please add it or check if the type is written incorrectly.`
    );
  }
  return collection[entityType];
};

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

export const getRelationsByType = (
  relationType: string,
  relations: CollectionAPIRelation[]
): CollectionAPIRelation[] => {
  return relations.filter(
    (relation: CollectionAPIRelation) => relation.type === relationType
  );
};

export const getPrimaryMediaFileIDOfEntity = (
  entity: CollectionAPIEntity
): string | undefined => {
  const mediaFileRelations = getRelationsByType(
    'hasMediafile',
    entity.relations
  );
  let primaryMediaFile: CollectionAPIRelation | undefined =
    mediaFileRelations.find(
      (mediaFile: CollectionAPIRelation) => mediaFile.is_primary
    );

  if (!primaryMediaFile) primaryMediaFile = mediaFileRelations[0];

  return primaryMediaFile.key || undefined;
};

export const getEntityId = (entity: any) => {
  const key: string = environment?.customization?.entityIdKey || '_id';
  return entity[key];
};

export const capitalizeString = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const determineAdvancedFiltersForIteration = (
  entityType: Entitytyping,
  advancedFilterInputs: AdvancedFilterInput[]
) => {
  const relations = parseRelationTypesForEntityType(entityType);
  let filtersIteration = advancedFilterInputs.filter(
    (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Type
  );
  if (filtersIteration.length > 0) {
    filtersIteration = JSON.parse(JSON.stringify(filtersIteration));
    filtersIteration[0].value = filtersIteration[0].value.filter(
      (value: string) => value === entityType
    )[0];
  }
  advancedFilterInputs
    .filter(
      (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Selection
    )
    .forEach((filter: AdvancedFilterInput) => {
      if (Array.isArray(filter.key)) {
        if (
          compareRelationsFilterKey(filter.key[0], relations.relationType) ||
          compareRelationsFilterKey(filter.key[0], relations.fromRelationType)
        )
          filtersIteration.push(filter);
      } else {
        if (
          filter.key === relations.relationType ||
          filter.key === relations.fromRelationType
        ) {
          filtersIteration.push(filter);
        }
      }
    });
  return filtersIteration;
};

export const compareRelationsFilterKey = (
  key: string,
  comparison: string
): boolean => {
  const match = key.match(/relations\.(.*?)\.key/);
  if (!match || match.length < 2) return false;
  return match[1] === comparison;
};

export const extractErrorCode = (error: any): number => {
  return (
    error.extensions?.statusCode || error.extensions?.response?.status || 500
  );
};
