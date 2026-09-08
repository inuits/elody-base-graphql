import { describe, it, expect, beforeEach, vi } from 'vitest';

// Only the session store pulls in express-session, which baseGraphql declares
// the types for but does not depend on -- the real one comes from the service
// hosting the module. The rest of the auth stack is the real thing, so the
// cache key is built by the token resolution that runs in production.
vi.mock('../auth', () => ({
  getManager: () => ({ refresh: async () => null }),
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

// AuthTokenManager only hands back the session token when it decodes and has
// not expired, so a cache key test needs a token shaped like a real one.
const unexpiredTokenFor = (subject: string) => {
  const encode = (part: object) =>
    Buffer.from(JSON.stringify(part)).toString('base64url');
  return `${encode({ alg: 'none' })}.${encode({
    sub: subject,
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}.signature`;
};

const collectionApiFor = (
  accessToken?: string,
  tenantId = 'tenant-a',
  environmentOverrides: any = {},
  clientIp?: string
) =>
  new TestCollectionAPI({
    environment: {
      api: { collectionApiUrl: 'http://collection-api' },
      customization: {},
      ...environmentOverrides,
    } as any,
    session: accessToken ? { auth: { accessToken } } : {},
    context: { tenantId },
    clientIp,
  } as any);

describe('CollectionAPI permission soft calls are cached', () => {
  beforeEach(() => clearPermissionCache());

  it('issues one request for a repeated read check on the same type', async () => {
    const collectionApi = collectionApiFor(unexpiredTokenFor('user'));

    await collectionApi.postEntitiesFilterSoftCall('production');
    await collectionApi.postEntitiesFilterSoftCall('production');

    expect(collectionApi.calls).toHaveLength(1);
  });

  it('collapses a whole listing worth of concurrent update checks', async () => {
    const collectionApi = collectionApiFor(unexpiredTokenFor('user'));
    const rows = Array.from({ length: 100 }, () => 'PROD-1');

    const statuses = await Promise.all(
      rows.map((id) => collectionApi.patchEntityDetailSoftCall(id, 'production'))
    );

    expect(statuses.every((status) => status === '200')).toBe(true);
    expect(collectionApi.calls).toHaveLength(1);
  });

  it('keeps a separate entry per entity id', async () => {
    const collectionApi = collectionApiFor(unexpiredTokenFor('user'));

    await collectionApi.delEntityDetailSoftCall('PROD-1', 'production');
    await collectionApi.delEntityDetailSoftCall('PROD-2', 'production');

    expect(collectionApi.calls).toHaveLength(2);
  });

  it('normalizes a prefixed id onto the same entry', async () => {
    const collectionApi = collectionApiFor(unexpiredTokenFor('user'));

    await collectionApi.patchEntityDetailSoftCall('PROD-1', 'production');
    await collectionApi.patchEntityDetailSoftCall(
      'entities/PROD-1',
      'production'
    );

    expect(collectionApi.calls).toHaveLength(1);
  });

  it('never serves one user a decision made for another', async () => {
    const firstUser = collectionApiFor(unexpiredTokenFor('user-a'));
    const secondUser = collectionApiFor(unexpiredTokenFor('user-b'));
    const anonymous = collectionApiFor(undefined);

    await firstUser.postEntitySoftCall('production');
    await secondUser.postEntitySoftCall('production');
    await anonymous.postEntitySoftCall('production');

    expect(firstUser.calls).toHaveLength(1);
    expect(secondUser.calls).toHaveLength(1);
    expect(anonymous.calls).toHaveLength(1);
  });

  it('never serves a whitelisted-IP decision to an anonymous caller', async () => {
    const whitelistEnvironment = {
      features: {
        ipWhiteListing: {
          whiteListedIpAddresses: ['10.0.0.1'],
          tokenToUseForWhiteListedIpAddresses: unexpiredTokenFor('leeszaal'),
        },
      },
    };
    const whitelistedVisitor = collectionApiFor(
      undefined,
      'tenant-a',
      whitelistEnvironment,
      '10.0.0.1'
    );
    const otherVisitor = collectionApiFor(
      undefined,
      'tenant-a',
      whitelistEnvironment,
      '10.0.0.2'
    );

    await whitelistedVisitor.postEntitiesFilterSoftCall('production');
    await otherVisitor.postEntitiesFilterSoftCall('production');

    expect(whitelistedVisitor.calls).toHaveLength(1);
    expect(otherVisitor.calls).toHaveLength(1);
  });

  it('never serves one tenant a decision made for another', async () => {
    const tenantA = collectionApiFor(unexpiredTokenFor('user'), 'tenant-a');
    const tenantB = collectionApiFor(unexpiredTokenFor('user'), 'tenant-b');

    await tenantA.postEntitiesFilterSoftCall('production');
    await tenantB.postEntitiesFilterSoftCall('production');

    expect(tenantA.calls).toHaveLength(1);
    expect(tenantB.calls).toHaveLength(1);
  });

  it('separates the advanced permission checks by resolved entity id', async () => {
    const collectionApi = collectionApiFor(unexpiredTokenFor('user'));
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
