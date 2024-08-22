import {
  resolveMetadata,
  resolveMetadataItemOfPreferredLanguage,
} from './entityResolver';
import { DataSources } from '../types';
import { Metadata } from '../../../generated-types/type-defs';

export const resolveIntialValueMetadata = async (
  dataSources: DataSources,
  parent: any,
  key: string
): Promise<string> => {
  const preferredLanguage = dataSources.CollectionAPI.preferredLanguage;
  const metadata = await resolveMetadata(parent, [key], undefined);
  if (metadata.length > 1) {
    const hasLanguage = metadata.some((item: Metadata) => item.lang);
    const metadataValues = hasLanguage
      ? resolveMetadataItemOfPreferredLanguage(metadata, preferredLanguage)
          ?.value
      : metadata.map((item: Metadata) => item.value).join(', ');
    return metadataValues;
  }
  return metadata[0]?.value ?? '';
};

export const resolveIntialValueRoot = (parent: any, key: string): string => {
  const keyParts = key.split('.');
  let value = parent;
  for (const part of keyParts) value = value?.[part];
  return value ?? '';
};

export const resolveIntialValueRelations = async (
  dataSources: DataSources,
  parent: any,
  key: string,
  metadataKeyAsLabel: string,
  rootKeyAsLabel: string,
  containsRelationProperty: string,
  relationEntityType: string
): Promise<string> => {
  try {
    let relation: any;
    const relations = parent?.relations.filter(
      (relation: any) => relation.type === key
    );
    if (containsRelationProperty)
      relations.forEach((rel: any) => {
        if (rel[containsRelationProperty]) relation = rel;
      });
    else relation = relations?.[0];

    if (relation) {
      let type;
      if (relation.type === 'hasMediafile') {
        type = await dataSources.CollectionAPI.getMediaFile(relation.key);
      } else {
        if (relationEntityType)
          type = await dataSources.CollectionAPI.getEntity(
            relation.key,
            relationEntityType
          );
        else
          type = await dataSources.CollectionAPI.getEntity(
            relation.key,
            '',
            'entities'
          );
      }

      if (rootKeyAsLabel) return type[rootKeyAsLabel];
      return (
        type?.metadata?.find(
          (metadata: any) => metadata.key === metadataKeyAsLabel
        )?.value || relation.key
      );
    }
  } catch {
    return parent?.[key] ?? '';
  }
  return '';
};

export const resolveIntialValueRelationMetadata = (
  parent: any,
  key: string,
  uuid: string,
  relationKey: string
): string => {
  if (relationKey === 'hasTenant' && key === 'roles') {
    if (uuid && !uuid.startsWith('tenant:')) uuid = `tenant:${uuid}`;
    return parent?.relations.find(
      (relation: any) =>
        relation.type === relationKey &&
        (relation.key === uuid || relation.key === 'tenant:super')
    )[key];
  } else {
    return parent?.relations
      .find(
        (relation: any) =>
          relation.type === relationKey && relation.key === uuid
      )
      .metadata.find((metadata: any) => metadata.key === key).value;
  }
};

export const resolveIntialValueTechnicalMetadata = (
  parent: any,
  key: string
): string => {
  try {
    return (
      parent.technical_metadata?.find(
        (metadataItem: any) => metadataItem.key === key
      ).value || ''
    );
  } catch {
    return '';
  }
};
