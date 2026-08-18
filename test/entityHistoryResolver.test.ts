import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveEntityHistoryVersions,
  resolveEntityHistoryVersionDetail,
} from '../resolvers/entityHistoryResolver';
import { DataSources } from '../types';

const mockDataSource = {
  CollectionAPI: {
    getEntityHistoryVersions: vi.fn(),
    getEntityHistoryVersionDetail: vi.fn(),
  },
};

describe('resolveEntityHistoryVersions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates to CollectionAPI.getEntityHistoryVersions with the given arguments', async () => {
    const versions = [
      { versionId: 'v1', documentVersion: 1, timestamp: '2026-01-01T00:00:00Z', editedBy: 'alice' },
    ];
    mockDataSource.CollectionAPI.getEntityHistoryVersions.mockResolvedValueOnce(versions);

    const result = await resolveEntityHistoryVersions(
      mockDataSource as unknown as DataSources,
      'W-1',
      'work_music',
      10,
      0
    );

    expect(result).toStrictEqual(versions);
    expect(mockDataSource.CollectionAPI.getEntityHistoryVersions).toHaveBeenCalledWith(
      'W-1',
      'work_music',
      10,
      0
    );
  });
});

describe('resolveEntityHistoryVersionDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates to CollectionAPI.getEntityHistoryVersionDetail and normalizes id/uuid like a live entity', async () => {
    const document = { _id: 'v1', id: 'W-1', type: 'work_music', properties: { foo: 'bar' } };
    mockDataSource.CollectionAPI.getEntityHistoryVersionDetail.mockResolvedValueOnce(document);

    const result = await resolveEntityHistoryVersionDetail(
      mockDataSource as unknown as DataSources,
      'W-1',
      'work_music',
      'v1'
    );

    expect(result).toStrictEqual({ ...document, id: 'W-1', uuid: 'v1' });
    expect(mockDataSource.CollectionAPI.getEntityHistoryVersionDetail).toHaveBeenCalledWith(
      'W-1',
      'work_music',
      'v1'
    );
  });

  it('returns a falsy result as-is without normalizing', async () => {
    mockDataSource.CollectionAPI.getEntityHistoryVersionDetail.mockResolvedValueOnce(null);

    const result = await resolveEntityHistoryVersionDetail(
      mockDataSource as unknown as DataSources,
      'W-1',
      'work_music',
      'missing'
    );

    expect(result).toBeNull();
  });
});
