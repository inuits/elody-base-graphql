import { Permission, PermissionRequestInfo } from '../generated-types/type-defs';
import { DataSources } from '../types';

export type CustomPermissions = { [key: string]: PermissionRequestInfo };

export const evaluateAdvancedPermission = async (
  permission: string,
  dataSources: DataSources,
  customPermissions: CustomPermissions,
  parentEntityId?: string,
  childEntityId?: string
): Promise<boolean> => {
  const permissionConfig = customPermissions?.[permission];
  if (!permissionConfig) return false;

  try {
    if (permissionConfig.datasource === 'CollectionAPI')
      return await dataSources.CollectionAPI.checkAdvancedPermission(
        permissionConfig,
        parentEntityId,
        childEntityId
      );
    if (permissionConfig.datasource === 'GraphqlAPI')
      return await dataSources.GraphqlAPI.checkAdvancedPermission(
        permissionConfig
      );
    return false;
  } catch (error) {
    console.error(`Error checking permission ${permission}:`, error);
    return false;
  }
};

type MenuItemPermissionInput = {
  can?: string[] | null;
  entityType?: string | null;
  requiresAuth?: boolean | null;
  neededPermission?: string | null;
};

export const isMenuItemPermitted = async (
  item: MenuItemPermissionInput,
  dataSources: DataSources,
  customPermissions: CustomPermissions
): Promise<boolean> => {
  if (item.requiresAuth === false) return true;

  // Only the first entry is evaluated, which is what the frontend did.
  if (item.can?.length)
    return evaluateAdvancedPermission(
      item.can[0],
      dataSources,
      customPermissions
    );

  if (!item.entityType) return true;

  const neededPermission = item.neededPermission || Permission.Canread;
  if (neededPermission === Permission.Cancreate)
    return (
      (await dataSources.CollectionAPI.postEntitySoftCall(item.entityType)) ===
      '200'
    );
  if (neededPermission === Permission.Canread)
    return (
      (await dataSources.CollectionAPI.postEntitiesFilterSoftCall(
        item.entityType
      )) === '200'
    );

  // ponytail: canupdate/candelete were always false here, because the mapping
  // the frontend read only ever carried canread and cancreate. Kept false so
  // menus do not silently gain entries; give them a real soft call when a
  // client actually needs one.
  return false;
};

export const filterPermittedOptions = async <
  T extends { can?: (string | null)[] | null }
>(
  options: T[],
  dataSources: DataSources,
  customPermissions: CustomPermissions,
  parentEntityId?: string
): Promise<T[]> => {
  const verdicts = await Promise.all(
    options.map((option) =>
      // Only the first entry is evaluated, which is what the frontend did.
      option.can?.length
        ? evaluateAdvancedPermission(
            option.can[0] as string,
            dataSources,
            customPermissions,
            parentEntityId
          )
        : true
    )
  );
  return options.filter((_option, index) => verdicts[index]);
};
