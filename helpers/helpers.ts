import {
  AdvancedFilterInput,
  AdvancedFilterTypes,
  Entitytyping,
  Metadata,
  Collection,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import {
  CollectionAPIEntity,
  environment,
  CollectionAPIRelation,
} from '../main';
import { baseTypeCollectionMapping as collection } from '../sources/typeCollectionMapping';

const loggedTypes: string[] = [];

export const getCollectionValueForEntityType = (entityType: string): string => {
  if (!collection.hasOwnProperty(entityType)) {
    if (!loggedTypes.includes(entityType))
      console.info(
        `The default collection Entities was used for entity with type '${entityType}', add it to the collectionMapping to use another collection`
      );
    loggedTypes.push(entityType);
    return Collection.Entities;
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
  if (!relations) return [];
  return relations.filter(
    (relation: CollectionAPIRelation) => relation.type === relationType
  );
};

export const getPrimaryMediaFileIDOfEntity = (
  entity: CollectionAPIEntity
): string | undefined => {
  try {
    const mediaFileRelations = getRelationsByType(
      'hasMediafile',
      entity.relations
    );

    if (!mediaFileRelations) return undefined;

    let primaryMediaFile: CollectionAPIRelation | undefined =
      mediaFileRelations.find(
        (mediaFile: CollectionAPIRelation) => mediaFile.is_primary
      );

    if (!primaryMediaFile && mediaFileRelations)
      primaryMediaFile = mediaFileRelations[0];

    if (!primaryMediaFile) return undefined;

    return primaryMediaFile.key;
  } catch {
    return undefined;
  }
};

export const alterDimensionsOfIIIFUrl = (
  IIIFUrl: string,
  height: number | undefined,
  width: number | undefined
): string => {
  const regex = /\/full\/,\d+\/\d+\//;
  const stringHeight = height ? height.toString() : '';
  const stringWidth = width ? width.toString() : '';

  return IIIFUrl.replace(regex, `/full/${stringHeight},${stringWidth}/0/`);
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
  let filtersIteration = advancedFilterInputs.filter(
    (advancedFilter) =>
      advancedFilter.type === AdvancedFilterTypes.Type &&
      advancedFilter.value === entityType
  );
  advancedFilterInputs
    .filter(
      (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Selection
    )
    .forEach((filter: AdvancedFilterInput) => filtersIteration.push(filter));
  const aditionalFilters = advancedFilterInputs.filter(
    (advancedFilter: AdvancedFilterInput) =>
      advancedFilter.type !== AdvancedFilterTypes.Type &&
      advancedFilter.type !== AdvancedFilterTypes.Selection
  );
  filtersIteration.push(...aditionalFilters);
  return filtersIteration;
};

export const extractErrorCode = (error: any): number => {
  return (
    error.extensions?.statusCode ||
    error.extensions?.response?.status ||
    error.status ||
    500
  );
};
