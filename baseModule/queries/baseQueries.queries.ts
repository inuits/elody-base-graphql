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

  query GetMergePreview($id: String!, $collection: Collection!) {
    mergePreview(id: $id, collection: $collection) {
      inboundReferenceCount
    }
  }

  query GetMergeEvaluations(
    $ids: [String!]!
    $collection: Collection!
    $strategy: MergeSurvivorStrategy!
  ) {
    mergeEvaluations(ids: $ids, collection: $collection, strategy: $strategy) {
      id
      strategy
      status
      score
      details
      immutableFields {
        key
        identityValue
      }
    }
  }

  mutation MergeEntities(
    $survivorId: String!
    $victimId: String!
    $formInput: EntityFormInput!
    $collection: Collection!
  ) {
    mergeEntities(
      survivorId: $survivorId
      victimId: $victimId
      formInput: $formInput
      collection: $collection
    ) {
      id
      uuid
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
    $relationTypesToClear: [String!]
    $collection: Collection
  ) {
    bulkEditEntities(
      ids: $ids
      metadata: $metadata
      relationsToAdd: $relationsToAdd
      relationsToRemove: $relationsToRemove
      relationsToReplace: $relationsToReplace
      relationTypesToClear: $relationTypesToClear
      collection: $collection
    ) {
      succeededIds
      failedIds
    }
  }

  query GetRelationLabelsForIds(
    $ids: [String!]!
    $types: [String!]!
    $historyKeys: [String!]
    $keyAsLabel: KeyAsLabelInput
  ) {
    RelationLabelsForIds(
      ids: $ids
      types: $types
      historyKeys: $historyKeys
      keyAsLabel: $keyAsLabel
    ) {
      key
      value
    }
  }

  query GetEntityHistoryVersionList(
    $limit: Int
    $skip: Int
    $advancedFilterInputs: [AdvancedFilterInput!]!
  ) {
    Entities: EntityHistoryVersionList(
      limit: $limit
      skip: $skip
      advancedFilterInputs: $advancedFilterInputs
    ) {
      count
      limit
      results {
        ...minimalBaseEntity
        intialValues {
          version: keyValue(key: "version", source: metadata)
          edited_by: keyValue(key: "edited_by", source: metadata)
          edited_at: keyValue(key: "edited_at", source: metadata)
        }
        allowedViewModes {
          viewModes(input: [{ viewMode: ViewModesList }]) {
            ...viewModes
          }
        }
        teaserMetadata {
          version: metaData {
            label(input: "history.version")
            key(input: "version")
          }
          edited_by: metaData {
            label(input: "metadata.labels.modified-by")
            key(input: "edited_by")
          }
          edited_at: metaData {
            label(input: "metadata.labels.modified-at")
            key(input: "edited_at")
            unit(input: DATETIME_DEFAULT)
          }
        }
      }
    }
  }

  query GetEntityHistoryVersionListFilters($entityType: String!) {
    EntityTypeFilters(type: $entityType) {
      advancedFilters {
        type: advancedFilter(type: type) {
          type
          defaultValue(value: "$entity.type")
          hidden(value: true)
        }
        id: advancedFilter(type: selection, key: ["id"]) {
          type
          key
          defaultValue(value: "$entity.id")
          hidden(value: true)
        }
      }
    }
  }

  query GetEntityHistoryVersionListBulkOperations {
    CustomBulkOperations {
      bulkOperationOptions {
        options(input: []) {
          value
        }
      }
    }
  }
`;
