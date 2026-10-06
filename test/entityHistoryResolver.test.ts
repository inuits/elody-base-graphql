import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveEntityHistoryVersions,
  resolveEntityHistoryVersionDetail,
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
