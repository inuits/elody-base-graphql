import {
  parseMedia,
  parseMetaDataAndMetaDataRelation,
  parseRelations,
} from '../parsers/entity';
import {
  Collection,
  Maybe,
  MediaFile,
  Permission,
  TeaserMetadataOptions,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';
import { customSort, getEntityId } from '../helpers/helpers';

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
  options: TeaserMetadataOptions[] = []
) => {
  let metadataArray = [];

  if (parent.metadata) {
    metadataArray = parent.metadata.filter((metadataInput: any) => {
      if (metadataInput.type !== 'parent') {
        return metadataInput.key && keys.includes(metadataInput.key);
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
    metadataArray.push({
      key: 'type',
      label: 'type',
      value: parent.type,
    });
  }
  metadataArray = customSort(keys as string[], metadataArray, 'key');
  return metadataArray;
};

export const resolveMetadataItemOfPreferredLanguage = (
  metadata: any[],
  preferredLanguage: string
) => {
  let preferredLanguageMetadataItem = metadata[0];
  try {
    metadata.forEach((item) => {
      let itemLanguageMetadata = { value: item.lang };
      if (!itemLanguageMetadata.value)
        itemLanguageMetadata = item.metadataOnRelation?.find(
          (item: { [key: string]: string }) => item.key === 'lang'
        );

      if (itemLanguageMetadata?.value === preferredLanguage) {
        preferredLanguageMetadataItem = item;
      }
    });
  } catch (e) {
    console.log(e);
    return preferredLanguageMetadataItem;
  }

  return preferredLanguageMetadataItem;
};

export const resolveId = (parent: any) => {
  return getEntityId(parent);
};

export const resolveRelations = async (parent: any) => {
  return parseRelations(parent.relations);
};

export const simpleReturn = (parent: any) => {
  return parent;
};
