import { DataSources } from '../types';
import { setId } from '../parsers/entity';
import { HistoryServiceAPI } from '../sources/historyService';

const getHistoryServiceAPI = (
  dataSources: DataSources
): HistoryServiceAPI | undefined =>
  dataSources.HistoryServiceAPI as HistoryServiceAPI | undefined;

const toVersion = (entry: any) => {
  const timestamp = entry.audit?.updated?.at ?? entry.audit?.created?.at;
  return {
    versionId: timestamp,
    documentVersion: entry.document_version ?? null,
    timestamp,
    editedBy: entry.audit?.updated?.by ?? entry.audit?.created?.by ?? null,
  };
};

const toLiveRelation = ({ live_key, ...relation }: any) => ({
  ...relation,
  key: live_key ?? relation.key,
  historyKey: relation.key,
});

export const resolveEntityHistoryVersions = async (
  dataSources: DataSources,
  id: string,
  type: string,
  limit?: number,
  skip?: number
) => {
  const historyServiceAPI = getHistoryServiceAPI(dataSources);
  if (!historyServiceAPI) return [];

  const entries = await historyServiceAPI.getAllHistoryEntries(id, type);
  const versions = (entries ?? [])
    .map(toVersion)
    .filter((version) => !!version.timestamp)
    .sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  const start = skip ?? 0;
  return versions.slice(start, limit ? start + limit : undefined);
};

export const resolveEntityHistoryVersionDetail = async (
  dataSources: DataSources,
  id: string,
  type: string,
  versionId: string
) => {
  const historyServiceAPI = getHistoryServiceAPI(dataSources);
  if (!historyServiceAPI) return null;

  const document = await historyServiceAPI.getResolvedHistoryEntry(
    id,
    type,
    versionId
  );
  if (!document) return null;

  return setId({
    ...document,
    relations: (document.relations ?? []).map(toLiveRelation),
  });
};
