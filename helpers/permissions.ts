import {
  type GraphQLResolveInfo,
  type SelectionNode,
  Kind,
  valueFromASTUntyped,
} from 'graphql';
import { Permission, PermissionRequestInfo } from '../generated-types/type-defs';
import { DataSources } from '../types';
import { getEntityId } from './helpers';

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

// The `can` of an element sits on a sub-field of that element, so the resolver
// that has to leave the element out has to read it back off the query itself.
// Fragment spreads and variables are resolved, because client query documents
// use both.
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

// Every element resolver receives the entity document as its source, so the
// `$parentEntityId` an element permission substitutes needs no request header.
export const isElementPermitted = async (
  info: GraphQLResolveInfo,
  parent: unknown,
  dataSources: DataSources,
  customPermissions: CustomPermissions
): Promise<boolean> => {
  const can = readSubFieldArgument(info, 'can', 'input');
  const permissions = Array.isArray(can) ? can : can ? [can] : [];
  if (!permissions.length) return true;

  // Only the first entry is evaluated, which is what the frontend did.
  return evaluateAdvancedPermission(
    permissions[0] as string,
    dataSources,
    customPermissions,
    parent ? getEntityId(parent) : undefined
  );
};
