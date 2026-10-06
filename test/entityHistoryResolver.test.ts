import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveEntityHistoryVersions,
  resolveEntityHistoryVersionDetail,
  resolveEntityHistoryVersionList,
} from '../resolvers/entityHistoryResolver';
import { DataSources } from '../types';

const mockHistoryServiceAPI = {
  getAllHistoryEntries: vi.fn(),
  getResolvedHistoryEntry: vi.fn(),
};

const dataSources = {
  HistoryServiceAPI: mockHistoryServiceAPI,
} as unknown as DataSources;

const historyEntry = (
  _id: string,
  audit: Record<string, any>,
  document_version?: number
) => ({ _id, id: 'W-1', type: 'work_word', audit, document_version });

describe('resolveEntityHistoryVersions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps every history entry to a version keyed by its point in time, oldest first', async () => {
    mockHistoryServiceAPI.getAllHistoryEntries.mockResolvedValueOnce([
      historyEntry(
        'h2',
        {
          created: { at: '2026-01-01T00:00:00+00:00', by: 'alice' },
          updated: { at: '2026-03-01T00:00:00+00:00', by: 'bob' },
        },
        2
      ),
      historyEntry(
        'h1',
        { created: { at: '2026-01-01T00:00:00+00:00', by: 'alice' } },
        1
      ),
    ]);

    const result = await resolveEntityHistoryVersions(
      dataSources,
      'W-1',
      'work_word'
    );

    expect(result).toStrictEqual([
      {
        versionId: '2026-01-01T00:00:00+00:00',
        documentVersion: 1,
        timestamp: '2026-01-01T00:00:00+00:00',
        editedBy: 'alice',
      },
      {
        versionId: '2026-03-01T00:00:00+00:00',
        documentVersion: 2,
        timestamp: '2026-03-01T00:00:00+00:00',
        editedBy: 'bob',
      },
    ]);
    expect(mockHistoryServiceAPI.getAllHistoryEntries).toHaveBeenCalledWith(
      'W-1',
      'work_word'
    );
  });

  it('leaves out entries without a point in time, since they cannot be resolved', async () => {
    mockHistoryServiceAPI.getAllHistoryEntries.mockResolvedValueOnce([
      historyEntry('h1', {}),
      historyEntry('h2', { created: { at: '2026-01-01T00:00:00+00:00' } }),
    ]);

    const result = await resolveEntityHistoryVersions(
      dataSources,
      'W-1',
      'work_word'
    );

    expect(result.map((version) => version.versionId)).toStrictEqual([
      '2026-01-01T00:00:00+00:00',
    ]);
  });

  it('applies skip and limit after sorting, since the history service does not page', async () => {
    mockHistoryServiceAPI.getAllHistoryEntries.mockResolvedValueOnce([
      historyEntry('h3', { updated: { at: '2026-03-01T00:00:00+00:00' } }),
      historyEntry('h1', { updated: { at: '2026-01-01T00:00:00+00:00' } }),
      historyEntry('h2', { updated: { at: '2026-02-01T00:00:00+00:00' } }),
    ]);

    const result = await resolveEntityHistoryVersions(
      dataSources,
      'W-1',
      'work_word',
      1,
      1
    );

    expect(result.map((version) => version.versionId)).toStrictEqual([
      '2026-02-01T00:00:00+00:00',
    ]);
  });

  it('returns no versions when the client has no history service configured', async () => {
    const result = await resolveEntityHistoryVersions(
      {} as unknown as DataSources,
      'W-1',
      'work_word'
    );

    expect(result).toStrictEqual([]);
  });
});

describe('resolveEntityHistoryVersionDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches the resolved entry for the version point in time and normalizes id/uuid like a live entity', async () => {
    mockHistoryServiceAPI.getResolvedHistoryEntry.mockResolvedValueOnce({
      _id: 'h1',
      id: 'W-1',
      type: 'work_word',
      relations: [],
    });

    const result = await resolveEntityHistoryVersionDetail(
      dataSources,
      'W-1',
      'work_word',
      '2026-01-01T00:00:00+00:00'
    );

    expect(result).toStrictEqual({
      _id: 'h1',
      id: 'W-1',
      uuid: 'h1',
      type: 'work_word',
      relations: [],
    });
    expect(mockHistoryServiceAPI.getResolvedHistoryEntry).toHaveBeenCalledWith(
      'W-1',
      'work_word',
      '2026-01-01T00:00:00+00:00'
    );
  });

  it('points relations back at the live entity and keeps the history entry aside', async () => {
    mockHistoryServiceAPI.getResolvedHistoryEntry.mockResolvedValueOnce({
      _id: 'h1',
      id: 'W-1',
      type: 'work_word',
      relations: [
        { key: 'hist-pers-1', live_key: 'PERS-1', type: 'refAuthors' },
        { key: 'TAAL-1', type: 'refLanguages' },
      ],
    });

    const result = await resolveEntityHistoryVersionDetail(
      dataSources,
      'W-1',
      'work_word',
      '2026-01-01T00:00:00+00:00'
    );

    expect(result.relations).toStrictEqual([
      { key: 'PERS-1', historyKey: 'hist-pers-1', type: 'refAuthors' },
      { key: 'TAAL-1', historyKey: 'TAAL-1', type: 'refLanguages' },
    ]);
  });

  it('returns null when the version cannot be found', async () => {
    mockHistoryServiceAPI.getResolvedHistoryEntry.mockResolvedValueOnce(null);

    const result = await resolveEntityHistoryVersionDetail(
      dataSources,
      'W-1',
      'work_word',
      'missing'
    );

    expect(result).toBeNull();
  });

  it('returns null when the client has no history service configured', async () => {
    const result = await resolveEntityHistoryVersionDetail(
      {} as unknown as DataSources,
      'W-1',
      'work_word',
      '2026-01-01T00:00:00+00:00'
    );

    expect(result).toBeNull();
  });
});

describe('resolveEntityHistoryVersionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const filtersFor = (id: unknown, type: unknown) => [
    { type: 'type', value: type },
    { type: 'selection', key: ['id'], value: id },
  ];

  const threeVersions = () => [
    historyEntry('h1', {
      created: { at: '2026-01-01T00:00:00+00:00', by: 'alice' },
    }),
    historyEntry('h3', {
      created: { at: '2026-01-01T00:00:00+00:00', by: 'alice' },
      updated: { at: '2026-03-01T00:00:00+00:00', by: 'carol' },
    }),
    historyEntry('h2', {
      created: { at: '2026-01-01T00:00:00+00:00', by: 'alice' },
      updated: { at: '2026-02-01T00:00:00+00:00', by: 'bob' },
    }),
  ];

  it('lists every version as a list row, newest first, numbered from the oldest', async () => {
    mockHistoryServiceAPI.getAllHistoryEntries.mockResolvedValueOnce(
      threeVersions()
    );

    const result = await resolveEntityHistoryVersionList(
      dataSources,
      filtersFor('W-1', 'work_word') as any
    );

    expect(mockHistoryServiceAPI.getAllHistoryEntries).toHaveBeenCalledWith(
      'W-1',
      'work_word'
    );
    expect(result.count).toBe(3);
    expect(result.results).toStrictEqual([
      {
        _id: 'W-1-2026-03-01T00:00:00+00:00',
        id: 'W-1-2026-03-01T00:00:00+00:00',
        type: 'history',
        metadata: [
          { key: 'version', value: 3 },
          { key: 'edited_by', value: 'carol' },
          { key: 'edited_at', value: '2026-03-01T00:00:00+00:00' },
        ],
      },
      {
        _id: 'W-1-2026-02-01T00:00:00+00:00',
        id: 'W-1-2026-02-01T00:00:00+00:00',
        type: 'history',
        metadata: [
          { key: 'version', value: 2 },
          { key: 'edited_by', value: 'bob' },
          { key: 'edited_at', value: '2026-02-01T00:00:00+00:00' },
        ],
      },
      {
        _id: 'W-1-2026-01-01T00:00:00+00:00',
        id: 'W-1-2026-01-01T00:00:00+00:00',
        type: 'history',
        metadata: [
          { key: 'version', value: 1 },
          { key: 'edited_by', value: 'alice' },
          { key: 'edited_at', value: '2026-01-01T00:00:00+00:00' },
        ],
      },
    ]);
  });

  it('pages through the versions while keeping the total count and version numbers', async () => {
    mockHistoryServiceAPI.getAllHistoryEntries.mockResolvedValueOnce(
      threeVersions()
    );

    const result = await resolveEntityHistoryVersionList(
      dataSources,
      filtersFor('W-1', 'work_word') as any,
      2,
      2
    );

    expect(result.count).toBe(3);
    expect(result.limit).toBe(2);
    expect(result.results?.map((row: any) => row.metadata[0].value)).toEqual([
      1,
    ]);
  });

  it('accepts the entity id and type as single-item arrays', async () => {
    mockHistoryServiceAPI.getAllHistoryEntries.mockResolvedValueOnce([]);

    await resolveEntityHistoryVersionList(
      dataSources,
      filtersFor(['W-1'], ['work_word']) as any
    );

    expect(mockHistoryServiceAPI.getAllHistoryEntries).toHaveBeenCalledWith(
      'W-1',
      'work_word'
    );
  });

  it('returns an empty list without calling the history service when the entity is unknown', async () => {
    const result = await resolveEntityHistoryVersionList(dataSources, []);

    expect(result).toStrictEqual({ results: [], count: 0, limit: 20 });
    expect(mockHistoryServiceAPI.getAllHistoryEntries).not.toHaveBeenCalled();
  });
});
