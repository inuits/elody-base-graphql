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
  baseTextareaField: {
    type: InputFieldTypes.Textarea,
  },
  fileformatTypeField: {
    type: InputFieldTypes.Dropdown,
    options: Object.values(FileformatType).map((format: string) => {
      return { key: format, value: format };
    }),
  },
};

export const getOptionsByEntityType = async (
  field: InputField,
  dataSources: DataSources
): Promise<InputField> => {
  if (!field.acceptedEntityTypes) return field;

  let optionsForField = [];
  for (let i: number = 0; i <= field.acceptedEntityTypes.length; i++) {
    const optionsByType = await dataSources.CollectionAPI.getEntitiesByType(
      field.acceptedEntityTypes[i - 1] as string
    );
    optionsForField.push(...optionsByType);
  }

  field.options = optionsForField.map((option) => {
    const metadata = option?.metadata;
    if (!metadata) return { key: option.id, value: '' };
    return {
      key: option.id,
      value: metadata.find((dataItem) => {
        return dataItem?.key === 'title' || dataItem?.key === 'name';
      })?.value,
    };
  });
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
