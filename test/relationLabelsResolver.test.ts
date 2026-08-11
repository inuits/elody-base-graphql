import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveRelationLabelsForIds } from '../resolvers/relationLabelsResolver';
import { DataSources } from '../types';

const mockDataSource = {
  CollectionAPI: {
    getEntity: vi.fn(),
  },
};

describe('resolveRelationLabelsForIds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves a label for each id using metadataKeyAsLabel', async () => {
    mockDataSource.CollectionAPI.getEntity
      .mockResolvedValueOnce({ metadata: [{ key: 'name', value: 'Aramaic' }] })
      .mockResolvedValueOnce({ metadata: [{ key: 'name', value: 'Greek' }] });

    const result = await resolveRelationLabelsForIds(
      mockDataSource as unknown as DataSources,
      ['lang-1', 'lang-2'],
      'language',
      'name'
    );

    expect(result).toStrictEqual([
      { key: 'lang-1', value: 'Aramaic' },
      { key: 'lang-2', value: 'Greek' },
    ]);
    expect(mockDataSource.CollectionAPI.getEntity).toHaveBeenCalledTimes(2);
  });

  it('falls back to the raw id when the related entity cannot be found', async () => {
    mockDataSource.CollectionAPI.getEntity.mockResolvedValueOnce(null);

    const result = await resolveRelationLabelsForIds(
      mockDataSource as unknown as DataSources,
      ['missing-id'],
      'language',
      'name'
    );

    expect(result).toStrictEqual([{ key: 'missing-id', value: 'missing-id' }]);
  });

  it('resolves an empty list without calling the data source', async () => {
    const result = await resolveRelationLabelsForIds(
      mockDataSource as unknown as DataSources,
      [],
      'language',
      'name'
    );

    expect(result).toStrictEqual([]);
    expect(mockDataSource.CollectionAPI.getEntity).not.toHaveBeenCalled();
  });

  it('resolves a label for each id using rootKeyAsLabel', async () => {
    mockDataSource.CollectionAPI.getEntity
      .mockResolvedValueOnce({ original_filename: 'scan-001.tif' })
      .mockResolvedValueOnce({ original_filename: 'scan-002.tif' });

    const result = await resolveRelationLabelsForIds(
      mockDataSource as unknown as DataSources,
      ['mf-1', 'mf-2'],
      'mediafile',
      undefined,
      'original_filename'
    );

    expect(result).toStrictEqual([
      { key: 'mf-1', value: 'scan-001.tif' },
      { key: 'mf-2', value: 'scan-002.tif' },
    ]);
  });
});
