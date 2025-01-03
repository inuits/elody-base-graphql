import { gql } from 'graphql-modules';
export const baseFragments = gql`
  fragment metadata on Metadata {
    key
    value
    label
    unit
    immutable
  }

  fragment validation on Validation {
    value
    customValue
    fastValidationMessage
    required_if {
      field
      value
      ifAnyValue
    }
    available_if {
      field
      value
      ifAnyValue
    }
    has_required_relation {
      relationType
      amount
    }
    has_one_of_required_relations {
      relationTypes
      amount
    }
    has_one_of_required_metadata {
      includedMetadataFields
      amount
    }
    regex
  }

  fragment inputfield on InputField {
    type
    options {
      icon
      label
      value
    }
    relationType
    fromRelationType
    canCreateEntityFromOption
    metadataKeyToCreateEntityFromOption
    advancedFilterInputForRetrievingOptions {
      type
      key
      value
      match_exact
      item_types
    }
    advancedFilterInputForRetrievingRelatedOptions {
      type
      key
      value
      match_exact
      item_types
      returnIdAtIndex
    }
    advancedFilterInputForRetrievingAllOptions {
      type
      key
      value
      match_exact
      item_types
    }
    advancedFilterInputForSearchingOptions {
      type
      parent_key
      key
      value
      match_exact
      item_types
    }
    fileTypes
    maxFileSize
    maxAmountOfFiles
    uploadMultiple
    isMetadataField
    dependsOn
    multiple
  }

  fragment metadataRelation on MetadataRelation {
    key
    value
    label
    type
    metadataOnRelation {
      key
      value
    }
  }

  fragment minimalBaseEntity on Entity {
    id
    uuid
    type
  }

  fragment actionContext on ActionContext {
    entitiesSelectionType
    activeViewMode
    matchMetadataValue {
      matchKey
      matchValue
    }
    labelForTooltip
  }

  fragment menuModalLink on MenuTypeLinkModal {
    typeModal
    formQuery
    askForCloseConfirmation
    neededPermission
  }

  fragment bulkOperationModal on BulkOperationModal {
    typeModal
    formQuery
    formRelationType
    askForCloseConfirmation
    neededPermission
  }

  fragment viewModes on ViewModesWithConfig {
    viewMode
    config {
      key
      value
    }
  }

  fragment editMetadataButton on EditMetadataButton {
    hasButton
    readmodeLabel
    editmodeLabel
  }

  fragment hiddenField on HiddenField {
    hidden
    searchValueForFilter
  }

  fragment mediafileInEntity on MediaFileEntity {
    ...minimalBaseEntity
    intialValues {
      id
      filename: keyValue(key: "filename", source: root)
      original_filename: keyValue(key: "original_filename", source: root)
      original_file_location: keyValue(
        key: "original_file_location"
        source: root
      )
      thumbnail: keyValue(key: "filename", source: root)
      mimetype: keyValue(key: "mimetype", source: root)
      order: keyValue(
        key: "order"
        source: relationMetadata
        uuid: $userUuid
        relationKey: "belongsTo"
      )
      __typename
    }
    teaserMetadata {
      order: relationMetaData {
        label(input: "metadata.labels.order")
        key(input: "order")
        inputField(type: baseNumberField) {
          ...inputfield
        }
        showOnlyInEditMode(input: true)
        __typename
      }
      thumbnail: thumbnail {
        key(input: "thumbnail")
        __typename
      }
      original_filename: metaData {
        label(input: "metadata.labels.filename")
        key(input: "original_filename")
        __typename
      }
      contextMenuActions {
        doLinkAction {
          label(input: "contextMenu.contextMenuLinkAction.followLink")
          icon(input: "AngleRight")
          __typename
        }
        primaryMediafile: doGeneralAction {
          label(
            input: "contextMenu.contextMenuGeneralAction.setPrimaryMediafile"
          )
          action(input: SetPrimaryMediafile)
          icon(input: "Link")
          __typename
        }
        primaryThumbnail: doGeneralAction {
          label(
            input: "contextMenu.contextMenuGeneralAction.setPrimaryThumbnail"
          )
          action(input: SetPrimaryThumbnail)
          icon(input: "ImageCheck")
          __typename
        }
        deleteRelation: doElodyAction {
          label(input: "contextMenu.contextMenuElodyAction.delete-relation")
          action(input: DeleteRelation)
          icon(input: "Trash")
          __typename
        }
        deleteEntity: doElodyAction {
          label(input: "contextMenu.contextMenuElodyAction.delete-entity")
          action(input: DeleteEntity)
          icon(input: "Trash")
          __typename
        }
        __typename
      }
    }
    allowedViewModes {
      viewModes(
        input: [
          { viewMode: ViewModesList }
          { viewMode: ViewModesGrid }
          { viewMode: ViewModesMedia }
        ]
      ) {
        ...viewModes
      }
    }
    __typename
  }
`;
