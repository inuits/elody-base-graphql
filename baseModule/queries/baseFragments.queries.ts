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
      exact
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

  fragment advancedFilter on AdvancedFilter {
    type
    key
    label
    selectionOption
    isDisplayedByDefault
    filterOptionsMapping {
      label
      value
    }
    useOldWayToFetchOptions
    advancedFilterInputForRetrievingOptions {
      type
      key
      value
      distinct_by
      match_exact
    }
    tooltip(value: true)
    includeDefaultValuesFromIntialValues
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
    relationFilter {
      lookup {
        as
        foreign_field
        from
        local_field
      }
      type
      key
      value
      match_exact
      item_types
    }
    dependsOn
    multiple
    lineClamp
    entityType
    hasVirtualKeyboard
    autoSelectable
    autoAllSelectable
    subFields {
      key
      label
      type
      options {
        icon
        label
        value
      }
    }
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

  fragment facetFields on FacetInputType {
    type
    value
    facets {
      key
      lookups {
        as
        foreign_field
        from
        local_field
      }
    }
  }

  fragment filterOptionsMappingFields on FilterOptionsMappingType {
    label
    value
  }

  fragment bulkOperationModal on BulkOperationModal {
    typeModal
    formQuery
    formRelationType
    askForCloseConfirmation
    neededPermission
    skipItemsWithRelationDuringBulkDelete
    enableImageCrop
    keyToSaveCropCoordinates
    pageToNavigateToAfterCreation
    customQueryEntityPickerList
    customQueryEntityPickerListFilters
  }

  fragment subOptions on DropdownOption {
    icon
    label
    value
    primary
    can
    bulkOperationModal {
      ...bulkOperationModal
    }
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
    hideIfMetadataNotPresent
  }

  fragment hiddenField on HiddenField {
    hidden
    searchValueForFilter
    inherited
    entityType
    relationToExtractKey
    keyToExtractValue
    value
  }

  fragment basicContextMenuActions on ContextMenuActions {
    doLinkAction {
      label(input: "contextMenu.contextMenuLinkAction.followLink")
      icon(input: "AngleRight")
      __typename
    }
    doElodyAction {
      label(input: "contextMenu.contextMenuElodyAction.delete-relation")
      action(input: DeleteRelation)
      icon(input: "Trash")
      __typename
    }
  }

  fragment linkAndDeleteEntityContextMenuActions on ContextMenuActions {
    doLinkAction {
      label(input: "contextMenu.contextMenuLinkAction.followLink")
      icon(input: "AngleRight")
      __typename
    }
    deleteEntity: doElodyAction {
      label(input: "contextMenu.contextMenuElodyAction.delete-entity")
      action(input: DeleteEntity)
      icon(input: "Trash")
      __typename
    }
  }

  fragment taggableEntityConfiguration on TaggableEntityConfiguration {
    taggableEntityType
    createNewEntityFormQuery
    relationType
    metadataFilterForTagContent
    replaceCharacterFromTagSettings {
      replacementCharactersRegex
      characterToReplaceWith
    }
    metadataKeysToSetAsAttribute
    tag
    tagConfigurationByEntity {
      configurationEntityType
      configurationEntityRelationType
      tagMetadataKey
      colorMetadataKey
      metadataKeysToSetAsAttribute
      secondaryAttributeToDetermineTagConfig
    }
  }
`;
