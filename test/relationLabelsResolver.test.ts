import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveRelationLabelsForIds } from '../resolvers/relationLabelsResolver';
import { DataSources } from '../types';
import { KeyAsLabelOrigin } from '../generated-types/type-defs';

const mockDataSource = {
  CollectionAPI: {
    getEntitiesByIds: vi.fn(),
    getHistoryEntitiesByIds: vi.fn(),
  },
};

const dataSources = mockDataSource as unknown as DataSources;

const entity = (
  id: string,
  metadata: Record<string, string>,
  type = 'person'
) => ({
  id,
  type,
  metadata: Object.entries(metadata).map(([key, value]) => ({ key, value })),
});

describe('resolveRelationLabelsForIds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValue([]);
    mockDataSource.CollectionAPI.getHistoryEntitiesByIds.mockResolvedValue([]);
  });

  it('fetches every related entity in one call and labels each id in the requested order', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      entity('lang-2', { name: 'Greek' }),
      entity('lang-1', { name: 'Aramaic' }),
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['lang-1', 'lang-2'],
      types: ['language'],
      keyAsLabel: { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
    });

    expect(result).toStrictEqual([
      { key: 'lang-1', value: 'Aramaic' },
      { key: 'lang-2', value: 'Greek' },
    ]);
    expect(mockDataSource.CollectionAPI.getEntitiesByIds).toHaveBeenCalledTimes(1);
    expect(mockDataSource.CollectionAPI.getEntitiesByIds).toHaveBeenCalledWith(
      ['language'],
      ['lang-1', 'lang-2']
    );
  });

  it('titles an entity like the frontend does when no label key is requested', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      entity('PERS-1', { name: 'Lewis, C.S.' }, 'person'),
      entity('W-1', { title: 'Narnia', name: 'ignored' }, 'work_word'),
      entity('CV-1', { code: 'A12' }, 'code_wording'),
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1', 'W-1', 'CV-1'],
      types: ['person', 'work_word', 'code_wording'],
    });

    expect(result).toStrictEqual([
      { key: 'PERS-1', value: 'Lewis, C.S.' },
      { key: 'W-1', value: 'Narnia' },
      { key: 'CV-1', value: 'A12' },
    ]);
  });

  it('prefers an explicitly requested metadata key over the generic title', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      entity('PERS-1', { name: 'Lewis', alias: 'Jack' }, 'person'),
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1'],
      types: ['person'],
      keyAsLabel: { origin: KeyAsLabelOrigin.Metadata, key: 'alias' },
    });

    expect(result).toStrictEqual([{ key: 'PERS-1', value: 'Jack' }]);
  });

  it('takes the first present key of a pipe-separated metadata label', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      entity('PERS-1', { name: 'Lewis', alias: 'Jack' }, 'person'),
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1'],
      types: ['person'],
      keyAsLabel: { origin: KeyAsLabelOrigin.Metadata, key: 'nickname|alias' },
    });

    expect(result).toStrictEqual([{ key: 'PERS-1', value: 'Jack' }]);
  });

  it('labels an entity by a root key when the label origin is root', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      { ...entity('PERS-1', { name: 'Lewis' }, 'person'), filename: 'lewis.jpg' },
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1'],
      types: ['person'],
      keyAsLabel: { origin: KeyAsLabelOrigin.Root, key: 'filename' },
    });

    expect(result).toStrictEqual([{ key: 'PERS-1', value: 'lewis.jpg' }]);
  });

  it('names an entity as it was in a history version when its history key is given', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      entity('PERS-1', { name: 'New name' }),
      entity('PERS-2', { name: 'Unchanged' }),
    ]);
    mockDataSource.CollectionAPI.getHistoryEntitiesByIds.mockResolvedValueOnce([
      entity('PERS-1', { name: 'Old name' }),
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1', 'PERS-2'],
      types: ['person', 'corporation'],
      historyKeys: ['hist-pers-1'],
    });

    expect(result).toStrictEqual([
      { key: 'PERS-1', value: 'Old name' },
      { key: 'PERS-2', value: 'Unchanged' },
    ]);
    expect(
      mockDataSource.CollectionAPI.getHistoryEntitiesByIds
    ).toHaveBeenCalledWith(['person', 'corporation'], ['hist-pers-1']);
  });

  it('falls back to the live name when the history version cannot be found', async () => {
    mockDataSource.CollectionAPI.getEntitiesByIds.mockResolvedValueOnce([
      entity('PERS-1', { name: 'New name' }),
    ]);

    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1'],
      types: ['person'],
      historyKeys: ['hist-pers-1'],
    });

    expect(result).toStrictEqual([{ key: 'PERS-1', value: 'New name' }]);
  });

  it('does not look up history when no history keys are given', async () => {
    await resolveRelationLabelsForIds(dataSources, {
      ids: ['PERS-1'],
      types: ['person'],
    });

    expect(
      mockDataSource.CollectionAPI.getHistoryEntitiesByIds
    ).not.toHaveBeenCalled();
  });

  it('falls back to the raw id when the related entity cannot be found', async () => {
    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: ['missing-id'],
      types: ['language'],
      keyAsLabel: { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
    });

    expect(result).toStrictEqual([{ key: 'missing-id', value: 'missing-id' }]);
  });

  it('resolves an empty list without calling the data source', async () => {
    const result = await resolveRelationLabelsForIds(dataSources, {
      ids: [],
      types: ['language'],
    });

    expect(result).toStrictEqual([]);
    expect(mockDataSource.CollectionAPI.getEntitiesByIds).not.toHaveBeenCalled();
  });
});
