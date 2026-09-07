import { describe, it, expect, vi } from 'vitest';
import { isMenuItemPermitted } from '../helpers/permissions';

const dataSourcesWith = (overrides: any = {}) =>
  ({
    CollectionAPI: {
      checkAdvancedPermission: vi.fn().mockResolvedValue(false),
      postEntitiesFilterSoftCall: vi.fn().mockResolvedValue('401'),
      postEntitySoftCall: vi.fn().mockResolvedValue('401'),
      ...overrides,
    },
    GraphqlAPI: { checkAdvancedPermission: vi.fn().mockResolvedValue(false) },
  }) as any;

const customPermissions = {
  'read:production:overview': {
    datasource: 'CollectionAPI',
    crud: 'post',
    uri: '/entities/filter',
    body: {},
  },
} as any;

describe('isMenuItemPermitted', () => {
  it('permits an item that opts out of auth without any call', async () => {
    const dataSources = dataSourcesWith();

    expect(
      await isMenuItemPermitted(
        { requiresAuth: false, entityType: 'production' },
        dataSources,
        customPermissions
      )
    ).toBe(true);
    expect(
      dataSources.CollectionAPI.postEntitiesFilterSoftCall
    ).not.toHaveBeenCalled();
  });

  it('follows the advanced permission when the item declares one', async () => {
    const granted = dataSourcesWith({
      checkAdvancedPermission: vi.fn().mockResolvedValue(true),
    });
    const denied = dataSourcesWith();

    expect(
      await isMenuItemPermitted(
        { can: ['read:production:overview'] },
        granted,
        customPermissions
      )
    ).toBe(true);
    expect(
      await isMenuItemPermitted(
        { can: ['read:production:overview'] },
        denied,
        customPermissions
      )
    ).toBe(false);
  });

  it('denies an advanced permission that no client configured', async () => {
    expect(
      await isMenuItemPermitted(
        { can: ['read:nothing:configured'] },
        dataSourcesWith({
          checkAdvancedPermission: vi.fn().mockResolvedValue(true),
        }),
        customPermissions
      )
    ).toBe(false);
  });

  it('falls back to a read check on the entity type', async () => {
    const dataSources = dataSourcesWith({
      postEntitiesFilterSoftCall: vi.fn().mockResolvedValue('200'),
    });

    expect(
      await isMenuItemPermitted(
        { entityType: 'production' },
        dataSources,
        customPermissions
      )
    ).toBe(true);
    expect(
      dataSources.CollectionAPI.postEntitiesFilterSoftCall
    ).toHaveBeenCalledWith('production');
  });

  it('uses a create check for an item whose modal needs cancreate', async () => {
    const dataSources = dataSourcesWith({
      postEntitySoftCall: vi.fn().mockResolvedValue('200'),
    });

    expect(
      await isMenuItemPermitted(
        { entityType: 'work_computer_file', neededPermission: 'cancreate' },
        dataSources,
        customPermissions
      )
    ).toBe(true);
    expect(dataSources.CollectionAPI.postEntitySoftCall).toHaveBeenCalledWith(
      'work_computer_file'
    );
    expect(
      dataSources.CollectionAPI.postEntitiesFilterSoftCall
    ).not.toHaveBeenCalled();
  });

  it('denies a read-gated item the user cannot read', async () => {
    expect(
      await isMenuItemPermitted(
        { entityType: 'production' },
        dataSourcesWith(),
        customPermissions
      )
    ).toBe(false);
  });

  it('permits a grouping item so its surviving children can render', async () => {
    const dataSources = dataSourcesWith();

    expect(
      await isMenuItemPermitted({ label: 'group' } as any, dataSources, customPermissions)
    ).toBe(true);
    expect(
      dataSources.CollectionAPI.postEntitiesFilterSoftCall
    ).not.toHaveBeenCalled();
  });

  it('keeps canupdate and candelete items hidden, as the mapping did', async () => {
    const dataSources = dataSourcesWith({
      postEntitiesFilterSoftCall: vi.fn().mockResolvedValue('200'),
      postEntitySoftCall: vi.fn().mockResolvedValue('200'),
    });

    for (const neededPermission of ['canupdate', 'candelete']) {
      expect(
        await isMenuItemPermitted(
          { entityType: 'production', neededPermission },
          dataSources,
          customPermissions
        )
      ).toBe(false);
    }
  });
});
