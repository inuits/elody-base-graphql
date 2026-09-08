import {
  type GraphQLResolveInfo,
  type SelectionNode,
  Kind,
  valueFromASTUntyped,
} from 'graphql';
import {
  Permission,
  PermissionRequestInfo,
} from '../generated-types/type-defs';
import { DataSources } from '../types';
import { getEntityId } from './helpers';
import { permissionsIgnored } from '../environment';

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

export const isEntityTypePermitted = async (
  entityType: string,
  neededPermission: string,
  dataSources: DataSources
): Promise<boolean> => {
  if (permissionsIgnored()) return true;

  if (neededPermission === Permission.Cancreate)
    return (
      (await dataSources.CollectionAPI.postEntitySoftCall(entityType)) === '200'
    );
  if (neededPermission === Permission.Canread)
    return (
      (await dataSources.CollectionAPI.postEntitiesFilterSoftCall(
        entityType
      )) === '200'
    );

  return false;
};

export const isPanelPermitted = async (
  info: GraphQLResolveInfo,
  parent: unknown,
  dataSources: DataSources,
  customPermissions: CustomPermissions
): Promise<boolean> => {
  const can = readSubFieldArgument(info, 'can', 'input');
  const permission = (Array.isArray(can) ? can[0] : can) as string | undefined;
  if (!permission) return true;

  if (
    await evaluateAdvancedPermission(permission, dataSources, customPermissions)
  )
    return true;

  return isEntityActionPermitted(permission, parent, dataSources);
};

export const mayUpdateEntity = async (
  entity: any,
  dataSources: DataSources
): Promise<boolean> =>
  (await dataSources.CollectionAPI.patchEntityDetailSoftCall(
    getEntityId(entity),
    entity.type
  )) === '200';

export const mayDeleteEntity = async (
  entity: any,
  dataSources: DataSources
): Promise<boolean> =>
  (await dataSources.CollectionAPI.delEntityDetailSoftCall(
    getEntityId(entity),
    entity.type
  )) === '200';

const isEntityActionPermitted = async (
  permission: string,
  parent: unknown,
  dataSources: DataSources
): Promise<boolean> => {
  const entity = parent as { type?: string };
  const [action, targetEntityType] = permission.split(':');
  if (!targetEntityType || targetEntityType !== entity?.type) return false;

  if (action === 'update') return mayUpdateEntity(entity, dataSources);
  if (action === 'delete') return mayDeleteEntity(entity, dataSources);
  return false;
};

type ContextMenuEntityRole = 'child' | 'parent';
const contextMenuEntityRoleKey = '__contextMenuEntityRole';

export const tagContextMenuEntityRole = (
  entity: unknown,
  role: ContextMenuEntityRole
): unknown => ({ ...(entity as object), [contextMenuEntityRoleKey]: role });

export const isContextMenuActionPermitted = async (
  info: GraphQLResolveInfo,
  parent: unknown,
  dataSources: DataSources,
  customPermissions: CustomPermissions,
  requestParentEntityId?: string
): Promise<boolean> => {
  const can = readSubFieldArgument(info, 'can', 'input');
  const permission = (Array.isArray(can) ? can[0] : can) as string | undefined;
  if (!permission) return true;

  const entityId = parent ? getEntityId(parent) : undefined;
  const isDetailWindow =
    (parent as any)?.[contextMenuEntityRoleKey] === 'parent';

  return evaluateAdvancedPermission(
    permission,
    dataSources,
    customPermissions,
    isDetailWindow ? entityId : requestParentEntityId,
    isDetailWindow ? undefined : entityId
  );
};

export const isCommentPostingPermitted = async (
  parent: unknown,
  dataSources: DataSources
): Promise<boolean> => {
  const entity = parent as { type: string };
  const [mayCreateComment, parentUpdateStatus] = await Promise.all([
    isEntityTypePermitted('comment', Permission.Cancreate, dataSources),
    dataSources.CollectionAPI.patchEntityDetailSoftCall(
      getEntityId(entity),
      entity.type
    ),
  ]);
  return mayCreateComment && parentUpdateStatus === '200';
};

export const isMenuItemPermitted = async (
  item: MenuItemPermissionInput,
  dataSources: DataSources,
  customPermissions: CustomPermissions
): Promise<boolean> => {
  if (item.requiresAuth === false) return true;

  if (item.can?.length)
    return evaluateAdvancedPermission(
      item.can[0],
      dataSources,
      customPermissions
    );

  if (!item.entityType) return true;

  return isEntityTypePermitted(
    item.entityType,
    item.neededPermission || Permission.Canread,
    dataSources
  );
};

export const filterPermittedOptions = async <
  T extends { can?: (string | null)[] | null },
>(
  options: T[],
  dataSources: DataSources,
  customPermissions: CustomPermissions,
  parentEntityId?: string
): Promise<T[]> => {
  const verdicts = await Promise.all(
    options.map((option) =>
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

export const readSubFieldArgument = (
  info: GraphQLResolveInfo,
  fieldName: string,
  argumentName: string
): unknown => {
  const selections: SelectionNode[] = info.fieldNodes.flatMap(
    (fieldNode) => fieldNode.selectionSet?.selections ?? []
  );

  while (selections.length) {
    const selection = selections.shift() as SelectionNode;
    if (selection.kind === Kind.FIELD) {
      if (selection.name.value !== fieldName) continue;
      const argument = selection.arguments?.find(
        (candidate) => candidate.name.value === argumentName
      );
      if (argument)
        return valueFromASTUntyped(argument.value, info.variableValues);
      continue;
    }
    if (selection.kind === Kind.INLINE_FRAGMENT) {
      selections.push(...selection.selectionSet.selections);
      continue;
    }
    const fragment = info.fragments[selection.name.value];
    if (fragment) selections.push(...fragment.selectionSet.selections);
  }

  return undefined;
};

export const isPermissionListSatisfied = async (
  can: unknown,
  parent: unknown,
  dataSources: DataSources,
  customPermissions: CustomPermissions
): Promise<boolean> => {
  const permissions = Array.isArray(can) ? can : can ? [can] : [];
  if (!permissions.length) return true;

  return evaluateAdvancedPermission(
    permissions[0] as string,
    dataSources,
    customPermissions,
    parent ? getEntityId(parent) : undefined
  );
};

export const isElementPermitted = async (
  info: GraphQLResolveInfo,
  parent: unknown,
  dataSources: DataSources,
  customPermissions: CustomPermissions,
  fieldName: string = 'can'
): Promise<boolean> =>
  isPermissionListSatisfied(
    readSubFieldArgument(info, fieldName, 'input'),
    parent,
    dataSources,
    customPermissions
  );
