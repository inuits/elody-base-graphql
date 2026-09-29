import { describe, it, expect, vi } from 'vitest';
import { substitutePermissionPlaceholders } from '../helpers/permissionPlaceholders';
import { isPermissionListSatisfied } from '../helpers/permissions';

const permissionConfig = {
  datasource: 'CollectionAPI',
  crud: 'get',
  uri: '/entities/$userUuid?key_to_check=properties.ref_organizations[].roles',
  body: {},
} as any;

const uriOf = (substituted: string) => JSON.parse(substituted).uri;

describe('substitutePermissionPlaceholders', () => {
  it('substitutes a string query variable', () => {
    const substituted = substitutePermissionPlaceholders(
      permissionConfig,
      undefined,
      undefined,
      { userUuid: 'US-1' }
    );

    expect(uriOf(substituted)).toBe(
      '/entities/US-1?key_to_check=properties.ref_organizations[].roles'
    );
  });

  it('leaves the placeholder alone when the variable is absent', () => {
    expect(uriOf(substitutePermissionPlaceholders(permissionConfig))).toBe(
      '/entities/$userUuid?key_to_check=properties.ref_organizations[].roles'
    );
  });

  it('ignores non-string and empty variables', () => {
    const substituted = substitutePermissionPlaceholders(
      permissionConfig,
      undefined,
      undefined,
      { userUuid: { nested: true } }
    );

    expect(uriOf(substituted)).toContain('$userUuid');
  });

  it('does not let a shorter variable name eat a longer one', () => {
    const substituted = substitutePermissionPlaceholders(
      permissionConfig,
      undefined,
      undefined,
      { user: 'WRONG', userUuid: 'US-1' }
    );

    expect(uriOf(substituted)).toBe(
      '/entities/US-1?key_to_check=properties.ref_organizations[].roles'
    );
  });

  it('keeps $parentEntityId winning over a same-named variable', () => {
    const substituted = substitutePermissionPlaceholders(
      { ...permissionConfig, uri: '/entities/$parentEntityId' },
      'US-parent',
      undefined,
      { parentEntityId: 'US-variable' }
    );

    expect(uriOf(substituted)).toBe('/entities/US-parent');
  });
});

describe('isPermissionListSatisfied', () => {
  it('forwards query variables to the datasource', async () => {
    const checkAdvancedPermission = vi.fn(async () => true);

    await isPermissionListSatisfied(
      ['read:user:field:roles'],
      undefined,
      { CollectionAPI: { checkAdvancedPermission } } as any,
      { 'read:user:field:roles': permissionConfig } as any,
      { userUuid: 'US-1' }
    );

    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      permissionConfig,
      undefined,
      undefined,
      { userUuid: 'US-1' }
    );
  });
});
