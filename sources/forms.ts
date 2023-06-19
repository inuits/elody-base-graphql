import {
  Form,
  InputFieldTypes,
  InputField,
  MetadataOrRelationField,
} from '../../../generated-types/type-defs';
import { DataSources } from '../types';

export const baseFields: { [key: string]: InputField } = {
  baseCheckbox: {
    type: InputFieldTypes.Checkbox,
  },
  baseDateField: {
    type: InputFieldTypes.Date,
  },
  baseDateTimeField: {
    type: 'datetime-local'
  },
  baseNumberField: {
    type: InputFieldTypes.Number,
  },
  baseColorField: {
    type: InputFieldTypes.Color,
  },
  baseTextField: {
    type: InputFieldTypes.Text,
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
