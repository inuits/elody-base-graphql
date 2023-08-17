import {
  Form,
  InputFieldTypes,
  InputField,
  MetadataOrRelationField,
  LanguageType,
  FileformatType,
  Entitytyping,
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
    type: 'datetime-local',
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
  fileformatTypeField: {
    type: InputFieldTypes.Dropdown,
    options: Object.values(FileformatType),
  },
};

export const getOptionsByEntityType = async (
  field: InputField,
  dataSources: DataSources
): Promise<InputField> => {
  if (!field.acceptedEntityTypes) return field;
  const key = field.acceptedEntityTypes.includes('IotDeviceModel') ? 'id' : 'title';

  const optionsForField = await dataSources.CollectionAPI.getEntitiesByType(
    field.acceptedEntityTypes[0] as string
  );
  field.options = optionsForField.map(
    (option) =>
      option?.metadata?.find((dataItem) => dataItem?.key === key)?.value
  );
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
