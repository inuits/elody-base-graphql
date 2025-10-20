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
import proj4 from 'proj4';
import type { Request, Response } from 'express';

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
    error.extensions?.statusCode ||
    error.extensions?.response?.status ||
    error.status ||
    500
  );
};

export const normalizeCoordinatesForHeatmap = (coordinates: number[]) => {
  return proj4('EPSG:4326', 'EPSG:3857', coordinates);
};

export const normalizeWeightForHeatmap = (value: number) => {
  return value / 100;
};

export const getTypesFromFilterInputs = (
  advancedFilterInputs: AdvancedFilterInput[],
  entityType?: Entitytyping
): Entitytyping[] => {
  const entityTypes: Set<string> = new Set(entityType ? [entityType] : []);
  const typeFilters: AdvancedFilterInput[] = advancedFilterInputs.filter(
    (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Type
  );
  const selectionFilters: AdvancedFilterInput[] = advancedFilterInputs.filter(
    (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Selection
  );

  typeFilters
    .flatMap((filter: AdvancedFilterInput) => filter.value)
    .forEach((val) => entityTypes.add(val));

  if (selectionFilters.length) {
    const typeSelectionFilter: AdvancedFilterInput | undefined =
      selectionFilters.find(
        (filter: AdvancedFilterInput) => filter.key === 'type'
      );
    if (typeSelectionFilter) {
      const selectionTypes = Array.isArray(typeSelectionFilter.value)
        ? typeSelectionFilter.value
        : [typeSelectionFilter.value];
      selectionTypes.forEach((type) => entityTypes.add(type));
    }
  }

  return Array.from(entityTypes) as Entitytyping[];
};

export const checkRequestContentType = (req: Request, res: Response) => {
  const allowed = ['application/json'];
  const contentType = req.headers['content-type'];
  if (!contentType || !allowed.includes(contentType)) {
    res.status(415).send('Unsupported Media Type');
    return true;
  }
  return false;
};
