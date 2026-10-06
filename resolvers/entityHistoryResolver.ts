import { DataSources } from '../types';
import { AdvancedFilterInput } from '../generated-types/type-defs';
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

const firstValue = (value: unknown): string | undefined =>
  (Array.isArray(value) ? value[0] : value) ?? undefined;

const historyTargetFromFilters = (
  advancedFilterInputs: AdvancedFilterInput[]
) => {
  const typeFilter = advancedFilterInputs.find(
    (filter) => filter.type === 'type'
  );
  const idFilter = advancedFilterInputs.find(
    (filter) =>
      filter.type === 'selection' &&
      (Array.isArray(filter.key) ? filter.key : [filter.key]).includes('id')
  );
  return {
    id: firstValue(idFilter?.value),
    type: firstValue(typeFilter?.value),
  };
};

export const resolveEntityHistoryVersionList = async (
  dataSources: DataSources,
  advancedFilterInputs: AdvancedFilterInput[],
  limit: number = 20,
  skip: number = 1
) => {
  const { id, type } = historyTargetFromFilters(advancedFilterInputs);
  if (!id || !type) return { results: [], count: 0, limit };

  const versions = await resolveEntityHistoryVersions(dataSources, id, type);
  const rows = versions
    .map((version, index) => {
      const rowId = `${id}-${version.versionId}`;
      return {
        _id: rowId,
        id: rowId,
        type: 'history',
        metadata: [
          { key: 'version', value: index + 1 },
          { key: 'edited_by', value: version.editedBy },
          { key: 'edited_at', value: version.timestamp },
        ],
      };
    })
    .reverse();

  const start = (Math.max(skip, 1) - 1) * limit;
  return {
    results: rows.slice(start, start + limit),
    count: rows.length,
    limit,
  };
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
