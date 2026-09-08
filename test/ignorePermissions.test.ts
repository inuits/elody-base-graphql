import { describe, it, expect, afterEach, vi } from 'vitest';
import { Permission } from '../generated-types/type-defs';
import { setCurrentEnvironment } from '../environment';
import {
  evaluateAdvancedPermission,
  isEntityTypePermitted,
} from '../helpers/permissions';

const dataSourcesDenying = () => {
  const postEntitiesFilterSoftCall = vi.fn().mockResolvedValue('401');
  const postEntitySoftCall = vi.fn().mockResolvedValue('401');
  const checkAdvancedPermission = vi.fn().mockResolvedValue(false);
  return {
    dataSources: {
      CollectionAPI: {
        postEntitiesFilterSoftCall,
        postEntitySoftCall,
        checkAdvancedPermission,
      },
      GraphqlAPI: { checkAdvancedPermission: vi.fn() },
    } as any,
    postEntitiesFilterSoftCall,
    postEntitySoftCall,
    checkAdvancedPermission,
  };
};

const withIgnorePermissions = (ignorePermissions: boolean) =>
  setCurrentEnvironment({ ignorePermissions } as any);

describe('IGNORE_PERMISSIONS', () => {
  afterEach(() => withIgnorePermissions(false));

  it('grants read and create on an entity type without calling collection-api', async () => {
    withIgnorePermissions(true);
    const { dataSources, postEntitiesFilterSoftCall, postEntitySoftCall } =
      dataSourcesDenying();

    expect(
      await isEntityTypePermitted('production', Permission.Canread, dataSources)
    ).toBe(true);
    expect(
      await isEntityTypePermitted(
        'production',
        Permission.Cancreate,
        dataSources
      )
    ).toBe(true);
    expect(postEntitiesFilterSoftCall).not.toHaveBeenCalled();
    expect(postEntitySoftCall).not.toHaveBeenCalled();
  });

  it('still enforces advanced permissions, as it always did', async () => {
    withIgnorePermissions(true);
    const { dataSources, checkAdvancedPermission } = dataSourcesDenying();

    expect(
      await evaluateAdvancedPermission('update:production', dataSources, {
        'update:production': { datasource: 'CollectionAPI' } as any,
      })
    ).toBe(false);
    expect(checkAdvancedPermission).toHaveBeenCalled();
  });

  it('leaves the entity type check enforced when off', async () => {
    const { dataSources, postEntitiesFilterSoftCall } = dataSourcesDenying();

    expect(
      await isEntityTypePermitted('production', Permission.Canread, dataSources)
    ).toBe(false);
    expect(postEntitiesFilterSoftCall).toHaveBeenCalledWith('production');
  });
});
