import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Entity } from '../generated-types/type-defs';
import {
  resolveIntialValueParentRoot,
  resolveIntialValueParentMetadata,
  resolveIntialValueParentRelations,
  resolveIntialValueLockedProperties,
  resolveIntialValueRelationMetadata,
  resolveIntialValueRelations,
} from '../resolvers/intialValueResolver';
import { DataSources } from '../types';

const mockEntity = (
  id: string,
  type: string,
  metadata = [],
  relations = []
): Entity => ({
  id: id,
  type: type,
  metadata: metadata,
  relations: relations,
  schema: {},
  _id: id,
  identifiers: [],
  audit: {},
  document_version: 1,
  uuid: id,
});

const mockDataSource = {
  CollectionAPI: {
    getEntityById: vi.fn(),
  },
};

describe('IntialValueResolver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should return correct root data from parent 1 relation away', async () => {
    const child = mockEntity(
      '1',
      'expression',
      [],
      [{ key: '2', type: 'refWork' }]
    );
    const parent = mockEntity('2', 'work');
    mockDataSource.CollectionAPI.getEntityById.mockResolvedValueOnce(parent);

    const result = await resolveIntialValueParentRoot(
      mockDataSource as unknown as DataSources,
      child,
      'type',
      [{ relationType: 'refWork' }]
    );

    expect(mockDataSource.CollectionAPI.getEntityById).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(parent['type']);
  });

  it('Should return correct metadata from parent 1 relation away', async () => {
    const child = mockEntity(
      '1',
      'expression',
      [],
      [{ key: '2', type: 'refWork' }]
    );
    const parent = mockEntity(
      '2',
      'work',
      [
        { key: 'test1', value: 'test' },
        { key: 'actual_metadata', value: 'should_get_returned' },
        { key: 'test2', value: 'test' },
      ],
      []
    );
    mockDataSource.CollectionAPI.getEntityById.mockResolvedValueOnce(parent);

    const result = await resolveIntialValueParentMetadata(
      mockDataSource as unknown as DataSources,
      child,
      'actual_metadata',
      [{ relationType: 'refWork' }]
    );

    expect(mockDataSource.CollectionAPI.getEntityById).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual('should_get_returned');
  });

  it('Should return correct relations from parent 2 relations away', async () => {
    const child = mockEntity(
      '1',
      'manifestation',
      [],
      [{ key: '2', type: 'refExpressions' }]
    );
    const parent = mockEntity(
      '2',
      'expression',
      [],
      [{ key: '3', type: 'refWork' }]
    );
    const superParent = mockEntity(
      '3',
      'work',
      [],
      [
        { key: '789', type: 'refAuthor' },
        { key: '456', type: 'refAuthor' },
      ]
    );
    mockDataSource.CollectionAPI.getEntityById
      .mockResolvedValueOnce(parent)
      .mockResolvedValueOnce(superParent);

    const result = await resolveIntialValueParentRelations(
      mockDataSource as unknown as DataSources,
      child,
      'refAuthor',
      [{ relationType: 'refExpressions' }, { relationType: 'refWork' }]
    );

    expect(mockDataSource.CollectionAPI.getEntityById).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual(['789', '456']);
  });

  describe('resolveIntialValueLockedProperties', () => {
    it('Should return an empty array when the entity has no lock', () => {
      const entity = mockEntity('1', 'inscription');

      const result = resolveIntialValueLockedProperties(entity);

      expect(result).toStrictEqual([]);
    });

    it('Should return an empty array when lock.properties is empty', () => {
      const entity = { ...mockEntity('1', 'inscription'), lock: { properties: [] } };

      const result = resolveIntialValueLockedProperties(entity);

      expect(result).toStrictEqual([]);
    });

    it('Should return the locked property keys', () => {
      const entity = {
        ...mockEntity('1', 'inscription'),
        lock: { properties: ['reading'] },
      };

      const result = resolveIntialValueLockedProperties(entity);

      expect(result).toStrictEqual(['reading']);
    });
  });
});

describe('resolveIntialValueRelationMetadata', () => {
  const userWithTwoOrganizations = {
    id: 'user:1',
    relations: [
      {
        type: 'refOrganizations',
        key: 'organization:1',
        metadata: [{ key: 'function', value: ['programmer'] }],
      },
      {
        type: 'refOrganizations',
        key: 'organization:2',
        metadata: [{ key: 'function', value: ['technician'] }],
      },
    ],
  };
  const dataSources = {
    CollectionAPI: { getEntity: vi.fn() },
  } as unknown as DataSources;

  beforeEach(() => vi.clearAllMocks());

  it('returns only the metadata of the given relation when a uuid is given', async () => {
    const label = await resolveIntialValueRelationMetadata(
      userWithTwoOrganizations,
      'function',
      'organization:2',
      'refOrganizations',
      '',
      undefined as any,
      dataSources
    );

    expect(label).toEqual(['technician']);
  });
});

describe('resolveIntialValueRelations with nestedMetadataKeys', () => {
  const organizations: Record<string, any> = {
    'organization:1': { id: 'organization:1', metadata: [{ key: 'name', value: 'Org A' }] },
    'organization:2': { id: 'organization:2', metadata: [{ key: 'name', value: 'Org B' }] },
  };
  const dataSources = {
    CollectionAPI: {
      getEntity: vi.fn(async (key: string) => organizations[key]),
    },
  } as unknown as DataSources;

  const relationTo = (key: string, metadata: any[] = []) => ({
    type: 'refOrganizations',
    key,
    metadata,
  });

  const resolve = (relations: any[]) =>
    resolveIntialValueRelations(
      dataSources,
      { id: 'user:1', relations },
      'refOrganizations',
      'name',
      '',
      '',
      '',
      '',
      'pill|organization',
      undefined,
      ['function']
    );

  beforeEach(() => vi.clearAllMocks());

  it('pairs every organization with its own relation metadata', async () => {
    const value = await resolve([
      relationTo('organization:1', [{ key: 'function', value: ['programmer', 'technician'] }]),
      relationTo('organization:2'),
    ]);

    expect(value).toEqual({
      formatter: 'pill|organization',
      label: [
        {
          label: 'Org A',
          values: [
            { key: 'function', value: 'programmer' },
            { key: 'function', value: 'technician' },
          ],
        },
        { label: 'Org B', values: [] },
      ],
    });
  });

  it('keeps every value tagged with the metadata key it came from', async () => {
    const value: any = await resolveIntialValueRelations(
      dataSources,
      {
        id: 'user:1',
        relations: [
          relationTo('organization:1', [
            { key: 'roles', value: ['admin'] },
            { key: 'function', value: ['programmer'] },
          ]),
        ],
      },
      'refOrganizations',
      'name',
      '',
      '',
      '',
      '',
      'pill|organization',
      undefined,
      ['roles', 'function']
    );

    expect(value.label[0].values).toEqual([
      { key: 'roles', value: 'admin' },
      { key: 'function', value: 'programmer' },
    ]);
  });

  it('keeps the nested shape for a single relation', async () => {
    const value = await resolve([
      relationTo('organization:1', [{ key: 'function', value: 'programmer' }]),
    ]);

    expect(value).toEqual({
      formatter: 'pill|organization',
      label: [
        { label: 'Org A', values: [{ key: 'function', value: 'programmer' }] },
      ],
    });
  });
});
