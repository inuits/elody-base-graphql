import {
  ActionProgressIndicatorType,
  DamsIcons,
  DropdownOption,
  FileType,
  InputField,
  InputFieldTypes,
  ProgressStepStatus,
  ProgressStepType,
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
  baseFileUploadField: {
    type: InputFieldTypes.FileUpload,
    fileTypes: [
      FileType.Png,
      FileType.Jpeg,
      FileType.Jpg,
      FileType.Tiff,
      FileType.Mp4,
    ],
    maxAmountOfFiles: 999,
    fileProgressSteps: {
      type: ActionProgressIndicatorType.ProgressSteps,
      steps: [
        {
          label: 'actions.progress-steps.validate',
          status: ProgressStepStatus.Empty,
          stepType: ProgressStepType.Validate,
        },
        {
          label: 'actions.progress-steps.prepare',
          status: ProgressStepStatus.Empty,
          stepType: ProgressStepType.Prepare,
        },
        {
          label: 'actions.progress-steps.upload',
          status: ProgressStepStatus.Empty,
          stepType: ProgressStepType.Upload,
        },
      ],
    },
  },
  baseCsvUploadField: {
    type: InputFieldTypes.CsvUpload,
    fileTypes: [FileType.Csv],
    maxAmountOfFiles: 1,
    fileProgressSteps: {
      type: ActionProgressIndicatorType.ProgressSteps,
      steps: [
        {
          label: 'actions.progress-steps.validate',
          status: ProgressStepStatus.Empty,
          stepType: ProgressStepType.Validate,
        },
      ],
    },
  },
  baseFileSystemImportField: {
    type: InputFieldTypes.FileSystemImport,
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
    if (optionsByType) optionsForField.push(...optionsByType);
  }

  let options: DropdownOption[] = [];
  options = optionsForField.map((option: any) => {
    const metadata = option?.metadata;
    if (!metadata || !metadata.length)
      return { icon: DamsIcons.NoIcon, label: option.id, value: option.id };
    return {
      icon: DamsIcons.NoIcon,
      label:
        metadata.find((dataItem: any) => {
          return (
            dataItem?.key === 'title' ||
            dataItem?.key === 'name' ||
            dataItem?.key === 'email'
          );
        })?.value || option['_id'],
      value: option['_id'],
    };
  });
  return options;
};
