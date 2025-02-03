import {
  resolveMetadata,
  resolveMetadataItemOfPreferredLanguage,
} from './entityResolver';
import { DataSources, type FormattersConfig } from '../types';
import { Metadata } from '../../../generated-types/type-defs';
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

export const resolveIntialValueRoot = async (dataSources: DataSources, parent: any, key: string, formatter: string | null, formatterSettings: any): Promise<string> => {
  const keyParts = key.match(/(?:`[^`]+`|[^.])+/g)?.map(part => part.replace(/`/g, ''));
  let value = parent;
  for (const part of keyParts || []) value = value?.[part];

  let entity;
  if (String(formatter).startsWith("link|")) {
    entity = await dataSources.CollectionAPI.getEntity(
      value,
      '',
      'entities',
      true
    );
  }

  return formatterFactory(ResolverFormatters.Root)({ value: value ?? '', formatter, formatterSettings, entity })
};

export const resolveIntialValueRelations = async (
  dataSources: DataSources,
  parent: any,
  key: string,
  metadataKeyAsLabel: string,
  rootKeyAsLabel: string,
  containsRelationPropertyKey: string,
  containsRelationPropertyValue: string,
  relationEntityType: string,
  formatter: string = '',
  formatterSettings?: FormattersConfig,
): Promise<string | any> => {
  try {
    let relation: any;
    const relations = parent?.relations.filter(
      (relation: any) => relation.type === key
    );
    if (containsRelationPropertyKey)
      relations.forEach((rel: any) => {
        if (String(rel[containsRelationPropertyKey]) == containsRelationPropertyValue) {
          relation = rel;
        }
      });
    else relation = relations?.[0];

    if (relation) {
      let type;
      if (relation.type === 'hasMediafile') {
        type = await dataSources.CollectionAPI.getMediaFile(relation.key.replace("mediafiles/", ""));
      } else {
        if (relationEntityType) {
          type = await dataSources.CollectionAPI.getEntity(
            relation.key,
            relationEntityType,
            undefined,
            true
          );
        }
        else if (metadataKeyAsLabel || String(formatter).startsWith("link|")) {
          type = await dataSources.CollectionAPI.getEntity(
            relation.key,
            '',
            'entities',
            true
          );
        }
      }

      if (rootKeyAsLabel) return type[rootKeyAsLabel];

      const result = type?.metadata?.find(
        (metadata: any) => {
          const keys =  String(metadataKeyAsLabel).split('|');
          return keys.includes(metadata.key)
        }
      )?.value || relation.key

      if (!formatter) return result;
      if (formatter === 'pill')
        return formatterFactory(ResolverFormatters.Metadata)({label: result ?? '', formatter });
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
): string | string[] | {label: string, formatter: string } => {
  try {
    let label: string | string[] = '';
    if (relationKey === 'hasTenant' && key === 'roles') {
      const roles: string[] = [];
      if (!uuid || uuid === 'undefined') {
        label = parent?.relations
          .filter((relation: any) => relation.type === relationKey)
          .forEach((relation: any) => {
            const zone = relation?.['zone'].split('BE-')?.[1];
            for (const role of relation[key]) {
              if (zone) roles.push(`${zone}:${role}`);
              else roles.push(role);
            }
          });
      } else {
        if (!uuid.startsWith('tenant:')) uuid = `tenant:${uuid}`;
        const tenantRoles = parent?.relations.find(
          (relation: any) =>
            relation.type === relationKey &&
            (relation.key === uuid || relation.key === 'tenant:super')
        )[key];
        roles.push(...tenantRoles)
      }
      label = roles;
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

export const resolveIntialValueRelationRootdata = (
  parent: any,
  key: string,
  uuid: string,
  relationKey: string,
  formatter: string
): string | string[] | {label: string, formatter: string } => {
  try {
    let label: string | string[] = '';
    label = parent?.relations
      .find(
        (relation: any) =>
          relation.type === relationKey && relation.key === uuid
      )[key];
    console.log(key, label, formatter)
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

export const resolveIntialValueMetadataOrRelation = async (
  dataSources: DataSources,
  parent: any,
  key: string,
  relationKey: string,
  formatter: string = '',
  formatterSettings?: FormattersConfig,
): Promise<string | any> => {
  try {
    const [metadataKey, relationKeyAsLabel] = key.split("|");
    const metadata  = await resolveIntialValueMetadata(dataSources, parent, metadataKey, undefined, '');
    if (metadata) return metadata as string;
    return await resolveIntialValueRelations(
      dataSources,
      parent,
      relationKey,
      relationKeyAsLabel as string,
      '',
      '',
      '',
      '',
      formatter as string,
      formatterSettings
    );
  } catch {
    return '';
  }
};

