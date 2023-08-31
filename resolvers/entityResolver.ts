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
  MediaFile,
  Metadata,
  Permission,
  TeaserMetadataOptions,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import { customSort } from '../helpers/helpers';

export const resolveMedia = async (dataSources: DataSources, parent: any) => {
  // TODO: Load media inside of initialValues
  let input: any[] = [];
  try {
    await dataSources.CollectionAPI.getMediafiles(parent.id).then(
      (mediafiles: any) => {
        input = mediafiles.results.map((mediafile: MediaFile) => {
          return {
            primary_mediafile: mediafile.filename,
            primary_mediafile_location: mediafile.original_file_location,
            primary_thumbnail_location: mediafile.thumbnail_file_location,
            primary_transcode: mediafile.transcode_filename,
            id: mediafile._id,
          };
        });
      }
    );
  } catch {
    console.error(`no mediafiles for ${parent.id}`);
  }

  return parseMedia(input[0]);
};

export const resolveMetadata = async (
  parent: any,
  keys: Maybe<string>[],
  excludeOrInclude: ExcludeOrInclude,
  options: TeaserMetadataOptions[] = []
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
  metadataArray = metadataArray.map((metadataItem: any) => {
    const matchingOption = options.find(
      (option) => option.key === metadataItem.key
    );
    if (matchingOption) {
      metadataItem.unit = matchingOption.unit;
    }
    return metadataItem;
  });

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

export const resolveRelations = async (parent: any) => {
  let relations: string[] = [];
  if (parent.relations)
    relations = parent.relations.filter(
      (relation: any) => relation.type === 'belongsTo'
    );

  return relations;
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
