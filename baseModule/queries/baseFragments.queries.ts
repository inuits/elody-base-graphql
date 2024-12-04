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
    originalLabel
    clickedLabel
  }
  
  fragment hiddenField on HiddenField {
    hidden
    searchValueForFilter
  }
`;
