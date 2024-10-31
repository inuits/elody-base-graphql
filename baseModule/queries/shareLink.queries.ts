import { gql } from 'graphql-modules';

export const shareLinkQueries = gql`
  fragment minimalShareLink on ShareLink {
    ...minimalBaseEntity
    intialValues {
      ttl: keyValue(key: "ttl", source: metadata)
    }
    allowedViewModes {
      viewModes(input: [
        { viewMode: ViewModesList }
      ]) {
        ...viewModes
      }
    }
    teaserMetadata {
      ttl: metaData {
        label(input: "metadata.labels.ttl")
        key(input: "ttl")
      }
    }
  }

  fragment fullShareLink on ShareLink {
    intialValues {
      ttl: keyValue(key: "ttl", source: metadata)
    }
    relationValues
    entityView {
      viewerColumn: column {
        size(size: seventy)
        elements {
          entityViewerElement {
            label(input: "Shared entity")
            entityId(relationType: "isShareLinkFor")
          }
        }
      }
      metadataColumn: column {
        size(size: thirty)
        elements {
          windowElement {
            label(input: "Metadata")
            info: panels {
              label(input: "panel-labels.license-info")
              panelType(input: metadata)
              isEditable(input: true)
              isCollapsed(input: false)
              ttl: metaData {
                label(input: "metadata.labels.ttl")
                key(input: "key")
                inputField(type: baseTextField) {
                  ...inputfield
                  validation(input: { value: required }) {
                    ...validation
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  query GetShareLinkCreateForm {
    GetDynamicForm {
      label(input: "navigation.create-share-link")
      shareLink: formTab {
        formFields {
          ttl: metaData {
            label(input: "metadata.labels.ttl")
            key(input: "ttl")
            inputField(type: baseTextField) {
              ...inputfield
              validation(input: { value: required }) {
                ...validation
              }
            }
          }
          createAction: action {
            label(input: "actions.labels.create")
            icon(input: Create)
            actionType(input: submit)
            actionQuery(input: "CreateEntity")
            creationType(input: shareLink)
          }
        }
      }
    }
  }

  fragment filtersForShareLink on ShareLink {
    advancedFilters {
      id: advancedFilter(
        type: text
        key: ["elody:1|metadata.id.value"]
        label: "metadata.labels.id"
        isDisplayedByDefault: true
      ) {
        type
        key
        label
        isDisplayedByDefault
      }
      ttl: advancedFilter(
        type: text
        key: ["elody:1|metadata.ttl.value"]
        label: "metadata.labels.ttl"
        isDisplayedByDefault: true
      ) {
        type
        key
        label
        isDisplayedByDefault
      }
      type: advancedFilter(type: type) {
        type
        defaultValue(value: "shareLink")
        hidden(value: true)
      }
    }
  }

  fragment shareLinkSortOptions on ShareLink {
    sortOptions {
      options(
        input: [{ icon: NoIcon, label: "metadata.labels.ttl", value: "ttl" }]
      ) {
        icon
        label
        value
      }
    }
  }

  fragment shareLinkBulkOperations on ShareLink {
    bulkOperationOptions {
      options(
        input: [
          {
            icon: Create
            label: "bulk-operations.create-share-link"
            value: "createEntity"
            primary: true
            bulkOperationModal: {
              typeModal: DynamicForm
              formQuery: "GetShareLinkCreateForm"
              askForCloseConfirmation: true
              neededPermission: cancreate
            }
          }
        ]
      ) {
        icon
        label
        value
        primary
        bulkOperationModal {
          ...bulkOperationModal
        }
      }
    }
  }
`;
