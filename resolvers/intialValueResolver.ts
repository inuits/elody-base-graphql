import {resolveLocationData, resolveMetadata, resolveMetadataItemOfPreferredLanguage,} from './entityResolver';
import {DataSources, type FormattersConfig} from '../types';
import {
  AdvancedFilterInput,
  AdvancedFilterTypes,
  Entitytyping,
  Metadata,
  RelationField,
  ParentRelationsConfigInput,
  EntitiesResults,
  Entity,
} from '../../../generated-types/type-defs';
import {formatterFactory, ResolverFormatters} from './formatters';
import {GraphQLError} from "graphql";
import {CollectionAPIDerivative, CollectionAPIEntity} from "../types/collectionAPITypes";
import {baseTypePillLabelMapping} from '../sources/typePillLabelMapping';

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

export const resolveIntialValueRepeatableMetadata = async (
  dataSources: DataSources,
  parent: any,
  key: string,
  formatter: string | null,
  repeatableMetadataKey: string | null
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
  let result = []
  if (!repeatableMetadataKey){
    result = metadata[0]?.value;
  } else {
    for (const item of metadata[0]?.value) result.push(item[repeatableMetadataKey]);
  }
  return formatterFactory(ResolverFormatters.Metadata)({label: result, formatter });
};

export const resolveIntialValueRoot = async (dataSources: DataSources, parent: any, key: string, formatter: string | null, formatterSettings: any): Promise<string> => {
  try {
    const value = extractValueFromKeyParts(parent, key);
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

  const entities = entityResults
    .filter(({ entity }) => entity !== null)
    .map(({ entity, relation }) => entity);

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
  if (formatter.startsWith('link'))
    return formatResults(entities, formatter, formatterSettings, isMultiple);
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

export const resolveIntialValueParentRoot = async (
    dataSources: DataSources,
    parent: any,
    key: string,
    parentRelations: ParentRelationsConfigInput[],
): Promise<string> => {
  const finalParent = await loopOverParentRelations(dataSources, parent, parentRelations);
  if (!finalParent) return '';
  return extractValueFromKeyParts(finalParent, key);
};

export const resolveIntialValueParentMetadata = async (
    dataSources: DataSources,
    parent: any,
    key: string,
    parentRelations: ParentRelationsConfigInput[],
): Promise<string> => {
  const finalParent = await loopOverParentRelations(dataSources, parent, parentRelations);
  if (!finalParent) return '';

  const preferredLanguage = dataSources.CollectionAPI.preferredLanguage;
  const metadata = await resolveMetadata(finalParent, [key], undefined);
  if (metadata.length > 1) {
    const hasLanguage = metadata.some((item: Metadata) => item.lang);
    const metadataValues = hasLanguage
        ? resolveMetadataItemOfPreferredLanguage(metadata, preferredLanguage)
            ?.value
        : metadata.map((item: Metadata) => item.value).join(', ');
    return metadataValues;
  }
  return metadata[0]?.value;
};

export const resolveIntialValueParentRelations = async (
    dataSources: DataSources,
    parent: any,
    key: string,
    parentRelations: ParentRelationsConfigInput[],
): Promise<string[]> => {
  const finalParent = await loopOverParentRelations(dataSources, parent, parentRelations);
  if (!finalParent) return [];

  const relations = finalParent?.relations?.filter(
      (relation: any) => relation.type === key
  ) || [];
  if (!relations || relations.length < 1) return [];
  return relations.map((relation: RelationField) => relation.key);
};

const loopOverParentRelations = async (
    dataSources: DataSources,
    parent: any,
    parentRelations: ParentRelationsConfigInput[],
): Promise<any> => {
  let currentParent = parent;
  for (const parentRelation of parentRelations) {
    if (!currentParent) continue;
    if (parentRelation.relationType) {
      let id = getIdThroughCurrentRelations(currentParent, parentRelation.relationType);
      if (!id) return undefined;
      currentParent = await fetchEntityById(dataSources, id);
    } else if (parentRelation.key && parentRelation.entityType) {
      currentParent = await getParentTroughFilter(dataSources, currentParent, parentRelation);
    }
  }
  return currentParent;
};

const getIdThroughCurrentRelations = (currentParent: any, relationType: string): string | undefined => {
  const relations = currentParent?.relations?.filter(
    (relation: any) => relation.type === relationType
  ) || [];
  return relations[0]?.key || undefined;
};

const fetchEntityById = async (
  dataSources: DataSources,
  id: string,
): Promise<Entity | undefined> => {  return await dataSources.CollectionAPI.getEntityById(id) };

const getParentTroughFilter = async (
  dataSources: DataSources,
  currentParent: any,
  parentRelation: ParentRelationsConfigInput
): Promise<any> => {
  const filters: AdvancedFilterInput[] = [
    {
      type: AdvancedFilterTypes.Selection,
      key: "type",
      value: [parentRelation.entityType],
      match_exact: true,
    },
    {
      type: AdvancedFilterTypes.Text,
      key: parentRelation.key,
      value: [currentParent.id],
      match_exact: true,
    },
  ]
  const entityResult = await fetchEntityByFilter(dataSources, filters);
  if (entityResult?.results && entityResult?.results?.length > 0)
    return entityResult?.results[0]
  return undefined;
};

const fetchEntityByFilter = async (
  dataSources: DataSources,
  filters: AdvancedFilterInput[],
): Promise<EntitiesResults> => {
  return await dataSources.CollectionAPI.GetAdvancedEntities(
    Entitytyping.BaseEntity,
    1,
    1,
    filters,
    {
      value: "",
      isAsc: undefined,
      key: "title",
      order_by: "",
    },
  );
};

const extractValueFromKeyParts = (parent: any, key: string) => {
  const keyParts = key.match(/(?:`[^`]+`|[^.])+/g)?.map(part => part.replace(/`/g, ''));
  let value = parent;
  for (const part of keyParts || []) value = value?.[part];
  return value;
}
