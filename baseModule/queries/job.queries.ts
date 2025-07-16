// @ts-ignore
import { gql } from 'graphql-modules';

export const jobQueries = gql`
  fragment minimalJob on Job {
    intialValues {
      date_created: keyValue(key: "date_created", source: root)
      started_at: keyValue(key: "started_at", source: root)
      info: keyValue(key: "info", source: metadata)
      last_editor: keyValue(key: "last_editor", source: root)
      name: keyValue(key: "name", source: metadata)
      slug: keyValue(key: "_id", source: root)
      status: keyValue(key: "status", source: metadata, formatter: "pill")
      title: keyValue(key: "name", source: metadata)
      type: keyValue(key: "type", source: metadata)
    }
    allowedViewModes {
      viewModes(input: [
        { viewMode: ViewModesList }
      ]) {
        ...viewModes
      }
    }
    teaserMetadata {
      type: metaData {
        label(input: "metadata.labels.type")
        key(input: "type")
      }
      name: metaData {
        label(input: "metadata.labels.name")
        key(input: "name")
      }
      status: metaData {
        label(input: "metadata.labels.status")
        key(input: "status")
      }
      info: metaData {
        label(input: "metadata.labels.info")
        key(input: "info")
      }
      date_created: metaData {
        label(input: "metadata.labels.created-at")
        key(input: "date_created")
        unit(input: DATETIME_DEFAULT)
      }
      started_at: metaData {
        label(input: "metadata.labels.started-at")
        key(input: "started_at")
        unit(input: DATETIME_DEFAULT)
      }
      last_editor: metaData {
        label(input: "metadata.labels.started-by")
        key(input: "last_editor")
      }
    }
    ...minimalBaseEntity
  }

  fragment fullJob on Job {
    intialValues {
      date_created: keyValue(key: "date_created", source: root)
      started_at: keyValue(key: "started_at", source: root)
      date_updated: keyValue(key: "date_updated", source: root)
      info: keyValue(key: "info", source: metadata)
      last_editor: keyValue(key: "last_editor", source: root)
      name: keyValue(key: "name", source: metadata)
      slug: keyValue(key: "_id", source: root)
      status: keyValue(key: "status", source: metadata, formatter: "pill")
      title: keyValue(key: "name", source: metadata)
      type: keyValue(key: "type", source: metadata)
    }
    relationValues
    entityView {
      column {
        size(size: seventy)
        elements {
          subJobs: entityListElement {
            label(input: "element-labels.sub-job")
            isCollapsed(input: false)
            entityTypes(input: [job])
            searchInputType(input: "AdvancedInputType")
            customQuery(input: "GetSubJobs")
            customQueryFilters(input: "GetSubJobsFilters")
            customBulkOperations(input: "GetJobsBulkOperations")
          }
          EntitiesModifiedFromJob: entityListElement {
            label(input: "element-labels.has-job")
            isCollapsed(input: false)
            entityTypes(input: [asset, mediafile])
            searchInputType(input: "AdvancedInputType")
            customQuery(input: "GetEntities")
            customQueryFilters(input: "GetEntitiesModifiedFromJobFilters")
            customBulkOperations(input: "GetJobsBulkOperations")
          }
        }
      }
      column2: column {
        size(size: thirty)
        elements {
          windowElement {
            label(input: "element-labels.metadata-element")
            omschrijving: panels {
              label(input: "panel-labels.description")
              panelType(input: metadata)
              isEditable(input: true)
              isCollapsed(input: false)
              type: metaData {
                label(input: "metadata.labels.type")
                key(input: "type")
              }
              name: metaData {
                label(input: "metadata.labels.name")
                key(input: "name")
              }
              status: metaData {
                label(input: "metadata.labels.status")
                key(input: "status")
              }
              info: metaData {
                label(input: "metadata.labels.info")
                key(input: "info")
              }
              date_created: metaData {
                label(input: "metadata.labels.created-at")
                key(input: "date_created")
                unit(input: DATETIME_DEFAULT)
              }
              started_at: metaData {
                label(input: "metadata.labels.created-at")
                key(input: "started_at")
                unit(input: DATETIME_DEFAULT)
              }
              last_editor: metaData {
                label(input: "metadata.labels.started-by")
                key(input: "last_editor")
              }
              date_updated: metaData {
                label(input: "metadata.labels.status-updated-at")
                key(input: "date_updated")
                unit(input: DATETIME_DEFAULT)
              }
            }
          }
        }
      }
    }
  }

  fragment jobFilters on Job {
    advancedFilters {
      job_type: advancedFilter(
        type: selection
        key: ["elody:1|metadata.type.value"]
        label: "metadata.labels.type"
        isDisplayedByDefault: true
        useNewWayToFetchOptions: true
        filterOptionsMapping: {
          label: "intialValues.type"
          value: "intialValues.type"
        }
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.type.value"]
            distinct_by: "metadata.type.value"
            value: "*"
            match_exact: false
          },
          {
            type: type
            value: "job"
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        useNewWayToFetchOptions
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          distinct_by
          match_exact
        }
        filterOptionsMapping {
          label
          value
        }
        tooltip(value: true)
      }
      name: advancedFilter(
        type: selection
        key: ["elody:1|metadata.name.value"]
        label: "metadata.labels.name"
        isDisplayedByDefault: true
        useNewWayToFetchOptions: true
        filterOptionsMapping: {
          label: "intialValues.name"
          value: "intialValues.name"
        }
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.name.value"]
            distinct_by: "metadata.name.value"
            value: "*"
            match_exact: false
          },
          {
            type: type
            value: "job"
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        useNewWayToFetchOptions
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          match_exact
          distinct_by
        }
        filterOptionsMapping {
          label
          value
        }
        tooltip(value: true)
      }
      status: advancedFilter(
        type: selection
        key: ["elody:1|metadata.status.value"]
        label: "metadata.labels.status"
        isDisplayedByDefault: true
        useNewWayToFetchOptions: true
        filterOptionsMapping: {
          label: "intialValues.status"
          value: "intialValues.status"
        }
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.status.value"]
            distinct_by: "metadata.status.value"
            value: "*"
            match_exact: false
          },
          {
            type: type
            value: "job"
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        useNewWayToFetchOptions
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          match_exact
          distinct_by
        }
        filterOptionsMapping {
          label
          value
        }
        tooltip(value: true)
      }
      date_created: advancedFilter(
        type: date
        key: ["elody:1|date_created"]
        label: "metadata.labels.created-at"
        isDisplayedByDefault: true
        showTimeForDateFilter: true
      ) {
        type
        key
        label
        isDisplayedByDefault
        showTimeForDateFilter
        tooltip(value: true)
      }
      started_at: advancedFilter(
        type: date
        key: ["elody:1|started_at"]
        label: "metadata.labels.started-at"
        isDisplayedByDefault: true
        showTimeForDateFilter: true
      ) {
        type
        key
        label
        isDisplayedByDefault
        showTimeForDateFilter
        tooltip(value: true)
      }
      last_editor: advancedFilter(
        type: selection
        key: ["elody:1|last_editor"]
        label: "metadata.labels.started-by"
        isDisplayedByDefault: true
        useNewWayToFetchOptions: true
        filterOptionsMapping: {
          label: "intialValues.email"
          value: "intialValues.email"
        }
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.email.value"]
            value: "*"
            match_exact: false
          },
          {
            type: type
            value: "user"
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        useNewWayToFetchOptions
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          match_exact
        }
        filterOptionsMapping {
          label
          value
        }
        defaultValue(value: "session-$email")
        tooltip(value: true)
      }
      type: advancedFilter(type: type) {
        type
        defaultValue(value: "job")
        hidden(value: true)
      }
      hasParentJob: advancedFilter(
        type: text
        key: "relations.hasParentJob.key"
      ) {
        type
        key
        defaultValue(value: "")
        hidden(value: true)
      }
    }
  }

  fragment jobSortOptions on Job {
    sortOptions {
      options(
        input: [
          {
            icon: NoIcon
            label: "metadata.labels.created-at"
            value: "date_created"
          },
          {
            icon: NoIcon
            label: "metadata.labels.started-at"
            value: "started_at"
          },
          {
            icon: NoIcon
            label: "metadata.labels.status"
            value: "status"
          }
        ],
        excludeBaseSortOptions: true
      ) {
        icon
        label
        value
      }
      isAsc(input: desc)
    }
  }

  query GetSubJobsFilters($entityType: String!) {
    EntityTypeFilters(type: $entityType) {
      advancedFilters {
        type: advancedFilter(type: type) {
          type
          defaultValue(value: "job")
          hidden(value: true)
        }
        hasParentJob: advancedFilter(
          type: selection
          key: "relations.hasParentJob.key"
        ) {
          type
          key
          defaultValue(value: "$parentIds")
          hidden(value: true)
        }
      }
    }
  }

  query GetEntitiesModifiedFromJobFilters($entityType: String!) {
    EntityTypeFilters(type: $entityType) {
      advancedFilters {
        hasJob: advancedFilter(type: selection, key: "relations.hasJob.key") {
          type
          key
          defaultValue(value: [])
          hidden(value: true)
        }
        type: advancedFilter(
          type: selection
          key: "type"
        ) {
          type
          key
          defaultValue(value: [asset, mediafile])
          hidden(value: true)
        }
      }
    }
  }

  query GetJobsBulkOperations {
    CustomBulkOperations {
      bulkOperationOptions {
        options(
          input: []
        ) {
          icon
          label
          value
          primary
          can
          actionContext {
            ...actionContext
          }
          bulkOperationModal {
            ...bulkOperationModal
          }
        }
      }
    }
  }

  query GetSubJobs(
    $type: Entitytyping!
    $limit: Int
    $skip: Int
    $searchValue: SearchFilter!
    $advancedSearchValue: [FilterInput]
    $advancedFilterInputs: [AdvancedFilterInput!]!
    $searchInputType: SearchInputType
  ) {
    Entities(
      type: $type
      limit: $limit
      skip: $skip
      searchValue: $searchValue
      advancedSearchValue: $advancedSearchValue
      advancedFilterInputs: $advancedFilterInputs
      searchInputType: $searchInputType
    ) {
      count
      limit
      results {
        id
        uuid
        type
        ... on Job {
          intialValues {
            date_created: keyValue(key: "date_created", source: root)
            started_at: keyValue(key: "started_at", source: root)
            info: keyValue(key: "info", source: metadata)
            name: keyValue(key: "name", source: metadata)
            slug: keyValue(key: "_id", source: root)
            status: keyValue(key: "status", source: metadata, formatter: "pill")
            title: keyValue(key: "name", source: metadata)
          }
          allowedViewModes {
            viewModes(input: [
              { viewMode: ViewModesList }
            ]) {
              ...viewModes
            }
          }
          teaserMetadata {
            name: metaData {
              label(input: "metadata.labels.name")
              key(input: "name")
            }
            status: metaData {
              label(input: "metadata.labels.status")
              key(input: "status")
            }
            info: metaData {
              label(input: "metadata.labels.info")
              key(input: "info")
            }
            date_created: metaData {
              label(input: "metadata.labels.created-at")
              key(input: "date_created")
              unit(input: DATETIME_DEFAULT)
            }
            started_at: metaData {
              label(input: "metadata.labels.started-at")
              key(input: "started_at")
              unit(input: DATETIME_DEFAULT)
            }
            contextMenuActions {
              doLinkAction {
                label(input: "contextMenu.contextMenuLinkAction.followLink")
                icon(input: "AngleRight")
                __typename
              }
              __typename
            }
          }
          ...minimalBaseEntity
        }
      }
    }
  }
`;
