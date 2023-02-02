import {
  Form,
  InputFieldTypes,
  Metadata,
  MetadataOrRelationField,
  RelationType,
} from '../../../generated-types/type-defs';

const noKey = 'no-key';

export const PublicationStatusField: MetadataOrRelationField = {
  key: 'publication_status',
  label: 'Status',
  type: InputFieldTypes.Dropdown,
  options: [
    {
      label: 'Niets-Geselecteerd',
      value: 'niets-geselecteerd',
    },
    {
      label: 'Gepubliceerd',
      value: 'publiek',
    },
    {
      label: 'In behandeling',
      value: 'te valideren',
    },
    {
      label: 'Afgekeurd',
      value: 'afgekeurd',
    },
  ],
};

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

export const FrameForm: Form = {
  fields: [
    {
      key: 'title',
      label: 'Titel',
      type: InputFieldTypes.Text,
    },
    {
      key: 'subtitle',
      label: 'subtitle',
      relationType: 'components',
      acceptedEntityTypes: ['MediaFile'],
    },
    {
      key: 'audio',
      label: 'audio',
      relationType: 'components',
      acceptedEntityTypes: ['MediaFile'],
    },
    {
      key: 'asset',
      label: 'Assets',
      relationType: 'components',
      metadata: [
        {
          key: 'timestamp_start',
          label: 'Start asset',
          type: InputFieldTypes.Number,
        },
        {
          key: 'timestamp_end',
          label: 'Stop asset',
          type: InputFieldTypes.Number,
        },
        {
          key: 'timestamp_zoom',
          label: 'Zoom asset',
          type: InputFieldTypes.Number,
        },
        {
          key: 'x',
          label: 'Positie X',
          type: InputFieldTypes.Number,
        },
        {
          key: 'y',
          label: 'Positie Y',
          type: InputFieldTypes.Number,
        },
        {
          key: 'z',
          label: 'Positie Z',
          type: InputFieldTypes.Number,
        },
        {
          key: 'scale',
          label: 'Schaal',
          type: InputFieldTypes.Number,
        },
        {
          key: 'setMediafile',
          label: 'Mediafile Index',
          type: InputFieldTypes.Number,
        },
      ],
      acceptedEntityTypes: ['asset'],
      disabled: false,
    },
  ],
};

export const StoryForm: Form = {
  fields: [
    {
      key: 'title',
      label: 'Titel',
      type: InputFieldTypes.Text,
    },
    {
      key: 'description',
      label: 'Description',
      type: InputFieldTypes.Text,
    },
    {
      key: noKey,
      label: 'Frame',
      relationType: 'frames',
      metadata: [],
      acceptedEntityTypes: ['frame'],
      disabled: false,
    },
  ],
};

export const boxEntityForm: Form = {
  fields: [
    {
      key: 'title',
      label: 'Titel',
      type: InputFieldTypes.Text,
    },
    {
      key: 'story',
      label: 'Story',
      relationType: 'box_stories',
      metadata: [
        {
          key: 'active',
          label: 'Active',
          type: InputFieldTypes.Checkbox,
        },
      ],
      acceptedEntityTypes: ['story'],
    },
  ],
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

export const AssetForm: Form = {
  fields: [
    {
      ...PublicationStatusField,
    },
    {
      key: 'title',
      label: 'Titel',
      type: InputFieldTypes.Text,
    },
    {
      key: 'description',
      label: 'Beschrijving',
      type: InputFieldTypes.Text,
    },
    {
      key: 'periode',
      label: 'periode',
      type: InputFieldTypes.Text,
    },
    {
      key: 'maker',
      label: 'maker',
      type: InputFieldTypes.Text,
    },
    {
      key: 'Relatie',
      label: 'Relatie',
      relationType: 'components',
      metadata: [],
      acceptedEntityTypes: ['person', 'getty'],
      disabled: false,
    },
    {
      key: 'MaterieelDing.beheerder',
      label: 'Museum',
      relationType: 'isIn',
      metadata: [],
      acceptedEntityTypes: ['museum'],
      disabled: true,
    },
    {
      key: noKey,
      label: 'Testimony',
      relationType: 'hasTestimony',
      metadata: [],
      acceptedEntityTypes: ['testimony'],
      disabled: true,
    },
  ],
};
