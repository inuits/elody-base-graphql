import { describe, it, expect, vi } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

// Mirrors the two shapes clients configure on a panel metadata field: a read
// gate on the field and a write gate on the entity.
const customPermissions = {
  'read:gps_coordinates:field': {
    datasource: 'CollectionAPI',
    crud: 'get',
    uri: '/entities/$parentEntityId/fields/gps',
    body: {},
  },
  'update:asset:field:access': {
    datasource: 'CollectionAPI',
    crud: 'patch',
    uri: '/entities/$parentEntityId',
    body: {},
  },
} as any;

const contextGranting = (granted: string[]) => ({
  dataSources: {
    CollectionAPI: {
      checkAdvancedPermission: vi.fn(async (config: any, parent?: string) =>
        granted.includes(
          parent ? config.uri.replace(/\$parentEntityId/g, parent) : config.uri
        )
      ),
    },
    GraphqlAPI: { checkAdvancedPermission: vi.fn() },
  },
  customPermissions,
});

const resolvePanelMetaData = (
  field: 'permitted' | 'readOnly',
  input: string[] | undefined,
  granted: string[]
) => {
  const context = contextGranting(granted);
  return {
    verdict: (baseResolver.PanelMetaData as any)[field](
      { _id: 'SITE-1', type: 'site' },
      { input },
      context
    ) as Promise<boolean>,
    checkAdvancedPermission:
      context.dataSources.CollectionAPI.checkAdvancedPermission,
  };
};

describe('panel metadata field permissions', () => {
  it('marks a field the user may read as permitted', async () => {
    const { verdict } = resolvePanelMetaData(
      'permitted',
      ['read:gps_coordinates:field'],
      ['/entities/SITE-1/fields/gps']
    );

    expect(await verdict).toBe(true);
  });

  it('marks a field the user may not read as not permitted', async () => {
    const { verdict } = resolvePanelMetaData(
      'permitted',
      ['read:gps_coordinates:field'],
      []
    );

    expect(await verdict).toBe(false);
  });

  it('marks a field the user may not change as read only', async () => {
    const { verdict } = resolvePanelMetaData(
      'readOnly',
      ['update:asset:field:access'],
      []
    );

    expect(await verdict).toBe(true);
  });

  it('leaves a field the user may change writable', async () => {
    const { verdict } = resolvePanelMetaData(
      'readOnly',
      ['update:asset:field:access'],
      ['/entities/SITE-1']
    );

    expect(await verdict).toBe(false);
  });

  it('keeps a field selecting no permission visible and writable, without calling out', async () => {
    const permitted = resolvePanelMetaData('permitted', undefined, []);
    const readOnly = resolvePanelMetaData('readOnly', [], []);

    expect(await permitted.verdict).toBe(true);
    expect(await readOnly.verdict).toBe(false);
    expect(permitted.checkAdvancedPermission).not.toHaveBeenCalled();
    expect(readOnly.checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('resolves each verdict against its own permission, not the other one', async () => {
    const readable = resolvePanelMetaData(
      'permitted',
      ['read:gps_coordinates:field'],
      ['/entities/SITE-1']
    );

    expect(await readable.verdict).toBe(false);
  });
});
