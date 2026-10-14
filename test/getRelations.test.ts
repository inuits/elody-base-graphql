import { describe, it, expect, vi } from 'vitest';

vi.mock('../auth/AuthRESTDataSource', () => ({
  AuthRESTDataSource: class {
    protected environment: any;
    protected session: any;
    constructor(options: any) {
      this.environment = options.environment;
      this.session = options.session;
    }
  },
}));

const { CollectionAPI } = await import('../sources/collection');

const apiReturning = (document: unknown) => {
  const api = new CollectionAPI({
    environment: { api: { collectionApiUrl: 'http://collection-api' } } as any,
    session: {},
  } as any);
  const get = vi.fn(async () => document);
  (api as any).get = get;
  return { api, get };
};

// The collection API serves POST/PATCH/PUT on {collection}/{id}/relations but
// no GET (405), so the relations are read from the document itself.
describe('getRelations', () => {
  it('reads the relations from the document', async () => {
    const relations = [{ key: 'GN-1', type: 'ref_genres' }];
    const { api, get } = apiReturning({ id: 'PR-1', relations });

    expect(await api.getRelations('PR-1', 'entities' as any)).toEqual(relations);
    expect(get).toHaveBeenCalledWith('entities/PR-1');
  });

  it('reads them from the entities collection by default', async () => {
    const { api, get } = apiReturning({ relations: [] });
    await api.getRelations('PR-1');
    expect(get).toHaveBeenCalledWith('entities/PR-1');
  });

  it('returns no relations for a document without any', async () => {
    const { api } = apiReturning({ id: 'PR-1' });
    expect(await api.getRelations('PR-1')).toEqual([]);
  });
});
