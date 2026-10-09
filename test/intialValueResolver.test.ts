import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KeyAsLabelOrigin, type Entity } from '../generated-types/type-defs';
import {
  resolveIntialValueParentRoot,
  resolveIntialValueParentMetadata,
  resolveIntialValueParentRelations,
  resolveIntialValueLockedProperties,
  resolveIntialValueRelationMetadata,
  resolveIntialValueRelations,
  resolveIntialValueRepeatableMetadata,
  fetchRelationEntity,
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
      { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
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
      { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
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

describe('resolveIntialValueRepeatableMetadata', () => {
  const dataSources = {
    CollectionAPI: { preferredLanguage: 'en' },
  } as unknown as DataSources;

  const parent = {
    metadata: [
      { key: 'updated_keys', value: 'description' },
      { key: 'updated_keys', value: 'title' },
    ],
  };

  it('joins multiple values into a comma-separated string by default', async () => {
    const result = await resolveIntialValueRepeatableMetadata(
      dataSources,
      parent,
      'updated_keys',
      null,
      null
    );

    expect(result).toBe('description, title');
  });

  it('returns multiple values as an array when asArray is set', async () => {
    const result = await resolveIntialValueRepeatableMetadata(
      dataSources,
      parent,
      'updated_keys',
      null,
      null,
      true
    );

    expect(result).toStrictEqual(['description', 'title']);
  });

  it('still picks the preferred language when asArray is set', async () => {
    const result = await resolveIntialValueRepeatableMetadata(
      dataSources,
      {
        metadata: [
          {
            key: 'title',
            value: 'Titel',
            metadata: [{ key: 'lang', value: 'nl' }],
          },
          {
            key: 'title',
            value: 'Title',
            metadata: [{ key: 'lang', value: 'en' }],
          },
        ],
      },
      'title',
      null,
      null,
      true
    );

    expect(result).toBe('Title');
  });
});

describe('fetchRelationEntity for history versions', () => {
  const liveEntity = {
    id: 'PERS-1',
    _id: 'live-pers-1',
    type: 'person',
    metadata: [{ key: 'name', value: 'New name' }],
  };
  const historicalEntity = {
    id: 'PERS-1',
    _id: 'hist-pers-1',
    type: 'person',
    metadata: [{ key: 'name', value: 'Old name' }],
  };

  const makeDataSources = () =>
    ({
      CollectionAPI: {
        getEntity: vi.fn().mockResolvedValue(liveEntity),
        getHistoryEntity: vi.fn().mockResolvedValue(historicalEntity),
      },
    }) as unknown as DataSources;

  it('reads a related entity as it was in the history version when the relation carries its own history key', async () => {
    const dataSources = makeDataSources();

    const entity = await fetchRelationEntity(
      dataSources,
      { key: 'PERS-1', type: 'refAuthors', historyKey: 'hist-pers-1' },
      '',
      { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
      ''
    );

    expect(entity).toEqual(historicalEntity);
    expect(dataSources.CollectionAPI.getHistoryEntity).toHaveBeenCalledWith(
      'person',
      'hist-pers-1'
    );
  });

  it('reads the live entity without a history lookup when the related entity had no history version yet', async () => {
    const dataSources = makeDataSources();

    const entity = await fetchRelationEntity(
      dataSources,
      { key: 'PERS-1', type: 'refAuthors', historyKey: 'PERS-1' },
      '',
      { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
      ''
    );

    expect(entity).toEqual(liveEntity);
    expect(dataSources.CollectionAPI.getHistoryEntity).not.toHaveBeenCalled();
  });

  it('falls back to the live entity when the history version cannot be found', async () => {
    const dataSources = makeDataSources();
    (dataSources.CollectionAPI.getHistoryEntity as any).mockResolvedValue(
      undefined
    );

    const entity = await fetchRelationEntity(
      dataSources,
      { key: 'PERS-1', type: 'refAuthors', historyKey: 'hist-pers-1' },
      '',
      { origin: KeyAsLabelOrigin.Metadata, key: 'name' },
      ''
    );

    expect(entity).toEqual(liveEntity);
  });
});
