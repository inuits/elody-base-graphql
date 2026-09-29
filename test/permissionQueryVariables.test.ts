import { describe, it, expect, vi } from 'vitest';
import { CollectionAPI } from '../sources/collection';
import { isPermissionListSatisfied } from '../helpers/permissions';

const permissionConfig = {
  datasource: 'CollectionAPI',
  crud: 'get',
  uri: '/entities/$userUuid?key_to_check=properties.ref_organizations[].roles',
  body: {},
} as any;

// checkAdvancedPermission only needs the uri it ends up calling, so drive the
// real method with a stub `this` that reports the request it would have made.
const requestedUri = async (
  config: any,
  parentEntityId: string | undefined,
  childEntityId: string | undefined,
  queryVariables: Record<string, unknown> | undefined
): Promise<string> => {
  let called = '';
  const self = {
    cachedPermissionCall: async (key: string[]) => {
      called = key[2];
      return true;
    },
  };
  await CollectionAPI.prototype.checkAdvancedPermission.call(
    self as any,
    config,
    parentEntityId,
    childEntityId,
    queryVariables as any
  );
  return called;
};

describe('permission uris referencing query variables', () => {
  it('substitutes a string query variable into the uri', async () => {
    expect(
      await requestedUri(permissionConfig, undefined, undefined, {
        userUuid: 'US-1',
      })
    ).toBe(
      'entities/US-1?key_to_check=properties.ref_organizations[].roles&soft=1'
    );
  });

  it('leaves the placeholder alone when the variable is absent', async () => {
    expect(await requestedUri(permissionConfig, undefined, undefined, {})).toBe(
      'entities/$userUuid?key_to_check=properties.ref_organizations[].roles&soft=1'
    );
  });

  it('ignores non-string and empty variables', async () => {
    expect(
      await requestedUri(permissionConfig, undefined, undefined, {
        userUuid: { nested: true },
      })
    ).toBe(
      'entities/$userUuid?key_to_check=properties.ref_organizations[].roles&soft=1'
    );
  });

  it('keeps $parentEntityId winning over a same-named variable', async () => {
    const config = { ...permissionConfig, uri: '/entities/$parentEntityId' };
    expect(
      await requestedUri(config, 'US-parent', undefined, {
        parentEntityId: 'US-variable',
      })
    ).toBe('entities/US-parent?soft=1');
  });

  it('gives a distinct cache key per substitution', async () => {
    const first = await requestedUri(permissionConfig, undefined, undefined, {
      userUuid: 'US-1',
    });
    const second = await requestedUri(permissionConfig, undefined, undefined, {
      userUuid: 'US-2',
    });
    expect(first).not.toBe(second);
  });
});

describe('isPermissionListSatisfied', () => {
  it('forwards query variables to the datasource', async () => {
    const checkAdvancedPermission = vi.fn(async () => true);
    await isPermissionListSatisfied(
      ['read:user:field:roles'],
      { id: 'ORG-1' },
      { CollectionAPI: { checkAdvancedPermission } } as any,
      { 'read:user:field:roles': permissionConfig } as any,
      { userUuid: 'US-1' }
    );
    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      permissionConfig,
      'ORG-1',
      undefined,
      { userUuid: 'US-1' }
    );
  });
});
