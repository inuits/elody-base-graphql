import {
  InputRelationsDelete,
  relationInput,
} from 'base-graphql';
import {
  RelationMetaData,
  ExcludeOrInclude,
  Maybe,
  MediaFile,
  Metadata,
  MetadataAndRelation,
  MetadataRelation,
  MetadataFormInput,
  MediaFileMetadata,
  RelationValuesInput,
  MetadataValuesInput,
  Collection,
} from '../../../generated-types/type-defs';

const PROTECTED_METADATA_RELATION_KEY: string[] = [
  'key',
  'value',
  'type',
  'label',
];

export const setId = (entityRaw: any) => {
  entityRaw.id = entityRaw.object_id
    ? entityRaw.object_id
    : entityRaw.identifiers[0];
  entityRaw.uuid = entityRaw._id;
  return entityRaw;
};

export const setType = (entityRaw: any, type: string) => {
  entityRaw.type = type;
  return entityRaw;
};

export const isMetaDataRelation = (input: {
  type?: string;
}): 'MetadataRelation' | 'Metadata' => {
  if (input.type) {
    return 'MetadataRelation';
  }
  return 'Metadata';
};

export const parseMetaDataAndMetaDataRelation = (
  input: any
): Metadata | MetadataAndRelation => {
  if (isMetaDataRelation(input)) {
    return parseMetaDataRelation(input);
  } else {
    return parseMetaData(input);
  }
};

export const parseMetaData = (input: any): Metadata => {
  return {
    key: input.key as string,
    value: input.value ? input.value : ('' as string),
    lang: input.lang as string,
    label: input.label ? input.label : (input.key as string),
    immutable: input.immutable ? input.immutable : (false as boolean),
  };
};

export const parseMetaDataRelation = (input: any): MetadataRelation => {
  return {
    key: input.key as string,
    value: input.value ? input.value : ('' as string),
    label: input.label ? input.label : (input.key as string),
    type: input.type as string,
    metadataOnRelation: getMetaDataOnRelation(input),
  };
};

//Get all extra metadation on a relations
export const getMetaDataOnRelation = (
  input: Record<string, string | Record<string, string>>
): RelationMetaData[] => {
  let metadataOnRelation: RelationMetaData[] = [];
  for (const [key, value] of Object.entries(input)) {
    if (!PROTECTED_METADATA_RELATION_KEY.includes(key)) {
      //If the metadat is also object, flatten it like and at to main set
      if (value instanceof Object) {
        metadataOnRelation = [
          ...metadataOnRelation,
          ...getMetaDataOnRelation(value),
        ];
      } else {
        metadataOnRelation.push({
          key,
          value,
        });
      }
    }
  }

  return metadataOnRelation;
};

export const isKeyIncludedOrExcludedInMetaData = (
  input: { key?: string },
  allowedKeys: Maybe<string>[],
  excludeOrInclude: ExcludeOrInclude
): boolean => {
  let returnValue: boolean = false;

  switch (excludeOrInclude) {
    case 'exclude':
      if (input.key && allowedKeys.includes(input.key)) {
        returnValue = false;
      } else {
        returnValue = true;
      }
      break;

    default:
      if (input.key && allowedKeys.includes(input.key)) {
        returnValue = true;
      } else {
        returnValue = false;
      }
      break;
  }

  return returnValue;
};

export const parseMedia = (input: {
  primary_mediafile: string;
  primary_mediafile_location: string;
  primary_thumbnail_location: string;
  primary_transcode: string;
  id: string;
}) => {
  return {
    primaryMediafile: input.primary_mediafile,
    primaryMediafileLocation: input.primary_mediafile_location,
    primaryThumbnailLocation: input.primary_thumbnail_location,
    parentId: input.id,
    primary_transcode: input.primary_transcode,
  };
};

export const MediaFileToMedia = (input: {
  _id: string;
  original_file_location: string;
  thumbnail_file_location: string;
  transcode_filename: string;
  filename: string;
  entities: [string];
  metadata: [MediaFileMetadata];
  mimetype: string;
  is_primary: boolean;
  is_primary_thumbnail: boolean;
}) => {
  const x = {
    primaryMediafile: input.transcode_filename,
    primaryMediafileLocation: input.transcode_filename,
    primaryThumbnailLocation: input.transcode_filename,
    mediafiles: [input],
  };
  return x;
};

export type relationInputOld = Record<string, string>[];

export const FormInputToRelations = (
  form: Maybe<MetadataFormInput> | undefined
): relationInputOld | undefined => {
  let input: relationInputOld | undefined = undefined;
  if (form?.relations) {
    //REFACTOR NEEDED NO OBJECT IN METADATA
    input = form?.relations.map((relation) => {
      let returnObject: any = {};
      if (relation?.metadata) {
        returnObject = {
          key: relation?.linkedEntityId,
          label: relation.label,
          type: relation?.relationType,
          value: relation?.value ? relation?.value : undefined,
        };

        relation.metadata.forEach((value) => {
          if (value && value.key) {
            returnObject[value?.key] = value?.value;
          }
        });

        return returnObject;
      }
    });
  }

  return input;
};

export const FormInputToMetadata = (
  form: Maybe<MetadataFormInput> | undefined
): relationInputOld | undefined => {
  let input: relationInputOld | undefined = undefined;
  if (form?.relations) {
    //REFACTOR NEEDED NO OBJECT IN METADATA
    input = form?.relations.map((relation) => {
      let returnObject: any = {};
      if (relation?.metadata) {
        returnObject = {
          key: relation?.linkedEntityId,
          label: relation.label,
          type: relation?.relationType,
        };

        relation.metadata.forEach((value) => {
          if (value && value.key) {
            returnObject[value?.key] = value?.value;
          }
        });

        return returnObject;
      }
    });
  }

  return input;
};

type ApiInputToPatchDeleteRelationsMetadata = {
  relationsToDelete: InputRelationsDelete | 'nothing-to-delete';
  relationsToUpdate: relationInput[] | 'nothing-to-update';
  metadataToUpdate: MetadataValuesInput[] | 'nothing-to-update';
};
export const formInputToPatchDeleteRelationsMetadata = (
  relationsInput: RelationValuesInput[],
  metadataInput: MetadataValuesInput[]
): ApiInputToPatchDeleteRelationsMetadata => {
  const output: ApiInputToPatchDeleteRelationsMetadata = {
    relationsToDelete: 'nothing-to-delete',
    relationsToUpdate: 'nothing-to-update',
    metadataToUpdate:
      metadataInput.length > 0 ? metadataInput : 'nothing-to-update',
  };

  relationsInput.forEach((relation) => {
    if (relation.toBeDeleted) {
      if (output.relationsToDelete === 'nothing-to-delete') {
        output.relationsToDelete = [];
      }

      output.relationsToDelete.push({
        key: relation.id,
        type: relation.relationType,
      });
    }

    if (!relation.toBeDeleted) {
      let relationUpdated: relationInput = {
        label: relation.label,
        key: relation.id,
        type: relation.relationType,
      };
      if (relation.metaData !== null) {
        relation.metaData.forEach((metadata) => {
          relationUpdated[metadata.key] = metadata.value;
        });
      }

      if (output.relationsToUpdate === 'nothing-to-update') {
        output.relationsToUpdate = [];
      }

      output.relationsToUpdate.push(relationUpdated);
    }
  });

  return output;
};

export const parseIdToGetMoreData = (id: string): string => {
  if (id.includes('entities/') || id.includes('mediafiles/')) {
    return id;
  }
  return `entities/${id}`;
};

export const removePrefixFromId = (id: string) => {
  const prefixes = Object.values(Collection).map(
    (col: Collection) => col + '/'
  );
  prefixes.forEach((prefix: string) => {
    if (id.includes(prefix)) {
      id = id.replace(prefix, '');
      return id;
    }
  });
  return id;
};
