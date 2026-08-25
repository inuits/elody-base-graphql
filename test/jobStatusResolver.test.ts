import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveJobStatusForEntity } from '../resolvers/jobStatusResolver';
import type { Entity } from '../generated-types/type-defs';
import { AdvancedFilterTypes, Entitytyping } from '../generated-types/type-defs';
import { DataSources } from '../types';

const mockJobEntity = (id: string): Entity => ({
  id,
  type: 'job',
  metadata: [],
  relations: [{ key: 'DL-XEF0OV79J', type: 'isJobFor' }],
  schema: {},
  _id: id,
  identifiers: [],
  audit: {},
  document_version: 1,
  uuid: id,
});

const mockDataSource = {
  CollectionAPI: {
    GetAdvancedEntities: vi.fn(),
    GetJobStatus: vi.fn(),
  },
};

describe('resolveJobStatusForEntity', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('looks up the job via the isJobFor relation and returns its status', async () => {
    mockDataSource.CollectionAPI.GetAdvancedEntities.mockResolvedValueOnce({
      results: [mockJobEntity('job-1')],
      count: 1,
      limit: 1,
    });
    mockDataSource.CollectionAPI.GetJobStatus.mockResolvedValueOnce({
      status: 'running',
    });

    const result = await resolveJobStatusForEntity(
      mockDataSource as unknown as DataSources,
      'DL-XEF0OV79J',
    );

    expect(result).toEqual({ hasJob: true, jobId: 'job-1', status: 'running' });
    expect(mockDataSource.CollectionAPI.GetAdvancedEntities).toHaveBeenCalledWith(
      Entitytyping.Job,
      1,
      1,
      [
        { type: AdvancedFilterTypes.Type, value: 'job' },
        {
          type: AdvancedFilterTypes.Selection,
          key: 'relations.isJobFor.key',
          value: 'DL-XEF0OV79J',
          match_exact: true,
        },
      ],
      { value: '' },
    );
    expect(mockDataSource.CollectionAPI.GetJobStatus).toHaveBeenCalledWith('job-1');
  });

  it('returns hasJob: false without checking status when no job is found', async () => {
    mockDataSource.CollectionAPI.GetAdvancedEntities.mockResolvedValueOnce({
      results: [],
      count: 0,
      limit: 1,
    });

    const result = await resolveJobStatusForEntity(
      mockDataSource as unknown as DataSources,
      'DL-DOES-NOT-EXIST',
    );

    expect(result).toEqual({ hasJob: false, jobId: null, status: null });
    expect(mockDataSource.CollectionAPI.GetJobStatus).not.toHaveBeenCalled();
  });
});
