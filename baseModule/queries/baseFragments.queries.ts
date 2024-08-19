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
    labelForTooltip
  }

  fragment job on Job {
    job_type
    job_type
    job_info
    status
    user
    asset_id
    mediafile_id
    parent_job_id
    end_time
    start_time
    amount_of_jobs
    completed_jobs
    _id
    _key
    _rev
    message
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

  fragment actionContext on ActionContext {
    entitiesSelectionType
    activeViewMode
    labelForTooltip
  }

`;
