import {
  Form,
  InputFieldTypes,
  InputField,
  MetadataOrRelationField,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';

export const baseFields: { [key: string]: InputField } = {
  baseTextField: {
    type: InputFieldTypes.Text,
  },
  baseDateField: {
    type: InputFieldTypes.Date,
  },
};


export const getOptionsByConfigKey = async (
  field: InputField,
  dataSources: DataSources
): Promise<InputField> => {
  if (!field.optionsConfigKey) return field;

  const optionsForField = (await dataSources.CollectionAPI.getConfig())[
    field.optionsConfigKey
  ];
  field.options = optionsForField;
  return field;
};


// Remove this
export const SourceField: MetadataOrRelationField = {
  key: 'source',
  label: 'Source',
  type: InputFieldTypes.Dropdown,
  config_key: 'mediafiles_source_values',
};

export const RightsField: MetadataOrRelationField = {
  key: 'rights',
  label: 'Rights',
  type: InputFieldTypes.Dropdown,
  config_key: 'mediafiles_rights_values',
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
