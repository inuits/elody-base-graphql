import { extractValueFromEntity } from './intialValueResolver';
import { DataSources } from '../types';

const TITLE_KEYS = [
  'title',
  'name',
  'computed_title',
  'email',
  'prefLabel',
  'code',
  'wording',
  'originalTitle',
  'preferred_title',
  'original_headtitle',
  'description',
];

const titleOf = (entity: any): string | undefined => {
  const metadata: { key: string; value: unknown }[] = entity?.metadata ?? [];
  for (const key of TITLE_KEYS) {
    const value = metadata.find((item) => item.key === key)?.value;
    if (value !== undefined && value !== null && value !== '')
      return String(value);
  }
  return undefined;
};

export type RelationLabelsRequest = {
  ids: string[];
  types: string[];
  historyKeys?: string[] | null;
  metadataKeyAsLabel?: string | null;
  rootKeyAsLabel?: string | null;
};

export const resolveRelationLabelsForIds = async (
  dataSources: DataSources,
  {
    ids,
    types,
    historyKeys,
    metadataKeyAsLabel,
    rootKeyAsLabel,
  }: RelationLabelsRequest
): Promise<{ key: string; value: string }[]> => {
  if (ids.length === 0) return [];

  const [liveEntities, historicalEntities] = await Promise.all([
    dataSources.CollectionAPI.getEntitiesByIds(types, ids),
    historyKeys?.length
      ? dataSources.CollectionAPI.getHistoryEntitiesByIds(types, historyKeys)
      : Promise.resolve([]),
  ]);

  const byId = (entities: any[]) =>
    new Map(entities.map((entity) => [entity.id, entity]));
  const live = byId(liveEntities ?? []);
  const historical = byId(historicalEntities ?? []);

  return ids.map((id) => {
    const entity = historical.get(id) ?? live.get(id);
    if (!entity) return { key: id, value: id };
    const value =
      metadataKeyAsLabel || rootKeyAsLabel
        ? extractValueFromEntity(
            entity,
            { key: id },
            metadataKeyAsLabel ?? '',
            rootKeyAsLabel ?? ''
          )
        : titleOf(entity);
    return { key: id, value: value || id };
  });
};
