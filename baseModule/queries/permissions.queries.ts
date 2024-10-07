  // @ts-ignore
import { gql } from 'graphql-modules';

export const permissionsQuery = gql`
  query GetPermissionMapping($entities: [String]!) {
    PermissionMapping(entities: $entities)
  }

  query GetAdvancedPermission($permission: String!) {
    AdvancedPermission(permission: $permission)
  }
`;