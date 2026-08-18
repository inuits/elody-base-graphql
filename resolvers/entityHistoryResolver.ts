import { DataSources } from '../types';
import { setId } from '../parsers/entity';

export const resolveEntityHistoryVersions = async (
  dataSources: DataSources,
  id: string,
  type: string,
  limit?: number,
  skip?: number
) => {
  return dataSources.CollectionAPI.getEntityHistoryVersions(id, type, limit, skip);
};

export const resolveEntityHistoryVersionDetail = async (
  dataSources: DataSources,
  id: string,
  type: string,
  versionId: string
) => {
  const document = await dataSources.CollectionAPI.getEntityHistoryVersionDetail(
    id,
    type,
    versionId
  );
  return document ? setId(document) : document;
};
