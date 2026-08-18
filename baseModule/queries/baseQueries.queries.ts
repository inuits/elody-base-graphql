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

  mutation BulkUpdateEntitiesWithJson($documents: [JSON!]!) {
    bulkUpdateEntitiesWithJson(documents: $documents) {
      succeededIds
      failedIds
    }
  }

  mutation BulkEditEntities(
    $ids: [String!]!
    $metadata: [MetadataValuesInput!]!
    $relationsToAdd: [BaseRelationValuesInput!]!
    $relationsToRemove: [BaseRelationValuesInput!]!
    $relationsToReplace: [BaseRelationValuesInput!]!
    $collection: Collection
  ) {
    bulkEditEntities(
      ids: $ids
      metadata: $metadata
      relationsToAdd: $relationsToAdd
      relationsToRemove: $relationsToRemove
      relationsToReplace: $relationsToReplace
      collection: $collection
    ) {
      succeededIds
      failedIds
    }
  }
`;
