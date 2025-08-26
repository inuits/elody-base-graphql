import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveAdvancedEntities } from '../resolvers/entitiesResolver';
import type { AdvancedFilterInput, Entity, Entitytyping } from '../../../generated-types/type-defs';
import { AdvancedFilterTypes } from '../../../generated-types/type-defs';
import { DataSources } from '../types';

const mockEntity = (id: string, type: string): Entity => ({
  id,
  type,
  metadata: [],
  relations: [],
  schema: {},
  _id: id,
  identifiers: [],
  audit: {},
  document_version: 1,
  uuid: id
});

const mockDataSource = {
  CollectionAPI: {
    GetAdvancedEntities: vi.fn()
  }
};

describe('resolveAdvancedEntities', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

it('should handle empty filters with default entity type', async () => {
  mockDataSource.CollectionAPI.GetAdvancedEntities.mockResolvedValueOnce({
    results: [mockEntity('1', 'BaseEntity')],
    count: 1,
    facets: [],
    skip: 0,
    limit: 20
  });

  const result = await resolveAdvancedEntities(
    mockDataSource as unknown as DataSources,
    'BaseEntity',
    []
  );

  expect(result.results.length).toBe(1);
  expect(result.count).toBe(1);
  
  expect(mockDataSource.CollectionAPI.GetAdvancedEntities).toHaveBeenCalledWith(
    'BaseEntity',
    20,
    1,
    expect.arrayContaining([{
      type: AdvancedFilterTypes.Type,
      value: 'BaseEntity',
      match_exact: true
    }]),
    { value: '' }
  );
});

it('should handle single type filter', async () => {
  const filters: AdvancedFilterInput[] = [{
    type: AdvancedFilterTypes.Type,
    value: 'Language',
    match_exact: true
  }];

  mockDataSource.CollectionAPI.GetAdvancedEntities.mockResolvedValueOnce({
    results: [mockEntity('1', 'Language')],
    count: 1,
    facets: [],
    skip: 0,
    limit: 20
  });

  const result = await resolveAdvancedEntities(
    mockDataSource as unknown as DataSources,
    'Language' as Entitytyping,
    filters
  );

  expect(result.results.length).toBe(1);
  
  expect(mockDataSource.CollectionAPI.GetAdvancedEntities).toHaveBeenCalledTimes(1);
  expect(result.results).toStrictEqual([mockEntity('1', 'Language')]);
});

it('should handle selection filter with multiple types', async () => {
    mockDataSource.CollectionAPI.GetAdvancedEntities
    .mockResolvedValueOnce({ 
      results: [mockEntity('1', 'Language'), mockEntity('2', 'User')],
      count: 2
    })

  const filters: AdvancedFilterInput[] = [{
    type: AdvancedFilterTypes.Selection,
    key: 'type',
    value: ['Language', 'User'],
    match_exact: true
  }];


  const result = await resolveAdvancedEntities(
    mockDataSource as unknown as DataSources,
    'Language' as Entitytyping,
    filters
  );
  
  expect(mockDataSource.CollectionAPI.GetAdvancedEntities).toHaveBeenCalledTimes(1);
  expect(result.results).toStrictEqual([mockEntity('1', 'Language'), mockEntity('2', 'User')]);
  expect(result.results.length).toBe(2);
  expect(result.count).toBe(2);
});

it('should handle selection filter with multiple types', async () => {
  mockDataSource.CollectionAPI.GetAdvancedEntities
    .mockResolvedValueOnce({ results: [mockEntity('1', 'Language'), mockEntity('2', 'User')], count: 2 })

  const result = await resolveAdvancedEntities(
    mockDataSource as unknown as DataSources,
    'BaseEntity' as Entitytyping,
    [
      {
        type: AdvancedFilterTypes.Selection,
        key: 'type',
        value: ['Language', 'User'],
        match_exact: true
      },
      {
        type: AdvancedFilterTypes.Text,
        key: 'name',
        value: 'test',
        match_exact: false
      }
    ]
  );

  expect(mockDataSource.CollectionAPI.GetAdvancedEntities).toHaveBeenCalledTimes(1);
  expect(result.results).toStrictEqual([mockEntity('1', 'Language'), mockEntity('2', 'User')]);
  expect(result.results.length).toBe(2);
  expect(result.count).toBe(2);
});

  it('should handle empty results gracefully', async () => {
    const filters: AdvancedFilterInput[] = [{
      type: AdvancedFilterTypes.Text,
      value: 'Nonexistent',
      match_exact: true
    }];

    mockDataSource.CollectionAPI.GetAdvancedEntities.mockResolvedValueOnce({
      results: [],
      count: 0,
      facets: [],
      skip: 0,
      limit: 20
    });

    const result = await resolveAdvancedEntities(
      mockDataSource as unknown as DataSources,
      'BaseEntity' as Entitytyping,
      filters
    );

    expect(result.results.length).toBe(0);
    expect(result.count).toBe(0);
  });

  it('should handle custom limit and skip values', async () => {
    mockDataSource.CollectionAPI.GetAdvancedEntities.mockResolvedValueOnce({
      results: [mockEntity('1', 'BaseEntity')],
      count: 1,
      facets: [],
      skip: 5,
      limit: 10
    });

    const result = await resolveAdvancedEntities(
      mockDataSource as unknown as DataSources,
      'BaseEntity' as Entitytyping,
      [],
      10,
      5
    );

    expect(result.limit).toBe(10);
    expect(mockDataSource.CollectionAPI.GetAdvancedEntities).toHaveBeenCalledWith(
      'BaseEntity',
      10,
      5,
      expect.any(Array),
      { value: '' }
    );
  });
});