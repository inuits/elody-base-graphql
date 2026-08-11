import { fetchRelationEntity, extractValueFromEntity } from './intialValueResolver';
import { DataSources } from '../types';

export const resolveRelationLabelsForIds = async (
  dataSources: DataSources,
  ids: string[],
  type: string,
  metadataKeyAsLabel?: string,
  rootKeyAsLabel?: string
): Promise<{ key: string; value: string }[]> => {
  return Promise.all(
    ids.map(async (id) => {
      const relation = { key: id };
      const entity = await fetchRelationEntity(
        dataSources,
        relation,
        type,
        metadataKeyAsLabel ?? '',
        rootKeyAsLabel ?? '',
        ''
      );
      const value = entity
        ? extractValueFromEntity(entity, relation, metadataKeyAsLabel ?? '', rootKeyAsLabel ?? '')
        : id;
      return { key: id, value };
    })
  );
};
