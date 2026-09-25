import { describe, it, expect, vi } from 'vitest';
import { resolveRoutePermissions } from '../endpoints/appConfigEndpoint';

// The only route permission any client configures today: an entity-type read
// with a static body, so it substitutes no entity id.
const permissions = {
  'read:iot-device-anpr:overview': {
    datasource: 'CollectionAPI',
    crud: 'post',
    uri: '/entities/filter',
    body: [{ type: 'type', value: 'iot_device' }],
  },
} as any;

const requestContextGranting = (granted: string[]) => {
  const checkAdvancedPermission = vi.fn(async (config: any) =>
    granted.includes(config.uri)
  );
  return {
    requestContext: {
      buildDataSources: () => ({
        CollectionAPI: { checkAdvancedPermission },
        GraphqlAPI: { checkAdvancedPermission: vi.fn() },
      }),
      permissions,
      features: {},
    } as any,
    checkAdvancedPermission,
  };
};

const routerConfig = [
  {
    path: '/:tenant?/devices-anpr',
    name: 'Home',
    meta: {
      alternativeRoutes: { fallback: '/devices-tt' },
      can: ['read:iot-device-anpr:overview'],
      slug: 'devices-anpr',
    },
    children: [
      {
        path: '/:tenant?/:type/:id',
        name: 'SingleEntity',
        meta: { slug: 'x' },
      },
      {
        path: '/:tenant?/devices-anpr',
        name: 'navigation.devices-anpr',
        meta: {
          alternativeRoutes: { fallback: '/devices-tt' },
          can: ['read:iot-device-anpr:overview'],
        },
      },
    ],
  },
];

describe('resolveRoutePermissions', () => {
  it('marks a route the user may reach as permitted, on every nesting level', async () => {
    const { requestContext } = requestContextGranting(['/entities/filter']);

    const resolved: any = await resolveRoutePermissions(
      {},
      routerConfig as any,
      requestContext
    );

    expect(resolved[0].meta.permitted).toBe(true);
    expect(resolved[0].children[1].meta.permitted).toBe(true);
  });

  it('marks a route the user may not reach as not permitted', async () => {
    const { requestContext } = requestContextGranting([]);

    const resolved: any = await resolveRoutePermissions(
      {},
      routerConfig as any,
      requestContext
    );

    expect(resolved[0].meta.permitted).toBe(false);
    expect(resolved[0].children[1].meta.permitted).toBe(false);
  });

  it('never ships the permission itself, only the verdict', async () => {
    const { requestContext } = requestContextGranting([]);

    const resolved: any = await resolveRoutePermissions(
      {},
      routerConfig as any,
      requestContext
    );

    expect(resolved[0].meta.can).toBeUndefined();
    expect(resolved[0].meta.alternativeRoutes).toEqual({
      fallback: '/devices-tt',
    });
    expect(resolved[0].meta.slug).toBe('devices-anpr');
  });

  it('leaves a route that gates nothing alone, without calling out', async () => {
    const { requestContext, checkAdvancedPermission } = requestContextGranting(
      []
    );

    const resolved: any = await resolveRoutePermissions(
      {},
      [{ path: '/', name: 'Home', meta: { slug: 'home' } }] as any,
      requestContext
    );

    expect(resolved[0].meta).toEqual({ slug: 'home' });
    expect('permitted' in resolved[0].meta).toBe(false);
    expect(checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('hands the config straight back when nothing can be asked', async () => {
    expect(await resolveRoutePermissions({}, routerConfig as any)).toBe(
      routerConfig
    );
    expect(await resolveRoutePermissions({}, undefined)).toBeUndefined();
  });
});

const landingRedirect = {
  route: '/notifications',
  entityType: 'user',
  filters: [
    { type: 'type', value: 'user', match_exact: true },
    {
      type: 'text',
      key: ['podiumnet:1|identifiers'],
      value: 'session-$id',
      match_exact: true,
    },
    {
      type: 'boolean',
      key: 'lookup.virtual_relations.ref_organizations.properties.is_venue.value',
      value: true,
    },
  ],
};

const requestContextMatching = (matches: boolean) => {
  const hasMatchingEntities = vi.fn(async () => matches);
  const getSessionInfo = vi.fn(async (key?: string) =>
    key === 'id' ? 'US-85LGT5F93' : ''
  );
  return {
    requestContext: {
      buildDataSources: () => ({
        CollectionAPI: {
          hasMatchingEntities,
          getSessionInfo,
          checkAdvancedPermission: vi.fn(async () => false),
        },
        GraphqlAPI: { checkAdvancedPermission: vi.fn() },
      }),
      permissions,
      features: {},
    } as any,
    hasMatchingEntities,
    getSessionInfo,
  };
};

describe('resolveRoutePermissions landing redirect', () => {
  it('ships the landing route when the predicate matches', async () => {
    const { requestContext } = requestContextMatching(true);

    const resolved: any = await resolveRoutePermissions(
      {},
      [{ path: '/', name: 'Home', meta: { landingRedirect } }] as any,
      requestContext
    );

    expect(resolved[0].meta.landingRoute).toBe('/notifications');
    expect(resolved[0].meta.landingRedirect).toBeUndefined();
  });

  it('ships no landing route when the predicate does not match', async () => {
    const { requestContext } = requestContextMatching(false);

    const resolved: any = await resolveRoutePermissions(
      {},
      [{ path: '/', name: 'Home', meta: { landingRedirect } }] as any,
      requestContext
    );

    expect('landingRoute' in resolved[0].meta).toBe(false);
    expect(resolved[0].meta.landingRedirect).toBeUndefined();
  });

  it('substitutes session values into the filters before asking', async () => {
    const { requestContext, hasMatchingEntities, getSessionInfo } =
      requestContextMatching(true);

    await resolveRoutePermissions(
      {},
      [{ path: '/', name: 'Home', meta: { landingRedirect } }] as any,
      requestContext
    );

    expect(getSessionInfo).toHaveBeenCalledWith('id');
    expect(hasMatchingEntities).toHaveBeenCalledWith('user', [
      landingRedirect.filters[0],
      { ...landingRedirect.filters[1], value: 'US-85LGT5F93' },
      landingRedirect.filters[2],
    ]);
  });

  // The route it is configured on carries no `can` at all, so the permission
  // short-circuit must not swallow it.
  it('resolves a route that carries a landing redirect but no permission', async () => {
    const { requestContext, hasMatchingEntities } =
      requestContextMatching(true);

    const resolved: any = await resolveRoutePermissions(
      {},
      [
        {
          path: '/',
          name: 'Home',
          meta: { slug: 'home', landingRedirect },
          children: [
            { path: '/notifications', name: 'Notifications', meta: {} },
          ],
        },
      ] as any,
      requestContext
    );

    expect(hasMatchingEntities).toHaveBeenCalledOnce();
    expect(resolved[0].meta.slug).toBe('home');
    expect(resolved[0].meta.landingRoute).toBe('/notifications');
    expect(resolved[0].children[0].meta).toEqual({});
  });
});
