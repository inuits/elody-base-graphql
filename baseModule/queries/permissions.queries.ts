  // @ts-ignore
import { gql } from 'graphql-modules';

export const permissionsQuery = gql`
  query GetPermissionMapping($entities: [String]!) {
    PermissionMapping(entities: $entities)
  }

  query GetAdvancedPermission(
    $permission: String!
    $parentEntityId: String
    $childEntityId: String
  ) {
    AdvancedPermission(
      permission: $permission,
      parentEntityId: $parentEntityId,
      childEntityId: $childEntityId
    )
  }
`;