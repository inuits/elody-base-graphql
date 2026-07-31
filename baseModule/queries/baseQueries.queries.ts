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

  # Count-only listing query used to fetch the exact total on demand (when the
  # user clicks the capped "<cap>+" indicator). Shared across clients: it only
  # depends on the base filter types, not on any client's entity fragments, and
  # selects nothing but count so it stays cheap. Pass exactCount: true to bypass
  # the backend count cap.
  query GetEntitiesCount(
    $type: Entitytyping
    $limit: Int
    $skip: Int
    $searchValue: SearchFilter!
    $advancedSearchValue: [FilterInput]
    $advancedFilterInputs: [AdvancedFilterInput!]!
    $searchInputType: SearchInputType
    $exactCount: Boolean
  ) {
    Entities(
      type: $type
      limit: $limit
      skip: $skip
      searchValue: $searchValue
      advancedSearchValue: $advancedSearchValue
      advancedFilterInputs: $advancedFilterInputs
      searchInputType: $searchInputType
      exactCount: $exactCount
    ) {
      count
    }
  }

  mutation AddEntityRelations(
    $id: String!
    $relations: [BaseRelationValuesInput!]!
    $collection: Collection!
  ) {
    addEntityRelations(id: $id, relations: $relations, collection: $collection)
  }
`;
