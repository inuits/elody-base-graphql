import {
  Form,
  InputFieldTypes,
  InputField,
  MetadataOrRelationField,
  LanguageType,
  FileformatType,
  Entitytyping,
  DamsIcons,
  DropdownOption,
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
      return { icon: DamsIcons.NoIcon, label: format, value: format };
    }),
  },
};

export const getOptionsByEntityType = async (
  acceptedEntityTypes: string[] | undefined,
  dataSources: DataSources
): Promise<DropdownOption[]> => {
  if (!acceptedEntityTypes) return [];

  let optionsForField = [];
  for (let i: number = 1; i <= acceptedEntityTypes.length; i++) {
    const optionsByType = await dataSources.CollectionAPI.getEntitiesByType(
      acceptedEntityTypes[i - 1] as string
    );
    console.log(optionsByType)
    if (optionsByType)
      optionsForField.push(...optionsByType);
  }

  const options = optionsForField.map((option: any) => {
    const metadata = option?.metadata;
    console.log(metadata)
    if (!metadata)
      return { icon: DamsIcons.NoIcon, label: '', value: option.id };
    return {
      icon: DamsIcons.NoIcon,
      label: metadata.find((dataItem: any) => {
        return dataItem?.key === 'title' || dataItem?.key === 'name' || dataItem?.key === 'email';
      })?.value,
      value: option['_id'],
    };
  });
  return options;
};
