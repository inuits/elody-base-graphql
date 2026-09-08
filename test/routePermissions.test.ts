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
      { path: '/:tenant?/:type/:id', name: 'SingleEntity', meta: { slug: 'x' } },
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
