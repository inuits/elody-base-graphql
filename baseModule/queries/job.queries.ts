// @ts-ignore
import { gql } from 'graphql-modules';

export const jobQueries = gql`
  fragment minimalJob on Job {
    intialValues {
      created_at: keyValue(key: "computed_values.created_at", source: root)
      created_by: keyValue(key: "computed_values.created_by", source: root)
      info: keyValue(key: "info", source: metadata)
      name: keyValue(key: "name", source: metadata)
      slug: keyValue(key: "_id", source: root)
      status: keyValue(key: "status", source: metadata)
      title: keyValue(key: "name", source: metadata)
      type: keyValue(key: "type", source: metadata)
    }
    allowedViewModes {
      viewModes(input: [
        { viewMode: ViewModesList }
        { viewMode: ViewModesGrid }
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
      created_at: metaData {
        label(input: "metadata.labels.started-at")
        key(input: "created_at")
        unit(input: DATETIME_DEFAULT)
      }
      created_by: metaData {
        label(input: "metadata.labels.started-by")
        key(input: "created_by")
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

  fragment fullJob on Job {
    intialValues {
      created_at: keyValue(key: "computed_values.created_at", source: root)
      created_by: keyValue(key: "computed_values.created_by", source: root)
      info: keyValue(key: "info", source: metadata)
      modified_at: keyValue(key: "computed_values.modified_at", source: root)
      name: keyValue(key: "name", source: metadata)
      slug: keyValue(key: "_id", source: root)
      status: keyValue(key: "status", source: metadata)
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
            customQuery(input: "GetEntities")
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
              created_at: metaData {
                label(input: "metadata.labels.started-at")
                key(input: "created_at")
                unit(input: DATETIME_DEFAULT)
              }
              created_by: metaData {
                label(input: "metadata.labels.started-by")
                key(input: "created_by")
              }
              modified_at: metaData {
                label(input: "metadata.labels.status-updated-at")
                key(input: "modified_at")
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
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.type.value"]
            value: "*"
            item_types: ["job"]
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          item_types
        }
        tooltip(value: true)
      }
      name: advancedFilter(
        type: selection
        key: ["elody:1|metadata.name.value"]
        label: "metadata.labels.name"
        isDisplayedByDefault: true
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.name.value"]
            value: "*"
            item_types: ["job"]
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          item_types
        }
        tooltip(value: true)
      }
      status: advancedFilter(
        type: selection
        key: ["elody:1|metadata.status.value"]
        label: "metadata.labels.status"
        isDisplayedByDefault: true
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|metadata.status.value"]
            value: "*"
            item_types: ["job"]
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          item_types
        }
        tooltip(value: true)
      }
      created_at: advancedFilter(
        type: date
        key: ["elody:1|computed_values.created_at"]
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
      created_by: advancedFilter(
        type: selection
        key: ["elody:1|computed_values.created_by"]
        label: "metadata.labels.started-by"
        isDisplayedByDefault: true
        advancedFilterInputForRetrievingOptions: [
          {
            type: text
            key: ["elody:1|computed_values.created_by"]
            value: "*"
            metadata_key_as_label: "metadata.email.value"
            item_types: ["job"]
          }
        ]
      ) {
        type
        key
        label
        isDisplayedByDefault
        advancedFilterInputForRetrievingOptions {
          type
          key
          value
          metadata_key_as_label
          item_types
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
            label: "metadata.labels.started-at"
            value: "computed_values.created_at"
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
          defaultValue(value: [])
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
`;
