import { Form, InputFieldTypes, MetadataOrRelationField } from "../../../generated-types/type-defs";

export const RightsField: MetadataOrRelationField = {
    key: 'rights',
    label: 'Rights',
    type: InputFieldTypes.Dropdown,
    config_key: 'mediafiles_rights_values',
  };

  export const SourceField: MetadataOrRelationField = {
    key: 'source',
    label: 'Source',
    type: InputFieldTypes.Dropdown,
    config_key: 'mediafiles_source_values',
  };

export const MediafileMetaData: Form = {
    fields: [
      {
        ...RightsField,
      },
      {
        ...SourceField,
      },
      {
        key: 'publication_status',
        label: 'Status',
        type: InputFieldTypes.Dropdown,
        config_key: 'mediafiles_publication_status_values',
      },
      {
        key: 'photographer',
        label: 'Photographer',
        type: InputFieldTypes.Text,
      },
      {
        key: 'copyright',
        label: 'Rechtenhouder',
        type: InputFieldTypes.Text,
      },
    ],
  };