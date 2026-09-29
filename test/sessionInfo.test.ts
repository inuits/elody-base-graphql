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

const tokenWith = (claims: object) => {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return `header.${payload}.signature`;
};

const collectionApiWith = (claims: object) => {
  const api = new CollectionAPI({
    environment: {
      api: { collectionApiUrl: 'http://collection-api' },
      customization: { applicationLocale: 'en' },
    } as any,
    session: { auth: { accessToken: tokenWith(claims) } },
  });
  const getElodyUser = vi.fn(async () => undefined);
  (api as any).getElodyUser = getElodyUser;
  return { api, getElodyUser };
};

describe('getSessionInfo', () => {
  it('reads a flat claim', async () => {
    const { api, getElodyUser } = collectionApiWith({
      'elody-roles': ['cultuurconnect'],
    });

    expect(await api.getSessionInfo('elody-roles')).toEqual(['cultuurconnect']);
    expect(getElodyUser).not.toHaveBeenCalled();
  });

  it('walks a dotted path into a nested claim', async () => {
    const { api, getElodyUser } = collectionApiWith({
      resource_access: { 'dams-dashboard': { roles: ['dams_admin'] } },
    });

    expect(
      await api.getSessionInfo('resource_access.dams-dashboard.roles')
    ).toEqual(['dams_admin']);
    expect(getElodyUser).not.toHaveBeenCalled();
  });

  it('prefers a flat claim whose own name contains dots', async () => {
    const { api } = collectionApiWith({
      'a.b': 'flat',
      a: { b: 'nested' },
    });

    expect(await api.getSessionInfo('a.b')).toBe('flat');
  });

  it('falls back to the elody user when the path resolves to nothing', async () => {
    const { api, getElodyUser } = collectionApiWith({ email: 'a@b.c' });

    await api.getSessionInfo('resource_access.dams-dashboard.roles');

    expect(getElodyUser).toHaveBeenCalled();
  });

  it('does not mistake a partial path for a value', async () => {
    const { api, getElodyUser } = collectionApiWith({
      resource_access: { 'dams-dashboard': {} },
    });

    await api.getSessionInfo('resource_access.dams-dashboard.roles');

    expect(getElodyUser).toHaveBeenCalled();
  });
});
