import {
  isKeyIncludedOrExcludedInMetaData,
  parseMedia,
  parseMetaDataAndMetaDataRelation,
} from '../parsers/entity';
import {
  Collection,
  Entity,
  ExcludeOrInclude,
  Maybe,
  Metadata,
  Permission,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import { customSort } from '../helpers/helpers';

export const resolveMedia = async (dataSources: DataSources, parent: any) => {
  // let mediafiles: MediaFile[] = [];
  // try {
  //   mediafiles = await dataSources.CollectionAPI.getMediafiles(parent.id);
  // } catch {
  //   console.error(`no mediafiles for ${parent.id}`);
  // }
  console.log(parent);
  return parseMedia(parent);
};

export const resolveMetadata = async (
  parent: any,
  keys: Maybe<string>[],
  excludeOrInclude: ExcludeOrInclude
) => {
  let metadataArray = [];

  if (parent.metadata) {
    metadataArray = parent.metadata.filter((metadataInput: any) => {
      //Exclude parent items by default TODO make dynamic
      if (metadataInput.type !== 'parent') {
        return isKeyIncludedOrExcludedInMetaData(
          metadataInput,
          keys,
          excludeOrInclude
        );
      }
    });
  }
  metadataArray = metadataArray.map(parseMetaDataAndMetaDataRelation);

  if (keys.includes('type')) {
    //Add type
    metadataArray.unshift({
      key: 'type',
      label: 'type',
      value: parent.type,
    });
  }
  metadataArray = customSort(keys as string[], metadataArray, 'key');
  return metadataArray;
};

export const resolvePermission = async (
  dataSources: DataSources,
  id: string,
  collection: Collection = Collection.Entities
): Promise<Permission[]> => {
  let permissionsFromApi: any = [];
  try {
    permissionsFromApi = await dataSources.CollectionAPI.getPermission(
      id,
      collection
    );
  } catch (error) {
    // throw new Error('No permissions found');
  }

  return permissionsFromApi.map((item: string) =>
    item.replace('-', '')
  ) as Permission[];
};

export const addCustomMetadataToEntity = async (
  entity: Entity,
  metadataInput: Metadata[]
): Promise<Entity> => {
  metadataInput.forEach((item: Metadata) => {
    entity.metadata?.push(item);
  });
  return entity;
};
