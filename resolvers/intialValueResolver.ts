import {
  resolveMetadata,
  resolveMetadataItemOfPreferredLanguage,
} from './entityResolver';
import { DataSources } from '../types';
import { BaseEntity, Metadata, CustomFormatterTypes } from '../../../generated-types/type-defs';
import { formatterFactory, ResolverFormatters } from './formatters';

export const resolveIntialValueMetadata = async (
  dataSources: DataSources,
  parent: any,
  key: string,
  keyOnMetadata: string | undefined | null,
  formatter: string | null
): Promise<string | { label: string, formatter: string }> => {
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
  if (keyOnMetadata)
    return metadata[0]?.[keyOnMetadata] ?? '';

  return formatterFactory(ResolverFormatters.Metadata)({label: metadata[0]?.value ?? '', formatter });
};

export const resolveIntialValueRoot = (parent: any, key: string): string => {
  const keyParts = key.match(/(?:`[^`]+`|[^.])+/g)?.map(part => part.replace(/`/g, ''));
  let value = parent;
  for (const part of keyParts || []) value = value?.[part];
  return value ?? '';
};

export const resolveIntialValueRelations = async (
  dataSources: DataSources,
  parent: any,
  key: string,
  metadataKeyAsLabel: string,
  rootKeyAsLabel: string,
  containsRelationProperty: string,
  relationEntityType: string,
  formatter: string = '',
  formatterSettings?: any
): Promise<string | any> => {
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
      const result = type?.metadata?.find(
        (metadata: any) => metadata.key === metadataKeyAsLabel
      )?.value || relation.key

      if (!formatter) return result;
      const relationsFormatters = formatterFactory(ResolverFormatters.Relations);
      return { ...relationsFormatters(formatter, formatterSettings)({ entity: type }), formatter };
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
  relationKey: string,
  formatter: string
): string | {label: string, formatter: string } => {
  try {
    let label = '';
    if (relationKey === 'hasTenant' && key === 'roles') {
      if (!uuid || uuid === 'undefined')
        label = parent?.relations
          .filter((relation: any) => relation.type === relationKey)
          .flatMap((relation: any) => {
            const zone = relation?.['zone'].split('BE-')?.[1];
            if (zone) return `${zone}:${relation[key]}`;
            else return relation[key];
          });

      if (uuid && !uuid.startsWith('tenant:')) uuid = `tenant:${uuid}`;
      label = parent?.relations.find(
        (relation: any) =>
          relation.type === relationKey &&
          (relation.key === uuid || relation.key === 'tenant:super')
      )[key];
    } else {
      label = parent?.relations
        .find(
          (relation: any) =>
            relation.type === relationKey && relation.key === uuid
        )
        .metadata.find((metadata: any) => metadata.key === key).value;
    }

    return formatterFactory(ResolverFormatters.RelationMetadata)({ label, formatter });
  } catch (e) {
    return '';
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

