import { describe, it, expect, beforeEach, vi } from 'vitest';

// AuthRESTDataSource pulls in express-session, which baseGraphql only declares
// the types for -- the real dependency comes from the service that hosts the
// module, so it cannot be imported from here.
vi.mock('../auth/AuthRESTDataSource', () => ({
  AuthRESTDataSource: class {
    protected environment: any;
    protected session: any;
    protected context: any;

    constructor(options: any) {
      this.environment = options.environment;
      this.session = options.session;
      this.context = options.context;
    }
  },
}));

const { CollectionAPI } = await import('../sources/collection');
const { clearPermissionCache } = await import('../helpers/permissionCache');

class TestCollectionAPI extends CollectionAPI {
  public calls: string[] = [];

  protected async post(path: string, _request?: any): Promise<any> {
    this.calls.push(`post ${path}`);
    return 'good';
  }

  protected async patch(path: string, _request?: any): Promise<any> {
    this.calls.push(`patch ${path}`);
    return 'good';
  }

  protected async delete(path: string, _request?: any): Promise<any> {
    this.calls.push(`delete ${path}`);
    return 'good';
  }
}

const collectionApiFor = (accessToken?: string, tenantId = 'tenant-a') =>
  new TestCollectionAPI({
    environment: {
      api: { collectionApiUrl: 'http://collection-api' },
      customization: {},
    } as any,
    session: accessToken ? { auth: { accessToken } } : {},
    context: { tenantId },
  } as any);

describe('CollectionAPI permission soft calls are cached', () => {
  beforeEach(() => clearPermissionCache());

  it('issues one request for a repeated read check on the same type', async () => {
    const collectionApi = collectionApiFor('token');

    await collectionApi.postEntitiesFilterSoftCall('production');
    await collectionApi.postEntitiesFilterSoftCall('production');

    expect(collectionApi.calls).toHaveLength(1);
  });

  it('collapses a whole listing worth of concurrent update checks', async () => {
    const collectionApi = collectionApiFor('token');
    const rows = Array.from({ length: 100 }, () => 'PROD-1');

    const statuses = await Promise.all(
      rows.map((id) => collectionApi.patchEntityDetailSoftCall(id, 'production'))
    );

    expect(statuses.every((status) => status === '200')).toBe(true);
    expect(collectionApi.calls).toHaveLength(1);
  });

  it('keeps a separate entry per entity id', async () => {
    const collectionApi = collectionApiFor('token');

    await collectionApi.delEntityDetailSoftCall('PROD-1', 'production');
    await collectionApi.delEntityDetailSoftCall('PROD-2', 'production');

    expect(collectionApi.calls).toHaveLength(2);
  });

  it('normalizes a prefixed id onto the same entry', async () => {
    const collectionApi = collectionApiFor('token');

    await collectionApi.patchEntityDetailSoftCall('PROD-1', 'production');
    await collectionApi.patchEntityDetailSoftCall(
      'entities/PROD-1',
      'production'
    );

    expect(collectionApi.calls).toHaveLength(1);
  });

  it('never serves one user a decision made for another', async () => {
    const firstUser = collectionApiFor('token-a');
    const secondUser = collectionApiFor('token-b');
    const anonymous = collectionApiFor(undefined);

    await firstUser.postEntitySoftCall('production');
    await secondUser.postEntitySoftCall('production');
    await anonymous.postEntitySoftCall('production');

    expect(firstUser.calls).toHaveLength(1);
    expect(secondUser.calls).toHaveLength(1);
    expect(anonymous.calls).toHaveLength(1);
  });

  it('never serves one tenant a decision made for another', async () => {
    const tenantA = collectionApiFor('token', 'tenant-a');
    const tenantB = collectionApiFor('token', 'tenant-b');

    await tenantA.postEntitiesFilterSoftCall('production');
    await tenantB.postEntitiesFilterSoftCall('production');

    expect(tenantA.calls).toHaveLength(1);
    expect(tenantB.calls).toHaveLength(1);
  });

  it('separates the advanced permission checks by resolved entity id', async () => {
    const collectionApi = collectionApiFor('token');
    const permissionRequestInfo = {
      datasource: 'CollectionAPI',
      crud: 'post',
      uri: 'entities/$parentEntityId/relations',
      body: {},
    } as any;

    await collectionApi.checkAdvancedPermission(
      permissionRequestInfo,
      'ORG-1',
      undefined
    );
    await collectionApi.checkAdvancedPermission(
      permissionRequestInfo,
      'ORG-1',
      undefined
    );
    await collectionApi.checkAdvancedPermission(
      permissionRequestInfo,
      'ORG-2',
      undefined
    );

    expect(collectionApi.calls).toEqual([
      'post entities/ORG-1/relations?soft=1',
      'post entities/ORG-2/relations?soft=1',
    ]);
  });
});
