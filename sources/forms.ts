import {
  ActionProgressIndicatorType,
  FileType,
  InputField,
  InputFieldTypes,
  ProgressStepStatus,
  ProgressStepType,
} from '../../../generated-types/type-defs';

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
  baseResizableTextareaField: {
    type: InputFieldTypes.ResizableTextarea
  },
  baseFileUploadField: {
    type: InputFieldTypes.FileUpload,
    fileTypes: [
      FileType.Png,
      FileType.Jpeg,
      FileType.Jpg,
      FileType.Tif,
      FileType.Tiff,
      FileType.Mp4,
      FileType.Gif,
      FileType.Xml
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
  baseXmlUploadField: {
    type: InputFieldTypes.XmlUpload,
    fileTypes: [FileType.Xml, FileType.Json],
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
  baseEntityPickerField: {
    type: InputFieldTypes.BaseEntityPickerField,
  },
  baseFileSystemImportField: {
    type: InputFieldTypes.BaseFileSystemImportField,
  },
  baseMagazineWithMetsImportField: {
    type: InputFieldTypes.BaseMagazineWithMetsImportField,
  },
  baseMagazineWithCsvImportField: {
    type: InputFieldTypes.BaseMagazineWithCsvImportField,
  },
  baseMediafilesWithOcrImportField: {
    type: InputFieldTypes.BaseMediafilesWithOcrImportField,
    fileTypes: [
      FileType.Png,
      FileType.Jpeg,
      FileType.Jpg,
      FileType.Tif,
      FileType.Tiff,
      FileType.Mp4,
      FileType.Gif,
      FileType.Alto,
      FileType.Txt,
      FileType.Xml,
    ],
  },
};
