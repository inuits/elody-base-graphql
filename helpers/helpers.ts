import {Metadata, Unit} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import { environment} from "../main";

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

export const getEntityId = (
    entity: any,
) => {
  const key = environment !== undefined ? environment.customization.entityIdKey : "_id";
  return entity[key];
};