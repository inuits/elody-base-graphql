import { gql } from 'graphql-modules';
export const baseQueries = gql`
  query GetEntityDetailContextMenuActions {
    GetEntityDetailContextMenuActions {
      doElodyAction {
        label(input: "contextMenu.contextMenuElodyAction.share")
        action(input: Share)
        icon(input: "Link")
        __typename
      }
    }
  }

  query getGraphData($id: String!, $graph: GraphElementInput!) {
    GraphData(id: $id, graph: $graph)
  }

  # backs useManageEntities().addRelations, used by guided flow
  # (useRepetitiveForm.ts) to link a step's entity to another entity
  # without resubmitting the whole form.
  mutation AddEntityRelations(
    $id: String!
    $relations: [BaseRelationValuesInput!]!
    $collection: Collection!
  ) {
    addEntityRelations(id: $id, relations: $relations, collection: $collection)
  }
`;
