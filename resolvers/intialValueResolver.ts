import {
  resolveLocationData,
  resolveMetadata,
  resolveMetadataItemOfPreferredLanguage,
} from './entityResolver';
import { DataSources, type FormattersConfig } from '../types';
import { Metadata  } from '../../../generated-types/type-defs';
import { formatterFactory, ResolverFormatters } from './formatters';
import { GraphQLError } from "graphql";
import { CollectionAPIDerivative, CollectionAPIEntity } from "../types/collectionAPITypes";
import { baseTypePillLabelMapping } from '../sources/typePillLabelMapping';

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

  return formatterFactory(ResolverFormatters.Metadata)({label: metadata[0]?.value, formatter });
};

export const resolveIntialValueRoot = async (dataSources: DataSources, parent: any, key: string, formatter: string | null, formatterSettings: any): Promise<string> => {
  try {
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
  } catch (e) {
    return ''
  }
};

const filterRelationsByProperty = (
  relations: any[],
  propertyKey: string,
  propertyValue: string
): any[] => {
  if (!propertyKey) return relations;
  
  return relations.filter((relation) => 
    String(relation[propertyKey]) === propertyValue
  );
};

const fetchRelationEntity = async (
  dataSources: DataSources,
  relation: any,
  relationEntityType: string,
  metadataKeyAsLabel: string,
  rootKeyAsLabel: string,
  formatter: string
): Promise<any> => {
  if (!relation?.key) return null;

  if (relation.type === 'hasMediafile') {
    return dataSources.CollectionAPI.getMediaFile(
      relation.key.replace("mediafiles/", "")
    );
  }

  const shouldFetchEntity = relationEntityType || 
    metadataKeyAsLabel || rootKeyAsLabel || String(formatter).startsWith("link|");

  if (!shouldFetchEntity) return null;

  const entityType = relationEntityType || '';
  const collection = relationEntityType ? undefined : 'entities';

  return dataSources.CollectionAPI.getEntity(
    relation.key,
    entityType,
    collection,
    true
  );
};

const extractValueFromEntity = (
  entity: any,
  relation: any,
  metadataKeyAsLabel: string,
  rootKeyAsLabel: string
): string => {
  if (rootKeyAsLabel) {
    return entity?.[rootKeyAsLabel] || '';
  }

  if (metadataKeyAsLabel && entity?.metadata) {
    const metadataKeys = String(metadataKeyAsLabel).split('|');
    const metadataItem = entity.metadata.find((metadata: any) => 
      metadataKeys.includes(metadata.key)
    );
    return metadataItem?.value || relation.key;
  }

  return relation.key;
};

const formatResults = (
  results: any[],
  formatter: string,
  formatterSettings?: FormattersConfig,
  isMultiple: boolean = false
): any => {
  if (isMultiple) {
    return results.join(', ');
  }

  const singleResult = results[0];
  
  if (!formatter) {
    return singleResult;
  }

  if (formatter === 'pill') {
    return formatterFactory(ResolverFormatters.Metadata)({
      label: singleResult ?? '', 
      formatter 
    });
  }

  const relationsFormatters = formatterFactory(ResolverFormatters.Relations);
  return {
    ...relationsFormatters(formatter, formatterSettings)({ entity: singleResult }),
    formatter
  };
};

const processRelations = async (
  dataSources: DataSources,
  relations: any[],
  metadataKeyAsLabel: string,
  rootKeyAsLabel: string,
  relationEntityType: string,
  formatter: string,
  formatterSettings?: FormattersConfig
): Promise<any> => {
  if (relations.length === 0) {
    return '';
  }

  const entityPromises = relations.map(relation =>
    fetchRelationEntity(
      dataSources,
      relation,
      relationEntityType,
      metadataKeyAsLabel,
      rootKeyAsLabel,
      formatter
    ).then(entity => ({ relation, entity }))
  );

  const entityResults = await Promise.all(entityPromises);

  const results = entityResults
    .filter(({ entity }) => entity !== null)
    .map(({ entity, relation }) =>
      extractValueFromEntity(
        entity,
        relation,
        metadataKeyAsLabel,
        rootKeyAsLabel
      )
    );
  
  if (results.length === 0) {
    return '';
  }

  const isMultiple = relations.length > 1;
  return formatResults(results, formatter, formatterSettings, isMultiple);
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
    const relations = parent?.relations?.filter(
      (relation: any) => relation.type === key
    ) || [];

    if (relations.length === 0) {
      return [];
    }

    const filteredRelations = filterRelationsByProperty(
      relations,
      containsRelationPropertyKey,
      containsRelationPropertyValue
    );

    if (filteredRelations.length === 0) {
      return [];
    }

    return processRelations(
      dataSources,
      filteredRelations,
      metadataKeyAsLabel,
      rootKeyAsLabel,
      relationEntityType,
      formatter,
      formatterSettings
    );

  } catch (error) {
    console.error('Error resolving relations:', error);
    return parent?.[key] ?? '';
  }
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

export const resolveIntialValueDerivatives = async (parent: CollectionAPIEntity, key: string, technicalOrigin: string, dataSources: DataSources): Promise<string> => {
  if (parent.type !== 'mediafile') throw new GraphQLError('The derivatives source can only be used on mediafiles')
  const derivativesResult = await dataSources.CollectionAPI.getDerivatives(parent._id)
  const derivatives: CollectionAPIDerivative[] = derivativesResult.results
  const derivativeFromTechnicalOrigin: {[key: string]: any} | undefined = derivatives.find((derivative: CollectionAPIDerivative) => derivative.technical_origin === technicalOrigin)
  if (!derivativeFromTechnicalOrigin) return ''
  return derivativeFromTechnicalOrigin[key] as string
}

export const resolveIntialValueTypePillLabel = (
    parent: any,
    key: string,
    index: number = 0,
    formatter: string | null
): string => {
    let typeMapping: string = '';
    try {
        const type = parent[key];
        typeMapping = baseTypePillLabelMapping[type][index];
    } catch {
        return '';
    }
    return formatterFactory(ResolverFormatters.Metadata)({label: typeMapping, formatter });
};

export const resolveIntialValueLocation = async (
    dataSources: DataSources,
    parent: any,
    key: string,
    keyOnMetadata: string | undefined | null,
    formatter: string | null
): Promise<string | { label: string, formatter: string }> => {
  return await resolveLocationData(parent, key);
};
