import { describe, it, expect, vi, beforeEach } from 'vitest';
import DataLoader from 'dataloader';
import { Collection } from '../../../generated-types/type-defs';

/**
 * We test the DataLoader batching logic by extracting the core functions
 * from CollectionAPI and testing them in isolation. This avoids needing
 * to instantiate the full AuthRESTDataSource with HTTP/auth setup.
 */

// Mirrors parsers/entity.ts setId
const setId = (entityRaw: any) => {
  if (!entityRaw.id)
    entityRaw.id = entityRaw.object_id
      ? entityRaw.object_id
      : entityRaw._id
        ? entityRaw._id
        : entityRaw.identifiers?.[0];
  entityRaw.uuid = entityRaw._id;
  return entityRaw;
};

const createEntity = (id: string, type: string) => ({
  _id: id,
  id: id,
  type,
  metadata: [{ key: 'name', value: `Entity ${id}` }],
  relations: [],
});

// Extracted logic from CollectionAPI — mirrors the real implementation
function createCollectionAPI(getMock: ReturnType<typeof vi.fn>) {
  const fetchEntityIndividual = async (id: string): Promise<any> => {
    try {
      const cleanId = id.includes('/') ? id.split('/')[1] : id;
      const data = await getMock(`${Collection.Entities}/${cleanId}`);
      setId(data);
      return data;
    } catch {
      return null;
    }
  };

  const fetchEntitiesBatchByType = async (
    type: string,
    entries: { id: string; index: number }[]
  ): Promise<any[]> => {
    const cleanIds = entries.map((e) => {
      const split = e.id.split('/');
      return split.length > 1 ? split[1] : e.id;
    });

    try {
      const data = await getMock(
        `${Collection.Entities}?ids=${cleanIds.join(',')}&type=${type}&skip_relations=0`
      );

      const resultsMap = new Map<string, any>();
      for (const entity of data.results || []) {
        setId(entity);
        resultsMap.set(entity.id, entity);
        if (entity._id) resultsMap.set(entity._id, entity);
      }

      return entries.map((entry) => {
        const cleanId = entry.id.split('/').pop()!;
        return resultsMap.get(cleanId) || resultsMap.get(entry.id) || null;
      });
    } catch {
      return Promise.all(entries.map((e) => fetchEntityIndividual(e.id)));
    }
  };

  const batchLoadEntities = async (keys: string[]): Promise<any[]> => {
    const parsed = keys.map((key, index) => {
      const sep = key.indexOf('::');
      const type = sep >= 0 ? key.substring(0, sep) : '';
      const id = sep >= 0 ? key.substring(sep + 2) : key;
      return { type, id, index };
    });

    const groups = new Map<string, { id: string; index: number }[]>();
    for (const p of parsed) {
      const group = groups.get(p.type) || [];
      group.push({ id: p.id, index: p.index });
      groups.set(p.type, group);
    }

    const results: any[] = new Array(keys.length).fill(null);
    const promises: Promise<void>[] = [];

    for (const [type, entries] of groups) {
      if (type) {
        promises.push(
          fetchEntitiesBatchByType(type, entries).then((entities) => {
            entries.forEach((entry, i) => {
              results[entry.index] = entities[i];
            });
          })
        );
      } else {
        for (const entry of entries) {
          promises.push(
            fetchEntityIndividual(entry.id).then((entity) => {
              results[entry.index] = entity;
            })
          );
        }
      }
    }

    await Promise.all(promises);
    return results;
  };

  const entityLoader = new DataLoader<string, any>(
    async (keys: readonly string[]) => batchLoadEntities([...keys]),
    { maxBatchSize: 100 }
  );

  const getEntityBatched = (id: string, type?: string): Promise<any> => {
    const key = type ? `${type}::${id}` : `::${id}`;
    return entityLoader.load(key);
  };

  return { getEntityBatched, entityLoader, batchLoadEntities };
}

describe('CollectionAPI DataLoader', () => {
  let getMock: ReturnType<typeof vi.fn>;
  let api: ReturnType<typeof createCollectionAPI>;

  beforeEach(() => {
    getMock = vi.fn();
    api = createCollectionAPI(getMock);
  });

  describe('batch by type', () => {
    it('should batch multiple entities of the same type into one request', async () => {
      const entities = [
        createEntity('PERS-001', 'person'),
        createEntity('PERS-002', 'person'),
        createEntity('PERS-003', 'person'),
      ];

      getMock.mockResolvedValueOnce({ results: entities });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('PERS-002', 'person'),
        api.getEntityBatched('PERS-003', 'person'),
      ]);

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(
        'entities?ids=PERS-001,PERS-002,PERS-003&type=person&skip_relations=0'
      );
      expect(results).toHaveLength(3);
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('PERS-002');
      expect(results[2].id).toBe('PERS-003');
    });

    it('should group by type and make one batch request per type', async () => {
      const persons = [
        createEntity('PERS-001', 'person'),
        createEntity('PERS-002', 'person'),
      ];
      const corporations = [
        createEntity('CORP-001', 'corporation'),
        createEntity('CORP-002', 'corporation'),
        createEntity('CORP-003', 'corporation'),
      ];

      getMock.mockImplementation((url: string) => {
        if (url.includes('type=person')) {
          return Promise.resolve({ results: persons });
        }
        if (url.includes('type=corporation')) {
          return Promise.resolve({ results: corporations });
        }
        return Promise.reject(new Error('unexpected url'));
      });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('CORP-001', 'corporation'),
        api.getEntityBatched('PERS-002', 'person'),
        api.getEntityBatched('CORP-002', 'corporation'),
        api.getEntityBatched('CORP-003', 'corporation'),
      ]);

      expect(getMock).toHaveBeenCalledTimes(2);
      expect(getMock).toHaveBeenCalledWith(
        'entities?ids=PERS-001,PERS-002&type=person&skip_relations=0'
      );
      expect(getMock).toHaveBeenCalledWith(
        'entities?ids=CORP-001,CORP-002,CORP-003&type=corporation&skip_relations=0'
      );
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('CORP-001');
      expect(results[2].id).toBe('PERS-002');
      expect(results[3].id).toBe('CORP-002');
      expect(results[4].id).toBe('CORP-003');
    });
  });

  describe('fallback to individual requests', () => {
    it('should use individual requests when type is not provided', async () => {
      getMock.mockImplementation((url: string) => {
        if (url === 'entities/PERS-001') return Promise.resolve(createEntity('PERS-001', 'person'));
        if (url === 'entities/PERS-002') return Promise.resolve(createEntity('PERS-002', 'person'));
        return Promise.reject(new Error('unexpected url'));
      });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001'),
        api.getEntityBatched('PERS-002'),
      ]);

      expect(getMock).toHaveBeenCalledTimes(2);
      expect(getMock).toHaveBeenCalledWith('entities/PERS-001');
      expect(getMock).toHaveBeenCalledWith('entities/PERS-002');
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('PERS-002');
    });

    it('should fall back to individual requests when batch request fails', async () => {
      getMock.mockImplementation((url: string) => {
        if (url.includes('?ids=')) return Promise.reject(new Error('400 Bad Request'));
        if (url === 'entities/PERS-001') return Promise.resolve(createEntity('PERS-001', 'person'));
        if (url === 'entities/PERS-002') return Promise.resolve(createEntity('PERS-002', 'person'));
        return Promise.reject(new Error('unexpected url'));
      });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('PERS-002', 'person'),
      ]);

      // 1 batch call (failed) + 2 individual fallback calls
      expect(getMock).toHaveBeenCalledTimes(3);
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('PERS-002');
    });
  });

  describe('mixed typed and untyped requests', () => {
    it('should batch typed requests and individually fetch untyped ones', async () => {
      const persons = [
        createEntity('PERS-001', 'person'),
        createEntity('PERS-002', 'person'),
      ];

      getMock.mockImplementation((url: string) => {
        if (url.includes('type=person')) return Promise.resolve({ results: persons });
        if (url === 'entities/UNKNOWN-001') return Promise.resolve(createEntity('UNKNOWN-001', 'other'));
        return Promise.reject(new Error(`unexpected url: ${url}`));
      });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('UNKNOWN-001'),
        api.getEntityBatched('PERS-002', 'person'),
      ]);

      expect(getMock).toHaveBeenCalledTimes(2);
      expect(getMock).toHaveBeenCalledWith(
        'entities?ids=PERS-001,PERS-002&type=person&skip_relations=0'
      );
      expect(getMock).toHaveBeenCalledWith('entities/UNKNOWN-001');
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('UNKNOWN-001');
      expect(results[2].id).toBe('PERS-002');
    });
  });

  describe('deduplication', () => {
    it('should deduplicate identical requests for the same entity', async () => {
      const persons = [createEntity('PERS-001', 'person')];

      getMock.mockResolvedValueOnce({ results: persons });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('PERS-001', 'person'),
      ]);

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(
        'entities?ids=PERS-001&type=person&skip_relations=0'
      );
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('PERS-001');
      expect(results[2].id).toBe('PERS-001');
    });
  });

  describe('ID cleaning', () => {
    it('should strip "entities/" prefix from IDs in batch requests', async () => {
      const entities = [
        createEntity('PERS-001', 'person'),
        createEntity('PERS-002', 'person'),
      ];

      getMock.mockResolvedValueOnce({ results: entities });

      const results = await Promise.all([
        api.getEntityBatched('entities/PERS-001', 'person'),
        api.getEntityBatched('entities/PERS-002', 'person'),
      ]);

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(
        'entities?ids=PERS-001,PERS-002&type=person&skip_relations=0'
      );
      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('PERS-002');
    });

    it('should strip "entities/" prefix from IDs in individual requests', async () => {
      getMock.mockImplementation((url: string) => {
        if (url === 'entities/PERS-001') return Promise.resolve(createEntity('PERS-001', 'person'));
        return Promise.reject(new Error(`unexpected url: ${url}`));
      });

      const result = await api.getEntityBatched('entities/PERS-001');

      expect(getMock).toHaveBeenCalledWith('entities/PERS-001');
      expect(result.id).toBe('PERS-001');
    });
  });

  describe('error handling', () => {
    it('should return null for entities that fail to fetch individually', async () => {
      getMock.mockRejectedValue(new Error('Not found'));

      const results = await Promise.all([
        api.getEntityBatched('NONEXISTENT-001'),
        api.getEntityBatched('NONEXISTENT-002'),
      ]);

      expect(results[0]).toBeNull();
      expect(results[1]).toBeNull();
    });

    it('should return null for entities missing from batch response', async () => {
      // Only PERS-001 is returned, PERS-002 is missing
      const entities = [createEntity('PERS-001', 'person')];

      getMock.mockResolvedValueOnce({ results: entities });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('PERS-002', 'person'),
      ]);

      expect(results[0].id).toBe('PERS-001');
      expect(results[1]).toBeNull();
    });
  });

  describe('result ordering', () => {
    it('should return results in the same order as the input regardless of API order', async () => {
      // API returns in reverse order
      const entities = [
        createEntity('PERS-003', 'person'),
        createEntity('PERS-001', 'person'),
        createEntity('PERS-002', 'person'),
      ];

      getMock.mockResolvedValueOnce({ results: entities });

      const results = await Promise.all([
        api.getEntityBatched('PERS-001', 'person'),
        api.getEntityBatched('PERS-002', 'person'),
        api.getEntityBatched('PERS-003', 'person'),
      ]);

      expect(results[0].id).toBe('PERS-001');
      expect(results[1].id).toBe('PERS-002');
      expect(results[2].id).toBe('PERS-003');
    });
  });
});
