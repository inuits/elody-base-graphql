import {
  Collection,
  Metadata,
  MetadataRelation,
  KeyAndValue,
  RelationFieldInput,
  MetadataAndRelation,
  Entitytyping,
} from '../../../generated-types/type-defs';
import { capitalizeString } from '../helpers/helpers';

const PROTECTED_METADATA_RELATION_KEY: string[] = [
  'key',
  'value',
  'type',
  'label',
];

export const setId = (entityRaw: any) => {
  try {
    if (!entityRaw.id)
      entityRaw.id = entityRaw.object_id
        ? entityRaw.object_id
        : entityRaw._id
        ? entityRaw._id
        : entityRaw.identifiers[0];
    entityRaw.uuid = entityRaw._id;
    return entityRaw;
  } catch (e) {
    console.log('No id found for entity');
  }
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
  if (isMetaDataRelation(input) === 'MetadataRelation') {
    return parseMetaDataRelation(input);
  } else {
    return parseMetaData(input);
  }
};

export const parseMetaData = (input: any): Metadata => {
  return {
    key: input.key as string,
    value: input.value !== undefined ? input.value : ('' as string),
    lang: input.lang as string,
    label: input.label ? input.label : (input.key as string),
    immutable: input.immutable ? input.immutable : (false as boolean),
  };
};

export const parseRelations = (
  relations: RelationFieldInput[]
): { [key: string]: RelationFieldInput[] } => {
  const groupedRelations: { [key: string]: RelationFieldInput[] } = {};
  const relationTypes: string[] = [];

  relations?.forEach((relation: RelationFieldInput) => {
    if (!relationTypes.includes(relation.type))
      relationTypes.push(relation.type);
  });

  relationTypes?.forEach((relationType: string) => {
    groupedRelations[relationType] = relations.filter(
      (relation: RelationFieldInput) => relation.type === relationType
    );
  });

  return groupedRelations;
};

export const parseMetaDataRelation = (input: any): MetadataRelation => {
  return {
    key: input.key as string,
    value: input.value !== undefined ? input.value : ('' as string),
    label: input.label ? input.label : (input.key as string),
    type: input.type as string,
    metadataOnRelation: getMetaDataOnRelation(input),
  };
};

//Get all extra metadation on a relations
export const getMetaDataOnRelation = (
  input: Record<string, string | Record<string, string>>
): KeyAndValue[] => {
  let metadataOnRelation: KeyAndValue[] = [];
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

export const parseRelationTypesForEntityType = (entityType: Entitytyping) => {
  const normalizedEntityType: string = entityType as string;
  const relationType: string = `has${capitalizeString(normalizedEntityType)}`;
  const fromRelationType: string = `is${capitalizeString(
    normalizedEntityType
  )}For`;
  return { relationType, fromRelationType };
};
