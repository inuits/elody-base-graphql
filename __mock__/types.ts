import type {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> &
  { [P in K]-?: NonNullable<T[P]> };

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  StringOrInt: any;
};

export type ActionContext = {
  __typename?: 'ActionContext';
  activeViewMode?: Maybe<Array<Maybe<ActionContextViewModeTypes>>>;
  entitiesSelectionType?: Maybe<ActionContextEntitiesSelectionType>;
  labelForTooltip?: Maybe<Scalars['String']>;
  matchMetadataValue?: Maybe<Array<Maybe<MatchMetadataValue>>>;
};

export enum ActionContextEntitiesSelectionType {
  NoneSelected = 'noneSelected',
  SomeSelected = 'someSelected',
}

export type ActionContextInput = {
  activeViewMode?: InputMaybe<Array<InputMaybe<ActionContextViewModeTypes>>>;
  entitiesSelectionType?: InputMaybe<ActionContextEntitiesSelectionType>;
  labelForTooltip?: InputMaybe<Scalars['String']>;
  matchMetadataValue?: InputMaybe<Array<InputMaybe<MatchMetadataValueInput>>>;
};

export enum ActionContextViewModeTypes {
  EditMode = 'editMode',
  ReadMode = 'readMode',
}

export type ActionElement = {
  __typename?: 'ActionElement';
  actions?: Maybe<Array<Maybe<Actions>>>;
  label: Scalars['String'];
};

export type ActionElementActionsArgs = {
  input?: InputMaybe<Array<InputMaybe<Actions>>>;
};

export type ActionElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type ActionProgress = {
  __typename?: 'ActionProgress';
  step?: Maybe<ActionProgressStep>;
  type: ActionProgressIndicatorType;
};

export type ActionProgressTypeArgs = {
  input: ActionProgressIndicatorType;
};

export enum ActionProgressIndicatorType {
  ProgressSteps = 'progressSteps',
  Spinner = 'spinner',
}

export type ActionProgressStep = {
  __typename?: 'ActionProgressStep';
  label: Scalars['String'];
  status: ProgressStepStatus;
  stepType: ProgressStepType;
};

export type ActionProgressStepLabelArgs = {
  input: Scalars['String'];
};

export type ActionProgressStepStepTypeArgs = {
  input: ProgressStepType;
};

export enum ActionType {
  Download = 'download',
  Endpoint = 'endpoint',
  Ocr = 'ocr',
  Submit = 'submit',
  SubmitWithExtraMetadata = 'submitWithExtraMetadata',
  SubmitWithUpload = 'submitWithUpload',
  UpdateMetadata = 'updateMetadata',
  Upload = 'upload',
  UploadCsvForReordening = 'uploadCsvForReordening',
  UploadWithMetadata = 'uploadWithMetadata',
  UploadWithOcr = 'uploadWithOcr',
}

export enum Actions {
  Download = 'download',
  NoActions = 'noActions',
  Ocr = 'ocr',
}

export type AdvancedFilter = {
  __typename?: 'AdvancedFilter';
  advancedFilterInputForRetrievingOptions?: Maybe<
    Array<AdvancedFilterInputType>
  >;
  aggregation?: Maybe<Scalars['String']>;
  context?: Maybe<Scalars['JSON']>;
  defaultValue: Scalars['JSON'];
  distinctBy?: Maybe<Scalars['String']>;
  doNotOverrideDefaultValue?: Maybe<Scalars['Boolean']>;
  entityType?: Maybe<Scalars['String']>;
  facets?: Maybe<Array<FacetInputType>>;
  filterOptionsMapping?: Maybe<FilterOptionsMappingType>;
  hidden: Scalars['Boolean'];
  isDisplayedByDefault: Scalars['Boolean'];
  itemTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  key?: Maybe<Scalars['JSON']>;
  label?: Maybe<Scalars['String']>;
  lookup?: Maybe<LookupInputType>;
  matchExact?: Maybe<Scalars['Boolean']>;
  max?: Maybe<Scalars['Int']>;
  metadataKeyAsLabel?: Maybe<Scalars['String']>;
  min?: Maybe<Scalars['Int']>;
  minDropdownSearchCharacters?: Maybe<Scalars['Int']>;
  operator?: Maybe<Operator>;
  options: Array<DropdownOption>;
  parentKey?: Maybe<Scalars['String']>;
  selectionOption?: Maybe<AutocompleteSelectionOptions>;
  showTimeForDateFilter?: Maybe<Scalars['Boolean']>;
  tooltip?: Maybe<Scalars['Boolean']>;
  type: AdvancedFilterTypes;
  unit?: Maybe<Scalars['String']>;
  useOldWayToFetchOptions?: Maybe<Scalars['Boolean']>;
};

export type AdvancedFilterDefaultValueArgs = {
  value: Scalars['JSON'];
};

export type AdvancedFilterDoNotOverrideDefaultValueArgs = {
  value?: InputMaybe<Scalars['Boolean']>;
};

export type AdvancedFilterHiddenArgs = {
  value?: InputMaybe<Scalars['Boolean']>;
};

export type AdvancedFilterMinDropdownSearchCharactersArgs = {
  value?: InputMaybe<Scalars['Int']>;
};

export type AdvancedFilterTooltipArgs = {
  value?: InputMaybe<Scalars['Boolean']>;
};

export type AdvancedFilterInput = {
  aggregation?: InputMaybe<Scalars['String']>;
  distinct_by?: InputMaybe<Scalars['String']>;
  facets?: InputMaybe<Array<FacetInputInput>>;
  inner_exact_matches?: InputMaybe<Scalars['JSON']>;
  item_types?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  key?: InputMaybe<Scalars['JSON']>;
  lookup?: InputMaybe<LookupInput>;
  match_exact?: InputMaybe<Scalars['Boolean']>;
  metadata_key_as_label?: InputMaybe<Scalars['String']>;
  operator?: InputMaybe<Operator>;
  parent_key?: InputMaybe<Scalars['String']>;
  provide_value_options_for_key?: InputMaybe<Scalars['Boolean']>;
  returnIdAtIndex?: InputMaybe<Scalars['Int']>;
  selectionOption?: InputMaybe<AutocompleteSelectionOptions>;
  type: AdvancedFilterTypes;
  value: Scalars['JSON'];
};

export type AdvancedFilterInputType = {
  __typename?: 'AdvancedFilterInputType';
  aggregation?: Maybe<Scalars['String']>;
  context?: Maybe<Scalars['JSON']>;
  distinct_by?: Maybe<Scalars['String']>;
  inner_exact_matches?: Maybe<Scalars['JSON']>;
  item_types?: Maybe<Array<Maybe<Scalars['String']>>>;
  key?: Maybe<Scalars['JSON']>;
  lookup?: Maybe<LookupInputType>;
  match_exact?: Maybe<Scalars['Boolean']>;
  metadata_key_as_label?: Maybe<Scalars['String']>;
  operator?: Maybe<Operator>;
  parent_key?: Maybe<Scalars['String']>;
  returnIdAtIndex?: Maybe<Scalars['Int']>;
  selectionOption?: Maybe<AutocompleteSelectionOptions>;
  type: AdvancedFilterTypes;
  value: Scalars['JSON'];
};

export enum AdvancedFilterTypes {
  Boolean = 'boolean',
  Date = 'date',
  Geo = 'geo',
  Id = 'id',
  MetadataOnRelation = 'metadata_on_relation',
  Number = 'number',
  Selection = 'selection',
  Text = 'text',
  Type = 'type',
}

export type AdvancedFilters = {
  __typename?: 'AdvancedFilters';
  advancedFilter: AdvancedFilter;
};

export type AdvancedFiltersAdvancedFilterArgs = {
  advancedFilterInputForRetrievingOptions?: InputMaybe<
    Array<AdvancedFilterInput>
  >;
  aggregation?: InputMaybe<Scalars['String']>;
  context?: InputMaybe<Scalars['JSON']>;
  distinctBy?: InputMaybe<Scalars['String']>;
  entityType?: InputMaybe<Scalars['String']>;
  facets?: InputMaybe<Array<FacetInputInput>>;
  filterOptionsMapping?: InputMaybe<FilterOptionsMappingInput>;
  isDisplayedByDefault?: InputMaybe<Scalars['Boolean']>;
  itemTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  key?: InputMaybe<Scalars['JSON']>;
  label?: InputMaybe<Scalars['String']>;
  lookup?: InputMaybe<LookupInput>;
  matchExact?: InputMaybe<Scalars['Boolean']>;
  max?: InputMaybe<Scalars['Int']>;
  metadataKeyAsLabel?: InputMaybe<Scalars['String']>;
  min?: InputMaybe<Scalars['Int']>;
  minDropdownSearchCharacters?: InputMaybe<Scalars['Int']>;
  operator?: InputMaybe<Operator>;
  parentKey?: InputMaybe<Scalars['String']>;
  selectionOption?: InputMaybe<AutocompleteSelectionOptions>;
  showTimeForDateFilter?: InputMaybe<Scalars['Boolean']>;
  type: AdvancedFilterTypes;
  unit?: InputMaybe<Scalars['String']>;
  useOldWayToFetchOptions?: InputMaybe<Scalars['Boolean']>;
};

export enum AdvancedInputType {
  MinMaxInput = 'MinMaxInput',
  SelectionInput = 'SelectionInput',
  TextInput = 'TextInput',
}

export type AdvancedSearchInput = {
  value?: InputMaybe<Array<InputMaybe<AdvancedInputType>>>;
};

export type AllowedViewModes = {
  __typename?: 'AllowedViewModes';
  viewModes?: Maybe<Array<Maybe<ViewModesWithConfig>>>;
};

export type AllowedViewModesViewModesArgs = {
  input?: InputMaybe<Array<InputMaybe<ViewModesWithConfigInput>>>;
};

export type Area = Entity & {
  __typename?: 'Area';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type Asset = Entity & {
  __typename?: 'Asset';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum AutocompleteSelectionOptions {
  Auto = 'auto',
  Autocomplete = 'autocomplete',
  Checkboxlist = 'checkboxlist',
}

export type BaseEntity = Entity & {
  __typename?: 'BaseEntity';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  mapElement?: Maybe<MapElement>;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum BaseFieldType {
  BaseCheckbox = 'baseCheckbox',
  BaseColorField = 'baseColorField',
  BaseCsvUploadField = 'baseCsvUploadField',
  BaseDateField = 'baseDateField',
  BaseDateTimeField = 'baseDateTimeField',
  BaseEntityPickerField = 'baseEntityPickerField',
  BaseFileSystemImportField = 'baseFileSystemImportField',
  BaseFileUploadField = 'baseFileUploadField',
  BaseMagazineWithCsvImportField = 'baseMagazineWithCsvImportField',
  BaseMagazineWithMetsImportField = 'baseMagazineWithMetsImportField',
  BaseMediafilesWithOcrImportField = 'baseMediafilesWithOcrImportField',
  BaseNumberField = 'baseNumberField',
  BaseResizableTextareaField = 'baseResizableTextareaField',
  BaseTextField = 'baseTextField',
  BaseTextareaField = 'baseTextareaField',
  BaseXmlUploadField = 'baseXmlUploadField',
  CsvEntityTypeTypeField = 'csvEntityTypeTypeField',
  DiscoveryContextField = 'discoveryContextField',
  InscriptionPublicationStatusField = 'inscriptionPublicationStatusField',
  PrivacyTypeField = 'privacyTypeField',
  PublicPrivateField = 'publicPrivateField',
  RecordCompletionStatusField = 'recordCompletionStatusField',
  RefAlternativeSiglaField = 'refAlternativeSiglaField',
  RefAreaField = 'refAreaField',
  RefContributorsField = 'refContributorsField',
  RefCreatorsField = 'refCreatorsField',
  RefEpiDocTagField = 'refEpiDocTagField',
  RefLanguage = 'refLanguage',
  RefPointField = 'refPointField',
  RefPresentLocationField = 'refPresentLocationField',
  RefRegionField = 'refRegionField',
  RefReviewedByField = 'refReviewedByField',
  RefScriptField = 'refScriptField',
  RefSiteField = 'refSiteField',
  RefSiteFunctionField = 'refSiteFunctionField',
  RefSiteTypeField = 'refSiteTypeField',
  RefSupportField = 'refSupportField',
  RefTextualTypologyField = 'refTextualTypologyField',
  RefWritingTechniqueField = 'refWritingTechniqueField',
  ScriptTypeField = 'scriptTypeField',
  SignificanceField = 'significanceField',
  SitePublicationStatusField = 'sitePublicationStatusField',
  UrgencyField = 'urgencyField',
  YesNoField = 'yesNoField',
}

export enum BaseLibraryModes {
  BasicBaseLibrary = 'basicBaseLibrary',
  BasicBaseLibraryWithBorder = 'basicBaseLibraryWithBorder',
  NormalBaseLibrary = 'normalBaseLibrary',
  PreviewBaseLibrary = 'previewBaseLibrary',
}

export type BaseRelationValuesInput = {
  editStatus: EditStatus;
  inheritFrom?: InputMaybe<InheritFromInput>;
  is_ocr?: InputMaybe<Scalars['Boolean']>;
  is_primary?: InputMaybe<Scalars['Boolean']>;
  is_primary_thumbnail?: InputMaybe<Scalars['Boolean']>;
  key?: InputMaybe<Scalars['String']>;
  label?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataInput>>>;
  operation?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sort?: InputMaybe<Scalars['JSON']>;
  teaserMetadata?: InputMaybe<Array<InputMaybe<MetadataInput>>>;
  type: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
};

export type BibliographicalReference = Entity & {
  __typename?: 'BibliographicalReference';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type BreadCrumbRoute = {
  __typename?: 'BreadCrumbRoute';
  entityType?: Maybe<Entitytyping>;
  overviewPage?: Maybe<RouteNames>;
  relation?: Maybe<Scalars['String']>;
};

export type BreadCrumbRouteInput = {
  entityType?: InputMaybe<Entitytyping>;
  overviewPage?: InputMaybe<RouteNames>;
  relation?: InputMaybe<Scalars['String']>;
};

export type BulkOperationCsvExportKeys = {
  __typename?: 'BulkOperationCsvExportKeys';
  options: Array<DropdownOption>;
};

export type BulkOperationInputModal = {
  askForCloseConfirmation?: InputMaybe<Scalars['Boolean']>;
  formQuery?: InputMaybe<Scalars['String']>;
  formRelationType?: InputMaybe<Scalars['String']>;
  neededPermission?: InputMaybe<Permission>;
  skipItemsWithRelationDuringBulkDelete?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  typeModal: TypeModals;
};

export type BulkOperationModal = {
  __typename?: 'BulkOperationModal';
  askForCloseConfirmation?: Maybe<Scalars['Boolean']>;
  formQuery?: Maybe<Scalars['String']>;
  formRelationType?: Maybe<Scalars['String']>;
  neededPermission?: Maybe<Permission>;
  skipItemsWithRelationDuringBulkDelete?: Maybe<
    Array<Maybe<Scalars['String']>>
  >;
  typeModal: TypeModals;
};

export type BulkOperationOptions = {
  __typename?: 'BulkOperationOptions';
  options: Array<DropdownOption>;
};

export type BulkOperationOptionsOptionsArgs = {
  input: Array<DropdownOptionInput>;
};

export enum BulkOperationTypes {
  AddRelation = 'addRelation',
  CreateEntity = 'createEntity',
  DeleteEntities = 'deleteEntities',
  DeleteRelations = 'deleteRelations',
  DownloadMediafiles = 'downloadMediafiles',
  Edit = 'edit',
  ExportCsv = 'exportCsv',
  ExportCsvOfMediafilesFromAsset = 'exportCsvOfMediafilesFromAsset',
  ReorderEntities = 'reorderEntities',
  StartOcr = 'startOcr',
}

export type BulkOperations = {
  __typename?: 'BulkOperations';
  options: Array<DropdownOption>;
};

export type BulkOperationsOptionsArgs = {
  input: Array<DropdownOptionInput>;
};

export type CharacterReplacementSettings = {
  __typename?: 'CharacterReplacementSettings';
  characterToReplaceWith: Scalars['String'];
  replacementCharactersRegex: Scalars['String'];
};

export type CharacterReplacementSettingsInput = {
  characterToReplaceWith: Scalars['String'];
  replacementCharactersRegex: Scalars['String'];
};

export enum Collection {
  Entities = 'entities',
  Jobs = 'jobs',
  Mediafiles = 'mediafiles',
}

export type Column = {
  __typename?: 'Column';
  elements: EntityViewElements;
  size: ColumnSizes;
};

export type ColumnSizeArgs = {
  size?: InputMaybe<ColumnSizes>;
};

export type ColumnList = {
  __typename?: 'ColumnList';
  column: Column;
};

export enum ColumnSizes {
  Eighty = 'eighty',
  Fifty = 'fifty',
  Forty = 'forty',
  Hundred = 'hundred',
  Ninety = 'ninety',
  Seventy = 'seventy',
  Sixty = 'sixty',
  Ten = 'ten',
  Thirty = 'thirty',
  Twenty = 'twenty',
}

export type CompositeSite = Entity & {
  __typename?: 'CompositeSite';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type Conditional = {
  __typename?: 'Conditional';
  field: Scalars['String'];
  ifAnyValue: Scalars['Boolean'];
  value?: Maybe<Scalars['String']>;
};

export type ConditionalInput = {
  field: Scalars['String'];
  ifAnyValue?: InputMaybe<Scalars['Boolean']>;
  value?: InputMaybe<Scalars['String']>;
};

export type ConfigItem = {
  __typename?: 'ConfigItem';
  key: Scalars['String'];
  value: Scalars['JSON'];
};

export type ConfigItemInput = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};

export type ContextMenuActions = {
  __typename?: 'ContextMenuActions';
  doElodyAction?: Maybe<ContextMenuElodyAction>;
  doGeneralAction?: Maybe<ContextMenuGeneralAction>;
  doLinkAction?: Maybe<ContextMenuLinkAction>;
};

export enum ContextMenuDirection {
  Left = 'left',
  Right = 'right',
}

export type ContextMenuElodyAction = {
  __typename?: 'ContextMenuElodyAction';
  action: ContextMenuElodyActionEnum;
  can?: Maybe<Array<Maybe<Scalars['String']>>>;
  icon: Scalars['String'];
  label: Scalars['String'];
};

export type ContextMenuElodyActionActionArgs = {
  input?: InputMaybe<ContextMenuElodyActionEnum>;
};

export type ContextMenuElodyActionCanArgs = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ContextMenuElodyActionIconArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type ContextMenuElodyActionLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export enum ContextMenuElodyActionEnum {
  DeleteEntity = 'DeleteEntity',
  DeleteRelation = 'DeleteRelation',
  Share = 'Share',
}

export type ContextMenuGeneralAction = {
  __typename?: 'ContextMenuGeneralAction';
  action: ContextMenuGeneralActionEnum;
  can?: Maybe<Array<Maybe<Scalars['String']>>>;
  icon: Scalars['String'];
  label: Scalars['String'];
};

export type ContextMenuGeneralActionActionArgs = {
  input?: InputMaybe<ContextMenuGeneralActionEnum>;
};

export type ContextMenuGeneralActionCanArgs = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ContextMenuGeneralActionIconArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type ContextMenuGeneralActionLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export enum ContextMenuGeneralActionEnum {
  SetPrimaryMediafile = 'SetPrimaryMediafile',
  SetPrimaryThumbnail = 'SetPrimaryThumbnail',
}

export type ContextMenuLinkAction = {
  __typename?: 'ContextMenuLinkAction';
  can?: Maybe<Array<Maybe<Scalars['String']>>>;
  icon: Scalars['String'];
  label: Scalars['String'];
};

export type ContextMenuLinkActionCanArgs = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ContextMenuLinkActionIconArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type ContextMenuLinkActionLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type Creator = Entity & {
  __typename?: 'Creator';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum CustomFormatterTypes {
  Link = 'link',
  Pill = 'pill',
  RegexpMatch = 'regexpMatch',
}

export enum DamsIcons {
  AngleDoubleLeft = 'AngleDoubleLeft',
  AngleDoubleRight = 'AngleDoubleRight',
  AngleDown = 'AngleDown',
  AngleLeft = 'AngleLeft',
  AngleRight = 'AngleRight',
  AngleUp = 'AngleUp',
  Apps = 'Apps',
  ArchiveAlt = 'ArchiveAlt',
  ArrowCircleLeft = 'ArrowCircleLeft',
  ArrowCircleRight = 'ArrowCircleRight',
  AudioThumbnail = 'AudioThumbnail',
  Ban = 'Ban',
  BookOpen = 'BookOpen',
  Check = 'Check',
  CheckCircle = 'CheckCircle',
  CheckSquare = 'CheckSquare',
  Circle = 'Circle',
  Close = 'Close',
  Create = 'Create',
  Cross = 'Cross',
  CrossCircle = 'CrossCircle',
  Desktop = 'Desktop',
  DocumentInfo = 'DocumentInfo',
  Download = 'Download',
  DownloadAlt = 'DownloadAlt',
  Edit = 'Edit',
  EditAlt = 'EditAlt',
  EllipsisH = 'EllipsisH',
  EllipsisV = 'EllipsisV',
  ExclamationTriangle = 'ExclamationTriangle',
  Export = 'Export',
  Eye = 'Eye',
  FileAlt = 'FileAlt',
  FileExport = 'FileExport',
  Filter = 'Filter',
  Focus = 'Focus',
  FocusTarget = 'FocusTarget',
  Folder = 'Folder',
  Hdd = 'Hdd',
  History = 'History',
  Iiif = 'Iiif',
  Image = 'Image',
  ImagePlus = 'ImagePlus',
  InfoCircle = 'InfoCircle',
  Keyboard = 'Keyboard',
  KeyholeSquare = 'KeyholeSquare',
  Link = 'Link',
  ListOl = 'ListOl',
  ListUl = 'ListUl',
  LocationArrowAlt = 'LocationArrowAlt',
  Map = 'Map',
  Minus = 'Minus',
  Music = 'Music',
  NoIcon = 'NoIcon',
  NoImage = 'NoImage',
  Plus = 'Plus',
  PlusCircle = 'PlusCircle',
  Process = 'Process',
  QuestionCircle = 'QuestionCircle',
  Redo = 'Redo',
  Save = 'Save',
  SearchGlass = 'SearchGlass',
  SearchMinus = 'SearchMinus',
  SearchPlus = 'SearchPlus',
  Settings = 'Settings',
  SignOut = 'SignOut',
  Sort = 'Sort',
  SortDown = 'SortDown',
  SortUp = 'SortUp',
  SquareFull = 'SquareFull',
  Swatchbook = 'Swatchbook',
  Tag = 'Tag',
  Text = 'Text',
  Trash = 'Trash',
  Update = 'Update',
  Upload = 'Upload',
  User = 'User',
  UserCircle = 'UserCircle',
  VideoSlash = 'VideoSlash',
  WindowGrid = 'WindowGrid',
  WindowMaximize = 'WindowMaximize',
}

export enum DeepRelationsFetchStrategy {
  UseExistingBreadcrumbsInfo = 'useExistingBreadcrumbsInfo',
  UseMethodsAndFetch = 'useMethodsAndFetch',
}

export type DeleteEntitiesInput = {
  deleteMediafiles?: InputMaybe<Scalars['Boolean']>;
};

export type DeleteQueryOptions = {
  __typename?: 'DeleteQueryOptions';
  blockingRelationsLabel?: Maybe<Scalars['String']>;
  customQueryBlockingEntityTypes?: Maybe<Array<Maybe<Entitytyping>>>;
  customQueryBlockingRelations?: Maybe<Scalars['String']>;
  customQueryBlockingRelationsFilters?: Maybe<Scalars['String']>;
  customQueryDeleteRelations?: Maybe<Scalars['String']>;
  customQueryDeleteRelationsFilters?: Maybe<Scalars['String']>;
  customQueryEntityTypes?: Maybe<Array<Maybe<Entitytyping>>>;
  deleteEntityLabel: Scalars['String'];
  deleteRelationsLabel?: Maybe<Scalars['String']>;
};

export type DeleteQueryOptionsBlockingRelationsLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type DeleteQueryOptionsCustomQueryBlockingEntityTypesArgs = {
  input?: InputMaybe<Array<InputMaybe<Entitytyping>>>;
};

export type DeleteQueryOptionsCustomQueryBlockingRelationsArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type DeleteQueryOptionsCustomQueryBlockingRelationsFiltersArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type DeleteQueryOptionsCustomQueryDeleteRelationsArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type DeleteQueryOptionsCustomQueryDeleteRelationsFiltersArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type DeleteQueryOptionsCustomQueryEntityTypesArgs = {
  input?: InputMaybe<Array<InputMaybe<Entitytyping>>>;
};

export type DeleteQueryOptionsDeleteEntityLabelArgs = {
  input: Scalars['String'];
};

export type DeleteQueryOptionsDeleteRelationsLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type Directory = {
  __typename?: 'Directory';
  dir?: Maybe<Scalars['String']>;
  has_subdirs?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  parent: Scalars['String'];
};

export type DropdownOption = {
  __typename?: 'DropdownOption';
  actionContext?: Maybe<ActionContext>;
  active?: Maybe<Scalars['Boolean']>;
  availableInPages?: Maybe<Array<Maybe<RouteMatching>>>;
  bulkOperationModal?: Maybe<BulkOperationModal>;
  can?: Maybe<Array<Scalars['String']>>;
  icon?: Maybe<DamsIcons>;
  label: Scalars['String'];
  primary?: Maybe<Scalars['Boolean']>;
  required?: Maybe<Scalars['Boolean']>;
  requiresAuth?: Maybe<Scalars['Boolean']>;
  value: Scalars['StringOrInt'];
};

export type DropdownOptionActionContextArgs = {
  input?: InputMaybe<ActionContextInput>;
};

export type DropdownOptionAvailableInPagesArgs = {
  input?: InputMaybe<Array<InputMaybe<RouteMatchingInput>>>;
};

export type DropdownOptionBulkOperationModalArgs = {
  input?: InputMaybe<BulkOperationInputModal>;
};

export type DropdownOptionInput = {
  actionContext?: InputMaybe<ActionContextInput>;
  active?: InputMaybe<Scalars['Boolean']>;
  availableInPages?: InputMaybe<Array<InputMaybe<RouteMatchingInput>>>;
  bulkOperationModal?: InputMaybe<BulkOperationInputModal>;
  can?: InputMaybe<Array<Scalars['String']>>;
  icon?: InputMaybe<DamsIcons>;
  label: Scalars['String'];
  primary?: InputMaybe<Scalars['Boolean']>;
  requiresAuth?: InputMaybe<Scalars['Boolean']>;
  value: Scalars['StringOrInt'];
};

export type DropzoneEntityToCreate = {
  __typename?: 'DropzoneEntityToCreate';
  options: Array<DropdownOption>;
};

export type DropzoneEntityToCreateOptionsArgs = {
  input: Array<DropdownOptionInput>;
};

export type EditMetadataButton = {
  __typename?: 'EditMetadataButton';
  editmodeLabel?: Maybe<Scalars['String']>;
  hasButton: Scalars['Boolean'];
  readmodeLabel?: Maybe<Scalars['String']>;
};

export type EditMetadataButtonInput = {
  editmodeLabel?: InputMaybe<Scalars['String']>;
  hasButton: Scalars['Boolean'];
  readmodeLabel?: InputMaybe<Scalars['String']>;
};

export enum EditStatus {
  Changed = 'changed',
  Deleted = 'deleted',
  New = 'new',
  Unchanged = 'unchanged',
}

export enum ElodyServices {
  ApolloGraphql = 'apolloGraphql',
  Pwa = 'pwa',
}

export enum ElodyViewers {
  Audio = 'audio',
  Iiif = 'iiif',
  Pdf = 'pdf',
  Text = 'text',
  Video = 'video',
}

export type EndpointInformation = {
  __typename?: 'EndpointInformation';
  endpointName?: Maybe<Scalars['String']>;
  method?: Maybe<Scalars['String']>;
  responseAction?: Maybe<EndpointResponseActions>;
  variables?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type EndpointInformationInput = {
  endpointName?: InputMaybe<Scalars['String']>;
  method?: InputMaybe<Scalars['String']>;
  responseAction?: InputMaybe<EndpointResponseActions>;
  variables?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum EndpointResponseActions {
  DownloadResponse = 'downloadResponse',
  Notification = 'notification',
}

export type EntitiesResults = {
  __typename?: 'EntitiesResults';
  count?: Maybe<Scalars['Int']>;
  facets?: Maybe<Scalars['JSON']>;
  limit?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Maybe<Entity>>>;
  sortKeys?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type EntitiesResultsSortKeysArgs = {
  sortItems?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Entity = {
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type EntityFormInput = {
  metadata: Array<MetadataValuesInput>;
  relations: Array<BaseRelationValuesInput>;
  updateOnlyRelations?: InputMaybe<Scalars['Boolean']>;
};

export type EntityInput = {
  id?: InputMaybe<Scalars['String']>;
  identifiers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFieldInput>>>;
  relations?: InputMaybe<Array<InputMaybe<RelationFieldInput>>>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type EntityListElement = {
  __typename?: 'EntityListElement';
  baseLibraryMode?: Maybe<BaseLibraryModes>;
  can?: Maybe<Array<Scalars['String']>>;
  customBulkOperations?: Maybe<Scalars['String']>;
  customQuery?: Maybe<Scalars['String']>;
  customQueryEntityPickerList?: Maybe<Scalars['String']>;
  customQueryEntityPickerListFilters?: Maybe<Scalars['String']>;
  customQueryFilters?: Maybe<Scalars['String']>;
  customQueryRelationType?: Maybe<Scalars['String']>;
  enableAdvancedFilters?: Maybe<Scalars['Boolean']>;
  enableNavigation?: Maybe<Scalars['Boolean']>;
  entityList?: Maybe<Array<Maybe<Entity>>>;
  entityListElement?: Maybe<EntityListElement>;
  entityTypes?: Maybe<Array<Maybe<Entitytyping>>>;
  fetchDeepRelations?: Maybe<FetchDeepRelations>;
  filtersNeedContext?: Maybe<Array<Maybe<EntitySubelement>>>;
  isCollapsed: Scalars['Boolean'];
  label?: Maybe<Scalars['String']>;
  relationType?: Maybe<Scalars['String']>;
  searchInputType?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  viewMode?: Maybe<EntityListViewMode>;
};

export type EntityListElementBaseLibraryModeArgs = {
  input?: InputMaybe<BaseLibraryModes>;
};

export type EntityListElementCanArgs = {
  input?: InputMaybe<Array<Scalars['String']>>;
};

export type EntityListElementCustomBulkOperationsArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementCustomQueryArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementCustomQueryEntityPickerListArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementCustomQueryEntityPickerListFiltersArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementCustomQueryFiltersArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementCustomQueryRelationTypeArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementEnableAdvancedFiltersArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type EntityListElementEnableNavigationArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type EntityListElementEntityListArgs = {
  metaKey?: InputMaybe<Scalars['String']>;
};

export type EntityListElementEntityTypesArgs = {
  input?: InputMaybe<Array<InputMaybe<Entitytyping>>>;
};

export type EntityListElementFiltersNeedContextArgs = {
  input?: InputMaybe<Array<InputMaybe<EntitySubelement>>>;
};

export type EntityListElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type EntityListElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementRelationTypeArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementSearchInputTypeArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type EntityListElementTypeArgs = {
  input?: InputMaybe<MediaFileElementTypes>;
};

export type EntityListElementViewModeArgs = {
  input?: InputMaybe<EntityListViewMode>;
};

export enum EntityListViewMode {
  Dropdown = 'Dropdown',
  Library = 'Library',
}

export enum EntityPickerMode {
  Emit = 'emit',
  Save = 'save',
}

export enum EntitySubelement {
  IntialValues = 'intialValues',
  RelationValues = 'relationValues',
}

export type EntityViewElements = {
  __typename?: 'EntityViewElements';
  actionElement?: Maybe<ActionElement>;
  entityListElement?: Maybe<EntityListElement>;
  entityViewerElement?: Maybe<EntityViewerElement>;
  graphElement?: Maybe<GraphElement>;
  hierarchyListElement?: Maybe<HierarchyListElement>;
  manifestViewerElement?: Maybe<ManifestViewerElement>;
  mapElement?: Maybe<MapElement>;
  markdownViewerElement?: Maybe<MarkdownViewerElement>;
  mediaFileElement?: Maybe<MediaFileElement>;
  singleMediaFileElement?: Maybe<SingleMediaFileElement>;
  windowElement?: Maybe<WindowElement>;
  wysiwygElement?: Maybe<WysiwygElement>;
};

export type EntityViewerElement = {
  __typename?: 'EntityViewerElement';
  entityId: Scalars['String'];
  label: Scalars['String'];
};

export type EntityViewerElementEntityIdArgs = {
  metadataKey?: InputMaybe<Scalars['String']>;
  relationType?: InputMaybe<Scalars['String']>;
};

export type EntityViewerElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export enum Entitytyping {
  BaseEntity = 'BaseEntity',
  Area = 'area',
  Asset = 'asset',
  BibliographicalReference = 'bibliographical_reference',
  CompositeSite = 'composite_site',
  Creator = 'creator',
  EpiDocTag = 'epi_doc_tag',
  ExternalSigla = 'external_sigla',
  History = 'history',
  Inscription = 'inscription',
  Job = 'job',
  Language = 'language',
  Location = 'location',
  Mediafile = 'mediafile',
  Point = 'point',
  Region = 'region',
  SavedSearch = 'saved_search',
  Script = 'script',
  ShareLink = 'shareLink',
  Site = 'site',
  SiteFunction = 'site_function',
  SiteType = 'site_type',
  Support = 'support',
  Tenant = 'tenant',
  Typology = 'typology',
  User = 'user',
  Word = 'word',
  WritingTechnique = 'writing_technique',
}

export type EpiDocTag = Entity & {
  __typename?: 'EpiDocTag';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum ErrorCodeType {
  Read = 'read',
  Write = 'write',
}

export type ExpandButtonOptions = {
  __typename?: 'ExpandButtonOptions';
  orientation?: Maybe<Orientations>;
  shown: Scalars['Boolean'];
};

export type ExpandButtonOptionsOrientationArgs = {
  input?: InputMaybe<Orientations>;
};

export type ExpandButtonOptionsShownArgs = {
  input: Scalars['Boolean'];
};

export type ExternalSigla = Entity & {
  __typename?: 'ExternalSigla';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type FacetInputInput = {
  facets?: InputMaybe<Array<FacetInputInput>>;
  key?: InputMaybe<Scalars['String']>;
  lookups?: InputMaybe<Array<LookupInput>>;
  type?: InputMaybe<AdvancedFilterTypes>;
  value?: InputMaybe<Scalars['JSON']>;
};

export type FacetInputType = {
  __typename?: 'FacetInputType';
  facets?: Maybe<Array<FacetInputType>>;
  key?: Maybe<Scalars['String']>;
  lookups?: Maybe<Array<LookupInputType>>;
  type?: Maybe<AdvancedFilterTypes>;
  value?: Maybe<Scalars['JSON']>;
};

export type FetchDeepRelations = {
  __typename?: 'FetchDeepRelations';
  amountOfRecursions?: Maybe<Scalars['Int']>;
  deepRelationsFetchStrategy?: Maybe<DeepRelationsFetchStrategy>;
  entityType?: Maybe<Entitytyping>;
  routeConfig?: Maybe<Array<Maybe<BreadCrumbRoute>>>;
};

export type FetchDeepRelationsAmountOfRecursionsArgs = {
  input?: InputMaybe<Scalars['Int']>;
};

export type FetchDeepRelationsDeepRelationsFetchStrategyArgs = {
  input?: InputMaybe<DeepRelationsFetchStrategy>;
};

export type FetchDeepRelationsEntityTypeArgs = {
  input?: InputMaybe<Entitytyping>;
};

export type FetchDeepRelationsRouteConfigArgs = {
  input?: InputMaybe<Array<InputMaybe<BreadCrumbRouteInput>>>;
};

export type FileProgress = {
  __typename?: 'FileProgress';
  steps?: Maybe<Array<Maybe<FileProgressStep>>>;
  type: ActionProgressIndicatorType;
};

export type FileProgressStep = {
  __typename?: 'FileProgressStep';
  label: Scalars['String'];
  status: ProgressStepStatus;
  stepType: ProgressStepType;
};

export enum FileType {
  Alto = 'alto',
  Csv = 'csv',
  Gif = 'gif',
  Jpeg = 'jpeg',
  Jpg = 'jpg',
  Json = 'json',
  Mp3 = 'mp3',
  Mp4 = 'mp4',
  Pdf = 'pdf',
  Png = 'png',
  Svg = 'svg',
  Tif = 'tif',
  Tiff = 'tiff',
  Txt = 'txt',
  Xml = 'xml',
}

export type FilterInput = {
  key: Scalars['String'];
  minMaxInput?: InputMaybe<MinMaxInput>;
  multiSelectInput?: InputMaybe<MultiSelectInput>;
  selectionInput?: InputMaybe<SelectionInput>;
  textInput?: InputMaybe<TextInput>;
  type: AdvancedInputType;
};

export type FilterMatcherMap = {
  __typename?: 'FilterMatcherMap';
  boolean: Array<Scalars['String']>;
  date: Array<Scalars['String']>;
  id: Array<Scalars['String']>;
  metadata_on_relation: Array<Scalars['String']>;
  number: Array<Scalars['String']>;
  selection: Array<Scalars['String']>;
  text: Array<Scalars['String']>;
  type: Array<Scalars['String']>;
};

export type FilterOptionsMappingInput = {
  label?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type FilterOptionsMappingType = {
  __typename?: 'FilterOptionsMappingType';
  label?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Filters = {
  query?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type Form = {
  __typename?: 'Form';
  formTab: FormTab;
  infoLabel?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  modalStyle: ModalStyle;
};

export type FormInfoLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type FormLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type FormModalStyleArgs = {
  input: ModalStyle;
};

export type FormAction = {
  __typename?: 'FormAction';
  actionProgressIndicator?: Maybe<ActionProgress>;
  actionQuery?: Maybe<Scalars['String']>;
  actionType?: Maybe<ActionType>;
  creationType: Entitytyping;
  endpointInformation: EndpointInformation;
  icon?: Maybe<DamsIcons>;
  label: Scalars['String'];
  showsFormErrors?: Maybe<Scalars['Boolean']>;
};

export type FormActionActionQueryArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type FormActionActionTypeArgs = {
  input?: InputMaybe<ActionType>;
};

export type FormActionCreationTypeArgs = {
  input?: InputMaybe<Entitytyping>;
};

export type FormActionEndpointInformationArgs = {
  input: EndpointInformationInput;
};

export type FormActionIconArgs = {
  input?: InputMaybe<DamsIcons>;
};

export type FormActionLabelArgs = {
  input: Scalars['String'];
};

export type FormActionShowsFormErrorsArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type FormFields = {
  __typename?: 'FormFields';
  action?: Maybe<FormAction>;
  metaData: PanelMetaData;
  uploadContainer?: Maybe<UploadContainer>;
};

export type FormTab = {
  __typename?: 'FormTab';
  formFields: FormFields;
};

export type Formatters = LinkFormatter | PillFormatter | RegexpMatchFormatter;

export type GeoJsonFeature = {
  __typename?: 'GeoJsonFeature';
  value?: Maybe<Scalars['JSON']>;
};

export type GeoJsonFeatureValueArgs = {
  coordinates: GeoJsonFeatureInput;
  id: GeoJsonFeatureInput;
  weight: GeoJsonFeatureInput;
};

export type GeoJsonFeatureInput = {
  defaultValue?: InputMaybe<Scalars['JSON']>;
  key: Scalars['String'];
  relationKey?: InputMaybe<Scalars['String']>;
  source: KeyValueSource;
};

export type GraphDataset = {
  __typename?: 'GraphDataset';
  filter?: Maybe<GraphDatasetFilter>;
  labels: Array<Scalars['String']>;
};

export type GraphDatasetFilter = {
  __typename?: 'GraphDatasetFilter';
  key?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Scalars['String']>>;
};

export type GraphDatasetFilterInput = {
  key?: InputMaybe<Scalars['String']>;
  values?: InputMaybe<Array<Scalars['String']>>;
};

export type GraphDatasetInput = {
  filter?: InputMaybe<GraphDatasetFilterInput>;
  labels: Array<Scalars['String']>;
};

export type GraphElement = {
  __typename?: 'GraphElement';
  convert_to?: Maybe<Scalars['String']>;
  datapoints: Scalars['Int'];
  dataset: GraphDataset;
  datasource: Scalars['String'];
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
  timeUnit: TimeUnit;
  type: GraphType;
};

export type GraphElementConvert_ToArgs = {
  input: Scalars['String'];
};

export type GraphElementDatapointsArgs = {
  input: Scalars['Int'];
};

export type GraphElementDatasetArgs = {
  input: GraphDatasetInput;
};

export type GraphElementDatasourceArgs = {
  input: Scalars['String'];
};

export type GraphElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type GraphElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type GraphElementTimeUnitArgs = {
  input: TimeUnit;
};

export type GraphElementTypeArgs = {
  input: GraphType;
};

export type GraphElementInput = {
  convert_to?: InputMaybe<Scalars['String']>;
  datapoints: Scalars['Int'];
  dataset: GraphDatasetInput;
  datasource: Scalars['String'];
  timeUnit: TimeUnit;
};

export enum GraphType {
  Bar = 'bar',
  Bubble = 'bubble',
  Doughnut = 'doughnut',
  Line = 'line',
  Pie = 'pie',
  PolarArea = 'polarArea',
  Radar = 'radar',
  Scatter = 'scatter',
}

export type HiddenField = {
  __typename?: 'HiddenField';
  entityType?: Maybe<Entitytyping>;
  hidden?: Maybe<Scalars['Boolean']>;
  inherited?: Maybe<Scalars['Boolean']>;
  keyToExtractValue?: Maybe<Scalars['String']>;
  relationToExtractKey?: Maybe<Scalars['String']>;
  searchValueForFilter?: Maybe<Scalars['String']>;
};

export type HiddenFieldInput = {
  entityType?: InputMaybe<Entitytyping>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  inherited?: InputMaybe<Scalars['Boolean']>;
  keyToExtractValue?: InputMaybe<Scalars['String']>;
  relationToExtractKey?: InputMaybe<Scalars['String']>;
  searchValueForFilter?: InputMaybe<Scalars['String']>;
};

export type HierarchyListElement = {
  __typename?: 'HierarchyListElement';
  can?: Maybe<Array<Maybe<Scalars['String']>>>;
  centerCoordinatesKey: Scalars['String'];
  customQuery: Scalars['String'];
  entityTypeAsCenterPoint?: Maybe<Entitytyping>;
  hierarchyRelationList: Array<Maybe<HierarchyRelationList>>;
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
};

export type HierarchyListElementCanArgs = {
  input?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type HierarchyListElementCenterCoordinatesKeyArgs = {
  input: Scalars['String'];
};

export type HierarchyListElementCustomQueryArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type HierarchyListElementEntityTypeAsCenterPointArgs = {
  input?: InputMaybe<Entitytyping>;
};

export type HierarchyListElementHierarchyRelationListArgs = {
  input?: InputMaybe<Array<InputMaybe<HierarchyRelationListInput>>>;
};

export type HierarchyListElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type HierarchyListElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type HierarchyRelationList = {
  __typename?: 'HierarchyRelationList';
  entityType: Entitytyping;
  key: Scalars['String'];
};

export type HierarchyRelationListInput = {
  entityType: Entitytyping;
  key: Scalars['String'];
};

export type ImportReturn = {
  __typename?: 'ImportReturn';
  count?: Maybe<Scalars['Int']>;
  message_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
};

export type InheritFromInput = {
  entityType: Entitytyping;
  relationKey: Scalars['String'];
  valueKey: Scalars['String'];
};

export type InputField = {
  __typename?: 'InputField';
  advancedFilterInputForRetrievingAllOptions?: Maybe<
    Array<AdvancedFilterInputType>
  >;
  advancedFilterInputForRetrievingOptions?: Maybe<
    Array<AdvancedFilterInputType>
  >;
  advancedFilterInputForRetrievingRelatedOptions?: Maybe<
    Array<AdvancedFilterInputType>
  >;
  advancedFilterInputForSearchingOptions?: Maybe<AdvancedFilterInputType>;
  autoSelectable?: Maybe<Scalars['Boolean']>;
  canCreateEntityFromOption?: Maybe<Scalars['Boolean']>;
  dependsOn?: Maybe<Scalars['String']>;
  disabled?: Maybe<Scalars['Boolean']>;
  entityType?: Maybe<Scalars['String']>;
  fieldKeyToSave?: Maybe<Scalars['String']>;
  fieldName?: Maybe<Scalars['String']>;
  fileProgressSteps?: Maybe<FileProgress>;
  fileTypes?: Maybe<Array<Maybe<FileType>>>;
  fromRelationType?: Maybe<Scalars['String']>;
  hasVirtualKeyboard?: Maybe<Scalars['Boolean']>;
  isMetadataField?: Maybe<Scalars['Boolean']>;
  lineClamp?: Maybe<Scalars['String']>;
  maxAmountOfFiles?: Maybe<Scalars['Int']>;
  maxFileSize?: Maybe<Scalars['String']>;
  metadataKeyToCreateEntityFromOption?: Maybe<Scalars['String']>;
  multiple?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Array<Maybe<DropdownOption>>>;
  relationFilter?: Maybe<AdvancedFilterInputType>;
  relationType?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  uploadMultiple?: Maybe<Scalars['Boolean']>;
  validation?: Maybe<Validation>;
};

export type InputFieldFieldKeyToSaveArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type InputFieldFieldNameArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type InputFieldIsMetadataFieldArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type InputFieldValidationArgs = {
  input?: InputMaybe<ValidationInput>;
};

export enum InputFieldTypes {
  BaseEntityPickerField = 'baseEntityPickerField',
  BaseFileSystemImportField = 'baseFileSystemImportField',
  BaseMagazineWithCsvImportField = 'baseMagazineWithCsvImportField',
  BaseMagazineWithMetsImportField = 'baseMagazineWithMetsImportField',
  BaseMediafilesWithOcrImportField = 'baseMediafilesWithOcrImportField',
  Checkbox = 'checkbox',
  Color = 'color',
  CsvUpload = 'csvUpload',
  Date = 'date',
  Dropdown = 'dropdown',
  DropdownMultiselectMetadata = 'dropdownMultiselectMetadata',
  DropdownMultiselectRelations = 'dropdownMultiselectRelations',
  DropdownSingleselectMetadata = 'dropdownSingleselectMetadata',
  DropdownSingleselectRelations = 'dropdownSingleselectRelations',
  FileUpload = 'fileUpload',
  Number = 'number',
  Radio = 'radio',
  Range = 'range',
  ResizableTextarea = 'resizableTextarea',
  Text = 'text',
  Textarea = 'textarea',
  XmlUpload = 'xmlUpload',
}

export type Inscription = Entity & {
  __typename?: 'Inscription';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type IntialValues = {
  __typename?: 'IntialValues';
  id: Scalars['String'];
  keyLabel?: Maybe<Scalars['JSON']>;
  keyValue?: Maybe<Scalars['JSON']>;
  relationMetadata?: Maybe<IntialValues>;
};

export type IntialValuesKeyLabelArgs = {
  key: Scalars['String'];
  source: KeyValueSource;
};

export type IntialValuesKeyValueArgs = {
  containsRelationPropertyKey?: InputMaybe<Scalars['String']>;
  containsRelationPropertyValue?: InputMaybe<Scalars['String']>;
  formatter?: InputMaybe<Scalars['String']>;
  key: Scalars['String'];
  keyOnMetadata?: InputMaybe<Scalars['String']>;
  metadataKeyAsLabel?: InputMaybe<Scalars['String']>;
  relationEntityType?: InputMaybe<Scalars['String']>;
  relationKey?: InputMaybe<Scalars['String']>;
  rootKeyAsLabel?: InputMaybe<Scalars['String']>;
  source: KeyValueSource;
  technicalOrigin?: InputMaybe<Scalars['String']>;
  uuid?: InputMaybe<Scalars['String']>;
};

export type IntialValuesRelationMetadataArgs = {
  type: Scalars['String'];
};

export type Job = Entity & {
  __typename?: 'Job';
  _id?: Maybe<Scalars['String']>;
  _key?: Maybe<Scalars['String']>;
  _rev?: Maybe<Scalars['String']>;
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  amount_of_jobs?: Maybe<Scalars['Int']>;
  asset_id?: Maybe<Scalars['String']>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  completed_jobs?: Maybe<Scalars['Int']>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  end_time?: Maybe<Scalars['String']>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  job_info?: Maybe<Scalars['String']>;
  job_type?: Maybe<Scalars['String']>;
  mapElement?: Maybe<MapElement>;
  mediafile_id?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  parent_job_id?: Maybe<Scalars['String']>;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  start_time?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  sub_jobs?: Maybe<SubJobResults>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  user?: Maybe<Scalars['String']>;
  uuid: Scalars['String'];
};

export enum JobType {
  All = 'all',
  CsvImport = 'csv_import',
  CsvRead = 'csv_read',
  CsvRowImport = 'csv_row_import',
  UploadFile = 'upload_file',
  UploadTranscode = 'upload_transcode',
}

export type JobsResults = {
  __typename?: 'JobsResults';
  count?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  next?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Maybe<Job>>>;
};

export type KeyAndValue = {
  __typename?: 'KeyAndValue';
  key: Scalars['String'];
  value: Scalars['String'];
};

export type KeyValue = {
  __typename?: 'KeyValue';
  keyValue: Scalars['JSON'];
};

export type KeyValueKeyValueArgs = {
  key: Scalars['String'];
};

export enum KeyValueSource {
  Derivatives = 'derivatives',
  Metadata = 'metadata',
  MetadataOrRelation = 'metadataOrRelation',
  RelationMetadata = 'relationMetadata',
  RelationRootdata = 'relationRootdata',
  Relations = 'relations',
  Root = 'root',
  TechnicalMetadata = 'technicalMetadata',
}

export type Language = Entity & {
  __typename?: 'Language';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type LinkFormatter = {
  __typename?: 'LinkFormatter';
  label: Scalars['String'];
  link: Scalars['String'];
  value: Scalars['String'];
};

export enum ListItemCoverageTypes {
  AllListItems = 'AllListItems',
  OneListItem = 'OneListItem',
}

export type Location = Entity & {
  __typename?: 'Location';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type LookupInput = {
  as: Scalars['String'];
  foreign_field: Scalars['String'];
  from: Scalars['String'];
  local_field: Scalars['String'];
};

export type LookupInputType = {
  __typename?: 'LookupInputType';
  as: Scalars['String'];
  foreign_field: Scalars['String'];
  from: Scalars['String'];
  local_field: Scalars['String'];
};

export type ManifestViewerElement = {
  __typename?: 'ManifestViewerElement';
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
  manifestUrl: Scalars['String'];
  manifestVersion: Scalars['Int'];
};

export type ManifestViewerElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type ManifestViewerElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type ManifestViewerElementManifestUrlArgs = {
  metadataKey: Scalars['String'];
};

export type ManifestViewerElementManifestVersionArgs = {
  metadataKey: Scalars['String'];
};

export type MapElement = {
  __typename?: 'MapElement';
  center: Scalars['String'];
  config?: Maybe<Array<Maybe<ConfigItem>>>;
  geoJsonFeature?: Maybe<GeoJsonFeature>;
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
  mapMetadata?: Maybe<MapMetadata>;
  metaData: PanelMetaData;
  type: Scalars['String'];
};

export type MapElementCenterArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type MapElementConfigArgs = {
  input?: InputMaybe<Array<InputMaybe<ConfigItemInput>>>;
};

export type MapElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type MapElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type MapElementTypeArgs = {
  input?: InputMaybe<MapTypes>;
};

export type MapMetadata = {
  __typename?: 'MapMetadata';
  value: Scalars['JSON'];
};

export type MapMetadataValueArgs = {
  defaultValue?: InputMaybe<Scalars['JSON']>;
  key: Scalars['String'];
  relationKey?: InputMaybe<Scalars['String']>;
  source: KeyValueSource;
};

export enum MapTypes {
  HeatMap = 'heatMap',
  WktMap = 'wktMap',
}

export type MarkdownViewerElement = {
  __typename?: 'MarkdownViewerElement';
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
  markdownContent: Scalars['String'];
};

export type MarkdownViewerElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type MarkdownViewerElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type MarkdownViewerElementMarkdownContentArgs = {
  metadataKey: Scalars['String'];
};

export type MatchMetadataValue = {
  __typename?: 'MatchMetadataValue';
  matchKey?: Maybe<Scalars['String']>;
  matchValue?: Maybe<Scalars['String']>;
};

export type MatchMetadataValueInput = {
  matchKey?: InputMaybe<Scalars['String']>;
  matchValue?: InputMaybe<Scalars['String']>;
};

export enum Matchers {
  AnyMatcher = 'AnyMatcher',
  ContainsMatcher = 'ContainsMatcher',
  ExactMatcher = 'ExactMatcher',
  InBetweenMatcher = 'InBetweenMatcher',
  MaxIncludedMatcher = 'MaxIncludedMatcher',
  MinIncludedMatcher = 'MinIncludedMatcher',
  NoneMatcher = 'NoneMatcher',
}

export type Media = Entity & {
  __typename?: 'Media';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type MediaFile = {
  __typename?: 'MediaFile';
  _id: Scalars['String'];
  entities?: Maybe<Array<Maybe<Scalars['String']>>>;
  filename?: Maybe<Scalars['String']>;
  isPublic?: Maybe<Scalars['Boolean']>;
  is_primary?: Maybe<Scalars['Boolean']>;
  is_primary_thumbnail?: Maybe<Scalars['Boolean']>;
  metadata?: Maybe<Array<Maybe<MediaFileMetadata>>>;
  mimetype?: Maybe<Scalars['String']>;
  original_file_location?: Maybe<Scalars['String']>;
  thumbnail_file_location?: Maybe<Scalars['String']>;
  transcode_filename?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
};

export type MediaFileElement = {
  __typename?: 'MediaFileElement';
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
  metaData: PanelMetaData;
  type: Scalars['String'];
};

export type MediaFileElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type MediaFileElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type MediaFileElementTypeArgs = {
  input?: InputMaybe<MediaFileElementTypes>;
};

export enum MediaFileElementTypes {
  Map = 'map',
  Media = 'media',
}

export type MediaFileEntity = Entity & {
  __typename?: 'MediaFileEntity';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  mapElement?: Maybe<MapElement>;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type MediaFileInput = {
  _id?: InputMaybe<Scalars['String']>;
  entities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  filename?: InputMaybe<Scalars['String']>;
  is_primary?: InputMaybe<Scalars['Boolean']>;
  is_primary_thumbnail?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Array<InputMaybe<MediaFileMetadataInput>>>;
  mimetype?: InputMaybe<Scalars['String']>;
  original_file_location?: InputMaybe<Scalars['String']>;
  thumbnail_file_location?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
};

export type MediaFileMetadata = {
  __typename?: 'MediaFileMetadata';
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type MediaFileMetadataInput = {
  key?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type MediaFilePostReturn = {
  __typename?: 'MediaFilePostReturn';
  url?: Maybe<Scalars['String']>;
};

export enum MediaTypeEntities {
  Asset = 'asset',
  Mediafile = 'mediafile',
}

export type Menu = {
  __typename?: 'Menu';
  menuItem?: Maybe<MenuItem>;
  name: Scalars['String'];
};

export type MenuMenuItemArgs = {
  can?: InputMaybe<Array<Scalars['String']>>;
  entityType?: InputMaybe<Entitytyping>;
  icon?: InputMaybe<MenuIcons>;
  isLoggedIn?: InputMaybe<Scalars['Boolean']>;
  label: Scalars['String'];
  requiresAuth?: InputMaybe<Scalars['Boolean']>;
  typeLink?: InputMaybe<MenuTypeLinkInput>;
};

export enum MenuIcons {
  Anpr = 'Anpr',
  ArchiveAlt = 'ArchiveAlt',
  BookOpen = 'BookOpen',
  BrightnessPlus = 'BrightnessPlus',
  Car = 'Car',
  CloudBookmark = 'CloudBookmark',
  Compass = 'Compass',
  Create = 'Create',
  Database = 'Database',
  Download = 'Download',
  Draggabledots = 'Draggabledots',
  ExclamationTriangle = 'ExclamationTriangle',
  FileInfoAlt = 'FileInfoAlt',
  Focus = 'Focus',
  FocusTarget = 'FocusTarget',
  Font = 'Font',
  Globe = 'Globe',
  Hdd = 'Hdd',
  History = 'History',
  Image = 'Image',
  InfoCircle = 'InfoCircle',
  Iot = 'Iot',
  KeyholeSquare = 'KeyholeSquare',
  ListUl = 'ListUl',
  LocationArrowAlt = 'LocationArrowAlt',
  LocationPoint = 'LocationPoint',
  MapMarker = 'MapMarker',
  MapMarkerInfo = 'MapMarkerInfo',
  MapPin = 'MapPin',
  Police = 'Police',
  Process = 'Process',
  Settings = 'Settings',
  Swatchbook = 'Swatchbook',
  Update = 'Update',
  Upload = 'Upload',
  UserSquare = 'UserSquare',
}

export type MenuItem = {
  __typename?: 'MenuItem';
  can?: Maybe<Array<Scalars['String']>>;
  entityType?: Maybe<Entitytyping>;
  icon?: Maybe<MenuIcons>;
  isLoggedIn?: Maybe<Scalars['Boolean']>;
  label: Scalars['String'];
  requiresAuth?: Maybe<Scalars['Boolean']>;
  subMenu?: Maybe<Menu>;
  typeLink?: Maybe<MenuTypeLink>;
};

export type MenuItemSubMenuArgs = {
  name: Scalars['String'];
};

export type MenuTypeLink = {
  __typename?: 'MenuTypeLink';
  modal?: Maybe<MenuTypeLinkModal>;
  route?: Maybe<MenuTypeLinkRoute>;
};

export type MenuTypeLinkInput = {
  modal?: InputMaybe<MenuTypeLinkInputModal>;
  route?: InputMaybe<MenuTypeLinkInputRoute>;
};

export type MenuTypeLinkInputModal = {
  askForCloseConfirmation?: InputMaybe<Scalars['Boolean']>;
  formQuery?: InputMaybe<Scalars['String']>;
  neededPermission?: InputMaybe<Permission>;
  typeModal: TypeModals;
};

export type MenuTypeLinkInputRoute = {
  destination: Scalars['String'];
};

export type MenuTypeLinkModal = {
  __typename?: 'MenuTypeLinkModal';
  askForCloseConfirmation?: Maybe<Scalars['Boolean']>;
  formQuery?: Maybe<Scalars['String']>;
  neededPermission?: Maybe<Permission>;
  typeModal: TypeModals;
};

export type MenuTypeLinkRoute = {
  __typename?: 'MenuTypeLinkRoute';
  destination: Scalars['String'];
};

export type MenuWrapper = {
  __typename?: 'MenuWrapper';
  menu: Menu;
};

export type Metadata = {
  __typename?: 'Metadata';
  immutable?: Maybe<Scalars['Boolean']>;
  key: Scalars['String'];
  label: Scalars['String'];
  lang?: Maybe<Scalars['String']>;
  unit?: Maybe<Unit>;
  value: Scalars['JSON'];
};

export type MetadataUnitArgs = {
  input?: InputMaybe<Unit>;
};

export type MetadataAndRelation = Metadata | MetadataRelation;

export type MetadataField = {
  __typename?: 'MetadataField';
  active?: Maybe<Scalars['Boolean']>;
  config_key?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<MetadataFieldOption>>>;
  order?: Maybe<Scalars['Int']>;
  type: InputFieldTypes;
};

export type MetadataFieldInput = {
  key: Scalars['String'];
  value?: InputMaybe<Scalars['JSON']>;
};

export type MetadataFieldOption = {
  __typename?: 'MetadataFieldOption';
  label?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type MetadataFieldOptionInput = {
  label?: InputMaybe<Scalars['String']>;
  value: Scalars['String'];
};

export type MetadataFormInput = {
  Metadata?: InputMaybe<Array<InputMaybe<MetadataFieldInput>>>;
  relations?: InputMaybe<Array<InputMaybe<RelationInput>>>;
};

export type MetadataInput = {
  immutable?: InputMaybe<Scalars['Boolean']>;
  key: Scalars['String'];
  label?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['JSON']>;
};

export type MetadataRelation = {
  __typename?: 'MetadataRelation';
  key: Scalars['String'];
  label: Scalars['String'];
  linkedEntity?: Maybe<Entity>;
  metadataOnRelation?: Maybe<Array<Maybe<KeyAndValue>>>;
  type?: Maybe<Scalars['String']>;
  value: Scalars['JSON'];
};

export type MetadataValuesInput = {
  key: Scalars['String'];
  lang?: InputMaybe<Scalars['String']>;
  value: Scalars['JSON'];
};

export type MinMaxInput = {
  isRelation?: InputMaybe<Scalars['Boolean']>;
  max?: InputMaybe<Scalars['Int']>;
  min?: InputMaybe<Scalars['Int']>;
};

export enum ModalStyle {
  Center = 'center',
  CenterWide = 'centerWide',
  Left = 'left',
  Right = 'right',
  RightWide = 'rightWide',
}

export type MultiSelectInput = {
  AndOrValue?: InputMaybe<Scalars['Boolean']>;
  value?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateEntity?: Maybe<Entity>;
  bulkAddRelations?: Maybe<Scalars['String']>;
  bulkDeleteEntities?: Maybe<Scalars['String']>;
  deleteData?: Maybe<Scalars['String']>;
  generateTranscode?: Maybe<Scalars['String']>;
  getAssetsRelationedWithMediafFile?: Maybe<Array<Maybe<Asset>>>;
  getMediaRelationedWithMediafFile?: Maybe<Array<Maybe<Media>>>;
  linkMediafileToEntity?: Maybe<MediaFile>;
  mutateEntityValues?: Maybe<Entity>;
  patchMediaFileMetadata?: Maybe<MediaFile>;
  postStartImport?: Maybe<ImportReturn>;
  setPrimaryMediafile?: Maybe<Scalars['JSON']>;
  setPrimaryThumbnail?: Maybe<Scalars['JSON']>;
  updateMetadataWithCsv?: Maybe<Scalars['String']>;
};

export type MutationCreateEntityArgs = {
  entity: EntityInput;
  tenantId?: InputMaybe<Scalars['String']>;
};

export type MutationBulkAddRelationsArgs = {
  entityIds: Array<Scalars['String']>;
  relationEntityId: Scalars['String'];
  relationType: Scalars['String'];
};

export type MutationBulkDeleteEntitiesArgs = {
  deleteEntities?: InputMaybe<DeleteEntitiesInput>;
  ids: Array<Scalars['String']>;
  path: Collection;
  skipItemsWithRelationDuringBulkDelete?: InputMaybe<Array<Scalars['String']>>;
};

export type MutationDeleteDataArgs = {
  deleteMediafiles: Scalars['Boolean'];
  id: Scalars['String'];
  path: Collection;
};

export type MutationGenerateTranscodeArgs = {
  masterEntityId?: InputMaybe<Scalars['String']>;
  mediafileIds: Array<Scalars['String']>;
  transcodeType: TranscodeType;
};

export type MutationGetAssetsRelationedWithMediafFileArgs = {
  mediaFileId: Scalars['String'];
};

export type MutationGetMediaRelationedWithMediafFileArgs = {
  mediaFileId: Scalars['String'];
};

export type MutationLinkMediafileToEntityArgs = {
  entityId: Scalars['String'];
  mediaFileInput: MediaFileInput;
};

export type MutationMutateEntityValuesArgs = {
  collection: Collection;
  formInput: EntityFormInput;
  id: Scalars['String'];
  preferredLanguage?: InputMaybe<Scalars['String']>;
};

export type MutationPatchMediaFileMetadataArgs = {
  MediaFileMetadata: Array<InputMaybe<MediaFileMetadataInput>>;
  MediafileId: Scalars['String'];
};

export type MutationPostStartImportArgs = {
  folder: Scalars['String'];
};

export type MutationSetPrimaryMediafileArgs = {
  entityId: Scalars['String'];
  mediafileId: Scalars['String'];
};

export type MutationSetPrimaryThumbnailArgs = {
  entityId: Scalars['String'];
  mediafileId: Scalars['String'];
};

export type MutationUpdateMetadataWithCsvArgs = {
  csv: Scalars['String'];
  entityType: Scalars['String'];
};

export enum OcrType {
  Alto = 'alto',
  ManualUpload = 'manualUpload',
  Pdf = 'pdf',
  Txt = 'txt',
}

export enum Operator {
  And = 'and',
  Or = 'or',
}

export enum Orientations {
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Top = 'top',
}

export type PaginationInfo = {
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type PaginationLimitOptions = {
  __typename?: 'PaginationLimitOptions';
  options: Array<DropdownOption>;
};

export type PaginationLimitOptionsOptionsArgs = {
  input: Array<DropdownOptionInput>;
};

export type PanelInfo = {
  __typename?: 'PanelInfo';
  inputField: InputField;
  label: Scalars['String'];
  value: Scalars['String'];
};

export type PanelInfoInputFieldArgs = {
  type: BaseFieldType;
};

export type PanelInfoLabelArgs = {
  input: Scalars['String'];
};

export type PanelInfoValueArgs = {
  input: Scalars['String'];
};

export type PanelLink = {
  __typename?: 'PanelLink';
  key: Scalars['String'];
  label: Scalars['String'];
  linkIcon?: Maybe<DamsIcons>;
  linkText?: Maybe<Scalars['String']>;
};

export type PanelLinkKeyArgs = {
  input: Scalars['String'];
};

export type PanelLinkLabelArgs = {
  input: Scalars['String'];
};

export type PanelLinkLinkIconArgs = {
  input: DamsIcons;
};

export type PanelLinkLinkTextArgs = {
  input: Scalars['String'];
};

export type PanelMetaData = {
  __typename?: 'PanelMetaData';
  can?: Maybe<Array<Maybe<Scalars['String']>>>;
  copyToClipboard?: Maybe<Scalars['Boolean']>;
  customValue?: Maybe<Scalars['String']>;
  hiddenField?: Maybe<HiddenField>;
  inputField: InputField;
  isMultilingual?: Maybe<Scalars['Boolean']>;
  key: Scalars['String'];
  label: Scalars['String'];
  lineClamp: Scalars['String'];
  linkText?: Maybe<Scalars['String']>;
  showOnlyInEditMode?: Maybe<Scalars['Boolean']>;
  tooltip: Scalars['String'];
  unit: Unit;
  valueTooltip?: Maybe<PanelMetadataValueTooltip>;
  valueTranslationKey?: Maybe<Scalars['String']>;
};

export type PanelMetaDataCanArgs = {
  input?: InputMaybe<Array<Scalars['String']>>;
};

export type PanelMetaDataCopyToClipboardArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PanelMetaDataCustomValueArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type PanelMetaDataHiddenFieldArgs = {
  input: HiddenFieldInput;
};

export type PanelMetaDataInputFieldArgs = {
  type: BaseFieldType;
};

export type PanelMetaDataIsMultilingualArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PanelMetaDataKeyArgs = {
  input: Scalars['String'];
};

export type PanelMetaDataLabelArgs = {
  input: Scalars['String'];
};

export type PanelMetaDataLineClampArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type PanelMetaDataLinkTextArgs = {
  input: Scalars['String'];
};

export type PanelMetaDataShowOnlyInEditModeArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PanelMetaDataTooltipArgs = {
  input: Scalars['String'];
};

export type PanelMetaDataUnitArgs = {
  input: Unit;
};

export type PanelMetaDataValueTooltipArgs = {
  input?: InputMaybe<PanelMetadataValueTooltipInput>;
};

export type PanelMetaDataValueTranslationKeyArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type PanelMetadataValueTooltip = {
  __typename?: 'PanelMetadataValueTooltip';
  type: PanelMetadataValueTooltipTypes;
  value?: Maybe<Scalars['String']>;
};

export type PanelMetadataValueTooltipInput = {
  type: PanelMetadataValueTooltipTypes;
};

export enum PanelMetadataValueTooltipTypes {
  Plane = 'plane',
  Preview = 'preview',
}

export type PanelRelation = {
  __typename?: 'PanelRelation';
  label?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type PanelRelationMetaData = {
  __typename?: 'PanelRelationMetaData';
  inputField: InputField;
  key: Scalars['String'];
  label: Scalars['String'];
  linkText?: Maybe<Scalars['String']>;
  showOnlyInEditMode?: Maybe<Scalars['Boolean']>;
  unit: Unit;
};

export type PanelRelationMetaDataInputFieldArgs = {
  type: BaseFieldType;
};

export type PanelRelationMetaDataKeyArgs = {
  input: Scalars['String'];
};

export type PanelRelationMetaDataLabelArgs = {
  input: Scalars['String'];
};

export type PanelRelationMetaDataLinkTextArgs = {
  input: Scalars['String'];
};

export type PanelRelationMetaDataShowOnlyInEditModeArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PanelRelationMetaDataUnitArgs = {
  input: Unit;
};

export type PanelRelationRootData = {
  __typename?: 'PanelRelationRootData';
  inputField: InputField;
  key: Scalars['String'];
  label: Scalars['String'];
  linkText?: Maybe<Scalars['String']>;
  showOnlyInEditMode?: Maybe<Scalars['Boolean']>;
  unit: Unit;
};

export type PanelRelationRootDataInputFieldArgs = {
  type: BaseFieldType;
};

export type PanelRelationRootDataKeyArgs = {
  input: Scalars['String'];
};

export type PanelRelationRootDataLabelArgs = {
  input: Scalars['String'];
};

export type PanelRelationRootDataLinkTextArgs = {
  input: Scalars['String'];
};

export type PanelRelationRootDataShowOnlyInEditModeArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PanelRelationRootDataUnitArgs = {
  input: Unit;
};

export type PanelThumbnail = {
  __typename?: 'PanelThumbnail';
  customUrl?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  key?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
};

export type PanelThumbnailCustomUrlArgs = {
  input: Scalars['String'];
};

export type PanelThumbnailFilenameArgs = {
  fromMediafile?: InputMaybe<Scalars['Boolean']>;
  input?: InputMaybe<Scalars['String']>;
};

export type PanelThumbnailHeightArgs = {
  input: Scalars['Int'];
};

export type PanelThumbnailKeyArgs = {
  input: Scalars['String'];
};

export type PanelThumbnailWidthArgs = {
  input: Scalars['Int'];
};

export enum PanelType {
  BulkData = 'bulkData',
  Map = 'map',
  Mediainfo = 'mediainfo',
  Metadata = 'metadata',
  Relation = 'relation',
}

export enum Permission {
  Cancreate = 'cancreate',
  Candelete = 'candelete',
  Canread = 'canread',
  Canupdate = 'canupdate',
}

export type PermissionMapping = {
  __typename?: 'PermissionMapping';
  hasPermission: Scalars['Boolean'];
  permission: Permission;
};

export type PermissionRequestInfo = {
  __typename?: 'PermissionRequestInfo';
  body: Scalars['JSON'];
  crud: Scalars['String'];
  datasource: Scalars['String'];
  uri: Scalars['String'];
};

export type PermissionResult = {
  __typename?: 'PermissionResult';
  hasPermission: Scalars['Boolean'];
  permission: Scalars['String'];
};

export type PillFormatter = {
  __typename?: 'PillFormatter';
  background: Scalars['String'];
  text: Scalars['String'];
};

export type Point = Entity & {
  __typename?: 'Point';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type PreviewComponent = {
  __typename?: 'PreviewComponent';
  listItemsCoverage: ListItemCoverageTypes;
  metadataPreviewQuery?: Maybe<Scalars['String']>;
  openByDefault?: Maybe<Scalars['Boolean']>;
  previewQuery?: Maybe<Scalars['String']>;
  showCurrentPreviewFlow?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  type: PreviewTypes;
};

export type PreviewComponentListItemsCoverageArgs = {
  input: ListItemCoverageTypes;
};

export type PreviewComponentMetadataPreviewQueryArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type PreviewComponentOpenByDefaultArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PreviewComponentPreviewQueryArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type PreviewComponentShowCurrentPreviewFlowArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type PreviewComponentTitleArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type PreviewComponentTypeArgs = {
  input: PreviewTypes;
};

export enum PreviewTypes {
  ColumnList = 'ColumnList',
  Map = 'Map',
  MediaViewer = 'MediaViewer',
}

export enum ProgressStepStatus {
  Complete = 'complete',
  Empty = 'empty',
  Failed = 'failed',
  Incomplete = 'incomplete',
  Loading = 'loading',
  Paused = 'paused',
}

export enum ProgressStepType {
  Prepare = 'prepare',
  Upload = 'upload',
  Validate = 'validate',
}

export type Query = {
  __typename?: 'Query';
  AdvancedPermission: Scalars['JSON'];
  AdvancedPermissions: Array<PermissionResult>;
  BulkOperationCsvExportKeys: BulkOperationCsvExportKeys;
  BulkOperations: Entity;
  BulkOperationsRelationForm: WindowElement;
  CustomBulkOperations: Entity;
  CustomFormattersSettings: Scalars['JSON'];
  Directories?: Maybe<Array<Maybe<Directory>>>;
  DownloadItemsInZip?: Maybe<Entity>;
  DropzoneEntityToCreate: DropzoneEntityToCreate;
  Entities?: Maybe<EntitiesResults>;
  EntitiesByAdvancedSearch: EntitiesResults;
  Entity?: Maybe<Entity>;
  EntityTypeFilters: Entity;
  EntityTypeSortOptions: Entity;
  FetchMediafilesOfEntity: Array<Maybe<MediaFileEntity>>;
  FilterMatcherMapping: FilterMatcherMap;
  FilterOptions: Array<DropdownOption>;
  GenerateOcrWithAsset?: Maybe<Scalars['JSON']>;
  GeoFilterForMap?: Maybe<AdvancedFilters>;
  GetDynamicForm: Form;
  GetEntityDetailContextMenuActions: ContextMenuActions;
  GraphData: Scalars['JSON'];
  Job?: Maybe<Job>;
  Jobs?: Maybe<JobsResults>;
  Menu?: Maybe<MenuWrapper>;
  PaginationLimitOptions: PaginationLimitOptions;
  PermissionMapping: Scalars['JSON'];
  PermissionMappingCreate: Scalars['Boolean'];
  PermissionMappingEntityDetail: Array<PermissionMapping>;
  PermissionMappingPerEntityType: Scalars['Boolean'];
  PreviewComponents?: Maybe<Entity>;
  PreviewElement?: Maybe<ColumnList>;
  Tenants?: Maybe<EntitiesResults>;
  User?: Maybe<User>;
  UserPermissions?: Maybe<UserPermissions>;
  getMediafile?: Maybe<MediaFile>;
};

export type QueryAdvancedPermissionArgs = {
  childEntityId?: InputMaybe<Scalars['String']>;
  parentEntityId?: InputMaybe<Scalars['String']>;
  permission: Scalars['String'];
};

export type QueryAdvancedPermissionsArgs = {
  childEntityId?: InputMaybe<Scalars['String']>;
  parentEntityId?: InputMaybe<Scalars['String']>;
  permissions: Array<Scalars['String']>;
};

export type QueryBulkOperationCsvExportKeysArgs = {
  entityType: Scalars['String'];
};

export type QueryBulkOperationsArgs = {
  entityType: Scalars['String'];
};

export type QueryDirectoriesArgs = {
  dir?: InputMaybe<Scalars['String']>;
};

export type QueryDownloadItemsInZipArgs = {
  basicCsv: Scalars['Boolean'];
  downloadEntity: EntityInput;
  entities: Array<InputMaybe<Scalars['String']>>;
  includeAssetCsv: Scalars['Boolean'];
  mediafiles: Array<InputMaybe<Scalars['String']>>;
};

export type QueryEntitiesArgs = {
  advancedFilterInputs: Array<AdvancedFilterInput>;
  advancedSearchValue?: InputMaybe<Array<InputMaybe<FilterInput>>>;
  fetchPolicy?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  preferredLanguage?: InputMaybe<Scalars['String']>;
  searchInputType?: InputMaybe<SearchInputType>;
  searchValue: SearchFilter;
  skip?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Entitytyping>;
};

export type QueryEntitiesByAdvancedSearchArgs = {
  facet_by: Scalars['String'];
  filter_by: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  q: Scalars['String'];
  query_by: Scalars['String'];
  query_by_weights: Scalars['String'];
  sort_by: Scalars['String'];
};

export type QueryEntityArgs = {
  id: Scalars['String'];
  preferredLanguage?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type QueryEntityTypeFiltersArgs = {
  type: Scalars['String'];
};

export type QueryEntityTypeSortOptionsArgs = {
  entityType: Scalars['String'];
};

export type QueryFetchMediafilesOfEntityArgs = {
  entityIds: Array<Scalars['String']>;
};

export type QueryFilterOptionsArgs = {
  entityType: Scalars['String'];
  input: Array<AdvancedFilterInput>;
  limit: Scalars['Int'];
};

export type QueryGenerateOcrWithAssetArgs = {
  assetId: Scalars['String'];
  language: Scalars['String'];
  operation: Array<Scalars['String']>;
};

export type QueryGraphDataArgs = {
  graph: GraphElementInput;
  id: Scalars['String'];
};

export type QueryJobArgs = {
  failed: Scalars['Boolean'];
  id: Scalars['String'];
};

export type QueryJobsArgs = {
  failed: Scalars['Boolean'];
  filters?: InputMaybe<Filters>;
  paginationInfo?: InputMaybe<PaginationInfo>;
};

export type QueryMenuArgs = {
  name: Scalars['String'];
};

export type QueryPermissionMappingArgs = {
  entities: Array<InputMaybe<Scalars['String']>>;
};

export type QueryPermissionMappingCreateArgs = {
  entityType: Scalars['String'];
};

export type QueryPermissionMappingEntityDetailArgs = {
  entityType: Scalars['String'];
  id: Scalars['String'];
};

export type QueryPermissionMappingPerEntityTypeArgs = {
  type: Scalars['String'];
};

export type QueryPreviewComponentsArgs = {
  entityType: Scalars['String'];
};

export type QueryGetMediafileArgs = {
  mediafileId?: InputMaybe<Scalars['String']>;
};

export type RegexpMatchFormatter = {
  __typename?: 'RegexpMatchFormatter';
  value: Scalars['String'];
};

export type Region = Entity & {
  __typename?: 'Region';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum RelationActions {
  AddRelation = 'addRelation',
  RemoveRelation = 'removeRelation',
}

export type RelationField = {
  __typename?: 'RelationField';
  acceptedEntityTypes: Array<Maybe<Scalars['String']>>;
  disabled?: Maybe<Scalars['Boolean']>;
  key: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<MetadataField>>>;
  relationType: Scalars['String'];
  viewMode?: Maybe<RelationFieldViewMode>;
};

export type RelationFieldInput = {
  editStatus: EditStatus;
  key: Scalars['String'];
  label?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export enum RelationFieldViewMode {
  Big = 'big',
  Small = 'small',
}

export enum RelationType {
  Frames = 'frames',
  Stories = 'stories',
}

export type RequiredOneOfMetadataValidation = {
  __typename?: 'RequiredOneOfMetadataValidation';
  amount: Scalars['Int'];
  includedMetadataFields: Array<Scalars['String']>;
};

export type RequiredOneOfMetadataValidationInput = {
  amount: Scalars['Int'];
  includedMetadataFields: Array<Scalars['String']>;
};

export type RequiredOneOfRelationValidation = {
  __typename?: 'RequiredOneOfRelationValidation';
  amount: Scalars['Int'];
  relationTypes: Array<Scalars['String']>;
};

export type RequiredOneOfRelationValidationInput = {
  amount: Scalars['Int'];
  relationTypes: Array<Scalars['String']>;
};

export type RequiredRelationValidation = {
  __typename?: 'RequiredRelationValidation';
  amount: Scalars['Int'];
  exact?: Maybe<Scalars['Boolean']>;
  relationType: Scalars['String'];
};

export type RequiredRelationValidationInput = {
  amount: Scalars['Int'];
  exact?: InputMaybe<Scalars['Boolean']>;
  relationType: Scalars['String'];
};

export type RouteMatching = {
  __typename?: 'RouteMatching';
  entityType?: Maybe<Entitytyping>;
  routeName?: Maybe<RouteNames>;
};

export type RouteMatchingInput = {
  entityType?: InputMaybe<Entitytyping>;
  routeName?: InputMaybe<RouteNames>;
};

export enum RouteNames {
  AccessDenied = 'AccessDenied',
  Home = 'Home',
  Jobs = 'Jobs',
  NotFound = 'NotFound',
  SingleEntity = 'SingleEntity',
  Unauthorized = 'Unauthorized',
}

export type SavedSearch = Entity & {
  __typename?: 'SavedSearch';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  mapElement?: Maybe<MapElement>;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type Script = Entity & {
  __typename?: 'Script';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type SearchFilter = {
  isAsc?: InputMaybe<Scalars['Boolean']>;
  key?: InputMaybe<Scalars['String']>;
  order_by?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export enum SearchInputType {
  AdvancedInputType = 'AdvancedInputType',
  AdvancedSavedSearchType = 'AdvancedSavedSearchType',
  SimpleInputtype = 'SimpleInputtype',
}

export type SelectionInput = {
  AndOrValue?: InputMaybe<Scalars['Boolean']>;
  value?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ShareLink = Entity & {
  __typename?: 'ShareLink';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  mapElement?: Maybe<MapElement>;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type SingleMediaFileElement = {
  __typename?: 'SingleMediaFileElement';
  isCollapsed: Scalars['Boolean'];
  label: Scalars['String'];
  metaData: PanelMetaData;
  type: Scalars['String'];
};

export type SingleMediaFileElementIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type SingleMediaFileElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type SingleMediaFileElementTypeArgs = {
  input?: InputMaybe<MediaFileElementTypes>;
};

export type Site = Entity & {
  __typename?: 'Site';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type SiteFunction = Entity & {
  __typename?: 'SiteFunction';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type SiteType = Entity & {
  __typename?: 'SiteType';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum SkeletonComponentType {
  Button = 'Button',
  ButtonWithProgress = 'ButtonWithProgress',
  Checkbox = 'Checkbox',
  DisabledButton = 'DisabledButton',
  Dropdown = 'Dropdown',
  DropzoneBig = 'DropzoneBig',
  DropzoneInfo = 'DropzoneInfo',
  DropzoneMedium = 'DropzoneMedium',
  DropzoneSmall = 'DropzoneSmall',
  EntityPicker = 'EntityPicker',
  Input = 'Input',
  Progress = 'Progress',
  RelationDropdown = 'RelationDropdown',
  Subtitle = 'Subtitle',
  Textarea = 'Textarea',
  Title = 'Title',
  UploadCsvTemplates = 'UploadCsvTemplates',
  UploadInfoLink = 'UploadInfoLink',
}

export type SortOptions = {
  __typename?: 'SortOptions';
  isAsc?: Maybe<SortingDirection>;
  options: Array<DropdownOption>;
};

export type SortOptionsIsAscArgs = {
  input: SortingDirection;
};

export type SortOptionsOptionsArgs = {
  excludeBaseSortOptions?: InputMaybe<Scalars['Boolean']>;
  input: Array<DropdownOptionInput>;
};

export enum SortingDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type SubJobResults = {
  __typename?: 'SubJobResults';
  count?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Maybe<Job>>>;
};

export type Support = Entity & {
  __typename?: 'Support';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type TagConfigurationByEntity = {
  __typename?: 'TagConfigurationByEntity';
  colorMetadataKey: Scalars['String'];
  configurationEntityRelationType: Scalars['String'];
  configurationEntityType: Entitytyping;
  metadataKeysToSetAsAttribute?: Maybe<Array<Maybe<Scalars['String']>>>;
  secondaryAttributeToDetermineTagConfig?: Maybe<Scalars['String']>;
  tagMetadataKey: Scalars['String'];
};

export type TagConfigurationByEntityInput = {
  colorMetadataKey: Scalars['String'];
  configurationEntityRelationType: Scalars['String'];
  configurationEntityType: Entitytyping;
  metadataKeysToSetAsAttribute?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  secondaryAttributeToDetermineTagConfig?: InputMaybe<Scalars['String']>;
  tagMetadataKey: Scalars['String'];
};

export type TaggableEntityConfiguration = {
  __typename?: 'TaggableEntityConfiguration';
  createNewEntityFormQuery: Scalars['String'];
  metadataFilterForTagContent: Scalars['String'];
  metadataKeysToSetAsAttribute?: Maybe<Array<Maybe<Scalars['String']>>>;
  relationType: Scalars['String'];
  replaceCharacterFromTagSettings?: Maybe<
    Array<Maybe<CharacterReplacementSettings>>
  >;
  tag?: Maybe<Scalars['String']>;
  tagConfigurationByEntity?: Maybe<TagConfigurationByEntity>;
  taggableEntityType: Entitytyping;
};

export type TaggableEntityConfigurationInput = {
  createNewEntityFormQuery: Scalars['String'];
  metadataFilterForTagContent: Scalars['String'];
  metadataKeysToSetAsAttribute?: InputMaybe<
    Array<InputMaybe<Scalars['String']>>
  >;
  relationType: Scalars['String'];
  replaceCharacterFromTagSettings?: InputMaybe<
    Array<InputMaybe<CharacterReplacementSettingsInput>>
  >;
  tag?: InputMaybe<Scalars['String']>;
  tagConfigurationByEntity?: InputMaybe<TagConfigurationByEntityInput>;
  taggableEntityType: Entitytyping;
};

export type TaggingExtensionConfiguration = {
  __typename?: 'TaggingExtensionConfiguration';
  customQuery: Scalars['String'];
  taggableEntityConfiguration: Array<TaggableEntityConfiguration>;
};

export type TaggingExtensionConfigurationCustomQueryArgs = {
  input: Scalars['String'];
};

export type TaggingExtensionConfigurationTaggableEntityConfigurationArgs = {
  configuration: Array<TaggableEntityConfigurationInput>;
};

export type Tenant = Entity & {
  __typename?: 'Tenant';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  mapElement?: Maybe<MapElement>;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type TextInput = {
  value?: InputMaybe<Scalars['String']>;
};

export enum TimeUnit {
  DayOfWeek = 'dayOfWeek',
  DayOfYear = 'dayOfYear',
  Hour = 'hour',
  Month = 'month',
}

export enum TranscodeType {
  Pdf = 'pdf',
}

export enum TypeModals {
  BulkOperations = 'BulkOperations',
  BulkOperationsDeleteEntities = 'BulkOperationsDeleteEntities',
  BulkOperationsDeleteRelations = 'BulkOperationsDeleteRelations',
  BulkOperationsEdit = 'BulkOperationsEdit',
  Confirm = 'Confirm',
  Delete = 'Delete',
  DynamicForm = 'DynamicForm',
  ElodyEntityTaggingModal = 'ElodyEntityTaggingModal',
  EntityDetailModal = 'EntityDetailModal',
  IiifOperationsModal = 'IiifOperationsModal',
  SaveSearch = 'SaveSearch',
  SaveSearchPicker = 'SaveSearchPicker',
  Search = 'Search',
  SearchAi = 'SearchAi',
}

export type Typology = Entity & {
  __typename?: 'Typology';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export enum Unit {
  CoordinatesDefault = 'COORDINATES_DEFAULT',
  DatetimeDefault = 'DATETIME_DEFAULT',
  DatetimeDmy12 = 'DATETIME_DMY12',
  DatetimeDmy24 = 'DATETIME_DMY24',
  DatetimeMdy12 = 'DATETIME_MDY12',
  DatetimeMdy24 = 'DATETIME_MDY24',
  DateDefault = 'DATE_DEFAULT',
  Html = 'HTML',
  ListDefault = 'LIST_DEFAULT',
  Percent = 'PERCENT',
  SecondsDefault = 'SECONDS_DEFAULT',
  Volt = 'VOLT',
}

export type UploadContainer = {
  __typename?: 'UploadContainer';
  uploadField: UploadField;
  uploadFlow: UploadFlow;
  uploadMetadata?: Maybe<PanelMetaData>;
};

export type UploadContainerUploadFlowArgs = {
  input: UploadFlow;
};

export enum UploadEntityTypes {
  Undefined = 'undefined',
}

export type UploadField = {
  __typename?: 'UploadField';
  dryRunUpload?: Maybe<Scalars['Boolean']>;
  extraMediafileType?: Maybe<Scalars['String']>;
  infoLabelUrl?: Maybe<Scalars['String']>;
  inputField: InputField;
  label: Scalars['String'];
  templateCsvs?: Maybe<Array<Maybe<Scalars['String']>>>;
  uploadFieldSize: UploadFieldSize;
  uploadFieldType: UploadFieldType;
};

export type UploadFieldDryRunUploadArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type UploadFieldExtraMediafileTypeArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type UploadFieldInfoLabelUrlArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type UploadFieldInputFieldArgs = {
  type: BaseFieldType;
};

export type UploadFieldLabelArgs = {
  input: Scalars['String'];
};

export type UploadFieldTemplateCsvsArgs = {
  input: Array<Scalars['String']>;
};

export type UploadFieldUploadFieldSizeArgs = {
  input?: InputMaybe<UploadFieldSize>;
};

export type UploadFieldUploadFieldTypeArgs = {
  input: UploadFieldType;
};

export enum UploadFieldSize {
  Big = 'big',
  Normal = 'normal',
  Small = 'small',
}

export enum UploadFieldType {
  Batch = 'batch',
  EditMetadataWithCsv = 'editMetadataWithCsv',
  ReorderEntities = 'reorderEntities',
  Single = 'single',
}

export enum UploadFlow {
  CsvOnly = 'csvOnly',
  MediafilesOnly = 'mediafilesOnly',
  MediafilesWithOcr = 'mediafilesWithOcr',
  MediafilesWithOptionalCsv = 'mediafilesWithOptionalCsv',
  MediafilesWithRequiredCsv = 'mediafilesWithRequiredCsv',
  OptionalMediafiles = 'optionalMediafiles',
  UpdateMetadata = 'updateMetadata',
  UploadCsvForReordening = 'uploadCsvForReordening',
  XmlMarc = 'xmlMarc',
}

export type User = Entity & {
  __typename?: 'User';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  email: Scalars['String'];
  entityView: ColumnList;
  family_name: Scalars['String'];
  given_name: Scalars['String'];
  id: Scalars['String'];
  intialValues: IntialValues;
  mapElement?: Maybe<MapElement>;
  name: Scalars['String'];
  preferred_username: Scalars['String'];
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type Validation = {
  __typename?: 'Validation';
  available_if?: Maybe<Conditional>;
  customValue?: Maybe<Scalars['String']>;
  fastValidationMessage?: Maybe<Scalars['String']>;
  has_one_of_required_metadata?: Maybe<RequiredOneOfMetadataValidation>;
  has_one_of_required_relations?: Maybe<RequiredOneOfRelationValidation>;
  has_required_relation?: Maybe<RequiredRelationValidation>;
  regex?: Maybe<Scalars['String']>;
  required_if?: Maybe<Conditional>;
  value?: Maybe<Array<Maybe<ValidationRules>>>;
};

export enum ValidationFields {
  IntialValues = 'intialValues',
  RelatedEntityData = 'relatedEntityData',
  RelationMetadata = 'relationMetadata',
  RelationRootdata = 'relationRootdata',
  RelationValues = 'relationValues',
  Relations = 'relations',
}

export type ValidationInput = {
  available_if?: InputMaybe<ConditionalInput>;
  customValue?: InputMaybe<Scalars['String']>;
  fastValidationMessage?: InputMaybe<Scalars['String']>;
  has_one_of_required_metadata?: InputMaybe<RequiredOneOfMetadataValidationInput>;
  has_one_of_required_relations?: InputMaybe<RequiredOneOfRelationValidationInput>;
  has_required_relation?: InputMaybe<RequiredRelationValidationInput>;
  regex?: InputMaybe<Scalars['String']>;
  required_if?: InputMaybe<ConditionalInput>;
  value?: InputMaybe<Array<InputMaybe<ValidationRules>>>;
};

export enum ValidationRules {
  Alpha = 'alpha',
  AlphaDash = 'alpha_dash',
  AlphaNum = 'alpha_num',
  AlphaSpaces = 'alpha_spaces',
  CustomValue = 'customValue',
  Email = 'email',
  ExistingDate = 'existing_date',
  HasOneOfRequiredMetadata = 'has_one_of_required_metadata',
  HasOneOfRequiredRelations = 'has_one_of_required_relations',
  HasRequiredRelation = 'has_required_relation',
  MaxDateToday = 'max_date_today',
  Regex = 'regex',
  Required = 'required',
  Url = 'url',
}

export enum ViewModes {
  ViewModesGrid = 'ViewModesGrid',
  ViewModesList = 'ViewModesList',
  ViewModesMap = 'ViewModesMap',
  /** @deprecated We use the new mediaviewer integrated in previews */
  ViewModesMedia = 'ViewModesMedia',
}

export type ViewModesWithConfig = {
  __typename?: 'ViewModesWithConfig';
  config?: Maybe<Array<Maybe<ConfigItem>>>;
  viewMode?: Maybe<ViewModes>;
};

export type ViewModesWithConfigInput = {
  config?: InputMaybe<Array<InputMaybe<ConfigItemInput>>>;
  viewMode?: InputMaybe<ViewModes>;
};

export enum VisibilityLevels {
  NotPublic = 'not_public',
  Private = 'private',
  Public = 'public',
}

export type WindowElement = {
  __typename?: 'WindowElement';
  editMetadataButton?: Maybe<EditMetadataButton>;
  expandButtonOptions?: Maybe<ExpandButtonOptions>;
  label: Scalars['String'];
  layout?: Maybe<WindowElementLayout>;
  lineClamp: Scalars['String'];
  panels: WindowElementPanel;
};

export type WindowElementEditMetadataButtonArgs = {
  input: EditMetadataButtonInput;
};

export type WindowElementLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type WindowElementLayoutArgs = {
  input?: InputMaybe<WindowElementLayout>;
};

export type WindowElementLineClampArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type WindowElementBulkDataPanel = {
  __typename?: 'WindowElementBulkDataPanel';
  intialValueKey: Scalars['String'];
  label: Scalars['String'];
};

export type WindowElementBulkDataPanelIntialValueKeyArgs = {
  input: Scalars['String'];
};

export type WindowElementBulkDataPanelLabelArgs = {
  input: Scalars['String'];
};

export enum WindowElementLayout {
  HorizontalGrid = 'HorizontalGrid',
  Vertical = 'Vertical',
}

export type WindowElementPanel = {
  __typename?: 'WindowElementPanel';
  bulkData?: Maybe<Scalars['JSON']>;
  canBeMultipleColumns: Scalars['Boolean'];
  entityListElement?: Maybe<EntityListElement>;
  info: PanelInfo;
  isCollapsed: Scalars['Boolean'];
  isEditable: Scalars['Boolean'];
  label?: Maybe<Scalars['String']>;
  metaData: PanelMetaData;
  panelType: PanelType;
  relation?: Maybe<Array<Maybe<PanelRelation>>>;
  wysiwygElement?: Maybe<WysiwygElement>;
};

export type WindowElementPanelBulkDataArgs = {
  bulkDataSource: Scalars['String'];
};

export type WindowElementPanelCanBeMultipleColumnsArgs = {
  input: Scalars['Boolean'];
};

export type WindowElementPanelIsCollapsedArgs = {
  input: Scalars['Boolean'];
};

export type WindowElementPanelIsEditableArgs = {
  input: Scalars['Boolean'];
};

export type WindowElementPanelLabelArgs = {
  input?: InputMaybe<Scalars['String']>;
};

export type WindowElementPanelPanelTypeArgs = {
  input: PanelType;
};

export type Word = Entity & {
  __typename?: 'Word';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type WritingTechnique = Entity & {
  __typename?: 'WritingTechnique';
  advancedFilters?: Maybe<AdvancedFilters>;
  allowedViewModes?: Maybe<AllowedViewModes>;
  bulkOperationOptions?: Maybe<BulkOperationOptions>;
  deleteQueryOptions?: Maybe<DeleteQueryOptions>;
  entityView: ColumnList;
  id: Scalars['String'];
  intialValues: IntialValues;
  previewComponent?: Maybe<PreviewComponent>;
  relationValues?: Maybe<Scalars['JSON']>;
  sortOptions?: Maybe<SortOptions>;
  teaserMetadata?: Maybe<TeaserMetadata>;
  type: Scalars['String'];
  uuid: Scalars['String'];
};

export type WysiwygElement = {
  __typename?: 'WysiwygElement';
  extensions: Array<Maybe<WysiwygExtensions>>;
  hasVirtualKeyboard: Scalars['Boolean'];
  label: Scalars['String'];
  metadataKey: Scalars['String'];
  taggingConfiguration?: Maybe<TaggingExtensionConfiguration>;
  virtualKeyboardLayouts?: Maybe<Scalars['JSON']>;
};

export type WysiwygElementExtensionsArgs = {
  input: Array<InputMaybe<WysiwygExtensions>>;
};

export type WysiwygElementHasVirtualKeyboardArgs = {
  input?: InputMaybe<Scalars['Boolean']>;
};

export type WysiwygElementLabelArgs = {
  input: Scalars['String'];
};

export type WysiwygElementMetadataKeyArgs = {
  input: Scalars['String'];
};

export type WysiwygElementVirtualKeyboardLayoutsArgs = {
  input?: InputMaybe<Array<Scalars['String']>>;
};

export enum WysiwygExtensions {
  Bold = 'bold',
  Color = 'color',
  Doc = 'doc',
  ElodyTaggingExtension = 'elodyTaggingExtension',
  HardBreak = 'hardBreak',
  Italic = 'italic',
  ListItem = 'listItem',
  Paragraph = 'paragraph',
  StarterKit = 'starterKit',
  Text = 'text',
  TextStyle = 'textStyle',
}

export type RelationInput = {
  label?: InputMaybe<Scalars['String']>;
  linkedEntityId?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Array<InputMaybe<MetadataFieldInput>>>;
  relationType: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
};

export type TeaserMetadata = {
  __typename?: 'teaserMetadata';
  contextMenuActions?: Maybe<ContextMenuActions>;
  link?: Maybe<PanelLink>;
  metaData?: Maybe<PanelMetaData>;
  relationMetaData?: Maybe<PanelRelationMetaData>;
  relationRootData?: Maybe<PanelRelationRootData>;
  thumbnail?: Maybe<PanelThumbnail>;
};

export type TeaserMetadataOptions = {
  key?: InputMaybe<Scalars['String']>;
  unit?: InputMaybe<Unit>;
};

export type UserPermissions = {
  __typename?: 'userPermissions';
  payload?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActionContext: ResolverTypeWrapper<ActionContext>;
  ActionContextEntitiesSelectionType: ActionContextEntitiesSelectionType;
  ActionContextInput: ActionContextInput;
  ActionContextViewModeTypes: ActionContextViewModeTypes;
  ActionElement: ResolverTypeWrapper<ActionElement>;
  ActionProgress: ResolverTypeWrapper<ActionProgress>;
  ActionProgressIndicatorType: ActionProgressIndicatorType;
  ActionProgressStep: ResolverTypeWrapper<ActionProgressStep>;
  ActionType: ActionType;
  Actions: Actions;
  AdvancedFilter: ResolverTypeWrapper<AdvancedFilter>;
  AdvancedFilterInput: AdvancedFilterInput;
  AdvancedFilterInputType: ResolverTypeWrapper<AdvancedFilterInputType>;
  AdvancedFilterTypes: AdvancedFilterTypes;
  AdvancedFilters: ResolverTypeWrapper<AdvancedFilters>;
  AdvancedInputType: AdvancedInputType;
  AdvancedSearchInput: AdvancedSearchInput;
  AllowedViewModes: ResolverTypeWrapper<AllowedViewModes>;
  Area: ResolverTypeWrapper<Area>;
  Asset: ResolverTypeWrapper<Asset>;
  AutocompleteSelectionOptions: AutocompleteSelectionOptions;
  BaseEntity: ResolverTypeWrapper<BaseEntity>;
  BaseFieldType: BaseFieldType;
  BaseLibraryModes: BaseLibraryModes;
  BaseRelationValuesInput: BaseRelationValuesInput;
  BibliographicalReference: ResolverTypeWrapper<BibliographicalReference>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BreadCrumbRoute: ResolverTypeWrapper<BreadCrumbRoute>;
  BreadCrumbRouteInput: BreadCrumbRouteInput;
  BulkOperationCsvExportKeys: ResolverTypeWrapper<BulkOperationCsvExportKeys>;
  BulkOperationInputModal: BulkOperationInputModal;
  BulkOperationModal: ResolverTypeWrapper<BulkOperationModal>;
  BulkOperationOptions: ResolverTypeWrapper<BulkOperationOptions>;
  BulkOperationTypes: BulkOperationTypes;
  BulkOperations: ResolverTypeWrapper<BulkOperations>;
  CharacterReplacementSettings: ResolverTypeWrapper<CharacterReplacementSettings>;
  CharacterReplacementSettingsInput: CharacterReplacementSettingsInput;
  Collection: Collection;
  Column: ResolverTypeWrapper<Column>;
  ColumnList: ResolverTypeWrapper<ColumnList>;
  ColumnSizes: ColumnSizes;
  CompositeSite: ResolverTypeWrapper<CompositeSite>;
  Conditional: ResolverTypeWrapper<Conditional>;
  ConditionalInput: ConditionalInput;
  ConfigItem: ResolverTypeWrapper<ConfigItem>;
  ConfigItemInput: ConfigItemInput;
  ContextMenuActions: ResolverTypeWrapper<ContextMenuActions>;
  ContextMenuDirection: ContextMenuDirection;
  ContextMenuElodyAction: ResolverTypeWrapper<ContextMenuElodyAction>;
  ContextMenuElodyActionEnum: ContextMenuElodyActionEnum;
  ContextMenuGeneralAction: ResolverTypeWrapper<ContextMenuGeneralAction>;
  ContextMenuGeneralActionEnum: ContextMenuGeneralActionEnum;
  ContextMenuLinkAction: ResolverTypeWrapper<ContextMenuLinkAction>;
  Creator: ResolverTypeWrapper<Creator>;
  CustomFormatterTypes: CustomFormatterTypes;
  DamsIcons: DamsIcons;
  DeepRelationsFetchStrategy: DeepRelationsFetchStrategy;
  DeleteEntitiesInput: DeleteEntitiesInput;
  DeleteQueryOptions: ResolverTypeWrapper<DeleteQueryOptions>;
  Directory: ResolverTypeWrapper<Directory>;
  DropdownOption: ResolverTypeWrapper<DropdownOption>;
  DropdownOptionInput: DropdownOptionInput;
  DropzoneEntityToCreate: ResolverTypeWrapper<DropzoneEntityToCreate>;
  EditMetadataButton: ResolverTypeWrapper<EditMetadataButton>;
  EditMetadataButtonInput: EditMetadataButtonInput;
  EditStatus: EditStatus;
  ElodyServices: ElodyServices;
  ElodyViewers: ElodyViewers;
  EndpointInformation: ResolverTypeWrapper<EndpointInformation>;
  EndpointInformationInput: EndpointInformationInput;
  EndpointResponseActions: EndpointResponseActions;
  EntitiesResults: ResolverTypeWrapper<EntitiesResults>;
  Entity:
    | ResolversTypes['Area']
    | ResolversTypes['Asset']
    | ResolversTypes['BaseEntity']
    | ResolversTypes['BibliographicalReference']
    | ResolversTypes['CompositeSite']
    | ResolversTypes['Creator']
    | ResolversTypes['EpiDocTag']
    | ResolversTypes['ExternalSigla']
    | ResolversTypes['Inscription']
    | ResolversTypes['Job']
    | ResolversTypes['Language']
    | ResolversTypes['Location']
    | ResolversTypes['Media']
    | ResolversTypes['MediaFileEntity']
    | ResolversTypes['Point']
    | ResolversTypes['Region']
    | ResolversTypes['SavedSearch']
    | ResolversTypes['Script']
    | ResolversTypes['ShareLink']
    | ResolversTypes['Site']
    | ResolversTypes['SiteFunction']
    | ResolversTypes['SiteType']
    | ResolversTypes['Support']
    | ResolversTypes['Tenant']
    | ResolversTypes['Typology']
    | ResolversTypes['User']
    | ResolversTypes['Word']
    | ResolversTypes['WritingTechnique'];
  EntityFormInput: EntityFormInput;
  EntityInput: EntityInput;
  EntityListElement: ResolverTypeWrapper<EntityListElement>;
  EntityListViewMode: EntityListViewMode;
  EntityPickerMode: EntityPickerMode;
  EntitySubelement: EntitySubelement;
  EntityViewElements: ResolverTypeWrapper<EntityViewElements>;
  EntityViewerElement: ResolverTypeWrapper<EntityViewerElement>;
  Entitytyping: Entitytyping;
  EpiDocTag: ResolverTypeWrapper<EpiDocTag>;
  ErrorCodeType: ErrorCodeType;
  ExpandButtonOptions: ResolverTypeWrapper<ExpandButtonOptions>;
  ExternalSigla: ResolverTypeWrapper<ExternalSigla>;
  FacetInputInput: FacetInputInput;
  FacetInputType: ResolverTypeWrapper<FacetInputType>;
  FetchDeepRelations: ResolverTypeWrapper<FetchDeepRelations>;
  FileProgress: ResolverTypeWrapper<FileProgress>;
  FileProgressStep: ResolverTypeWrapper<FileProgressStep>;
  FileType: FileType;
  FilterInput: FilterInput;
  FilterMatcherMap: ResolverTypeWrapper<FilterMatcherMap>;
  FilterOptionsMappingInput: FilterOptionsMappingInput;
  FilterOptionsMappingType: ResolverTypeWrapper<FilterOptionsMappingType>;
  Filters: Filters;
  Form: ResolverTypeWrapper<Form>;
  FormAction: ResolverTypeWrapper<FormAction>;
  FormFields: ResolverTypeWrapper<FormFields>;
  FormTab: ResolverTypeWrapper<FormTab>;
  Formatters:
    | ResolversTypes['LinkFormatter']
    | ResolversTypes['PillFormatter']
    | ResolversTypes['RegexpMatchFormatter'];
  GeoJsonFeature: ResolverTypeWrapper<GeoJsonFeature>;
  GeoJsonFeatureInput: GeoJsonFeatureInput;
  GraphDataset: ResolverTypeWrapper<GraphDataset>;
  GraphDatasetFilter: ResolverTypeWrapper<GraphDatasetFilter>;
  GraphDatasetFilterInput: GraphDatasetFilterInput;
  GraphDatasetInput: GraphDatasetInput;
  GraphElement: ResolverTypeWrapper<GraphElement>;
  GraphElementInput: GraphElementInput;
  GraphType: GraphType;
  HiddenField: ResolverTypeWrapper<HiddenField>;
  HiddenFieldInput: HiddenFieldInput;
  HierarchyListElement: ResolverTypeWrapper<HierarchyListElement>;
  HierarchyRelationList: ResolverTypeWrapper<HierarchyRelationList>;
  HierarchyRelationListInput: HierarchyRelationListInput;
  ImportReturn: ResolverTypeWrapper<ImportReturn>;
  InheritFromInput: InheritFromInput;
  InputField: ResolverTypeWrapper<InputField>;
  InputFieldTypes: InputFieldTypes;
  Inscription: ResolverTypeWrapper<Inscription>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntialValues: ResolverTypeWrapper<IntialValues>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Job: ResolverTypeWrapper<Job>;
  JobType: JobType;
  JobsResults: ResolverTypeWrapper<JobsResults>;
  KeyAndValue: ResolverTypeWrapper<KeyAndValue>;
  KeyValue: ResolverTypeWrapper<KeyValue>;
  KeyValueSource: KeyValueSource;
  Language: ResolverTypeWrapper<Language>;
  LinkFormatter: ResolverTypeWrapper<LinkFormatter>;
  ListItemCoverageTypes: ListItemCoverageTypes;
  Location: ResolverTypeWrapper<Location>;
  LookupInput: LookupInput;
  LookupInputType: ResolverTypeWrapper<LookupInputType>;
  ManifestViewerElement: ResolverTypeWrapper<ManifestViewerElement>;
  MapElement: ResolverTypeWrapper<MapElement>;
  MapMetadata: ResolverTypeWrapper<MapMetadata>;
  MapTypes: MapTypes;
  MarkdownViewerElement: ResolverTypeWrapper<MarkdownViewerElement>;
  MatchMetadataValue: ResolverTypeWrapper<MatchMetadataValue>;
  MatchMetadataValueInput: MatchMetadataValueInput;
  Matchers: Matchers;
  Media: ResolverTypeWrapper<Media>;
  MediaFile: ResolverTypeWrapper<MediaFile>;
  MediaFileElement: ResolverTypeWrapper<MediaFileElement>;
  MediaFileElementTypes: MediaFileElementTypes;
  MediaFileEntity: ResolverTypeWrapper<MediaFileEntity>;
  MediaFileInput: MediaFileInput;
  MediaFileMetadata: ResolverTypeWrapper<MediaFileMetadata>;
  MediaFileMetadataInput: MediaFileMetadataInput;
  MediaFilePostReturn: ResolverTypeWrapper<MediaFilePostReturn>;
  MediaTypeEntities: MediaTypeEntities;
  Menu: ResolverTypeWrapper<Menu>;
  MenuIcons: MenuIcons;
  MenuItem: ResolverTypeWrapper<MenuItem>;
  MenuTypeLink: ResolverTypeWrapper<MenuTypeLink>;
  MenuTypeLinkInput: MenuTypeLinkInput;
  MenuTypeLinkInputModal: MenuTypeLinkInputModal;
  MenuTypeLinkInputRoute: MenuTypeLinkInputRoute;
  MenuTypeLinkModal: ResolverTypeWrapper<MenuTypeLinkModal>;
  MenuTypeLinkRoute: ResolverTypeWrapper<MenuTypeLinkRoute>;
  MenuWrapper: ResolverTypeWrapper<MenuWrapper>;
  Metadata: ResolverTypeWrapper<Metadata>;
  MetadataAndRelation:
    | ResolversTypes['Metadata']
    | ResolversTypes['MetadataRelation'];
  MetadataField: ResolverTypeWrapper<MetadataField>;
  MetadataFieldInput: MetadataFieldInput;
  MetadataFieldOption: ResolverTypeWrapper<MetadataFieldOption>;
  MetadataFieldOptionInput: MetadataFieldOptionInput;
  MetadataFormInput: MetadataFormInput;
  MetadataInput: MetadataInput;
  MetadataRelation: ResolverTypeWrapper<MetadataRelation>;
  MetadataValuesInput: MetadataValuesInput;
  MinMaxInput: MinMaxInput;
  ModalStyle: ModalStyle;
  MultiSelectInput: MultiSelectInput;
  Mutation: ResolverTypeWrapper<{}>;
  OcrType: OcrType;
  Operator: Operator;
  Orientations: Orientations;
  PaginationInfo: PaginationInfo;
  PaginationLimitOptions: ResolverTypeWrapper<PaginationLimitOptions>;
  PanelInfo: ResolverTypeWrapper<PanelInfo>;
  PanelLink: ResolverTypeWrapper<PanelLink>;
  PanelMetaData: ResolverTypeWrapper<PanelMetaData>;
  PanelMetadataValueTooltip: ResolverTypeWrapper<PanelMetadataValueTooltip>;
  PanelMetadataValueTooltipInput: PanelMetadataValueTooltipInput;
  PanelMetadataValueTooltipTypes: PanelMetadataValueTooltipTypes;
  PanelRelation: ResolverTypeWrapper<PanelRelation>;
  PanelRelationMetaData: ResolverTypeWrapper<PanelRelationMetaData>;
  PanelRelationRootData: ResolverTypeWrapper<PanelRelationRootData>;
  PanelThumbnail: ResolverTypeWrapper<PanelThumbnail>;
  PanelType: PanelType;
  Permission: Permission;
  PermissionMapping: ResolverTypeWrapper<PermissionMapping>;
  PermissionRequestInfo: ResolverTypeWrapper<PermissionRequestInfo>;
  PermissionResult: ResolverTypeWrapper<PermissionResult>;
  PillFormatter: ResolverTypeWrapper<PillFormatter>;
  Point: ResolverTypeWrapper<Point>;
  PreviewComponent: ResolverTypeWrapper<PreviewComponent>;
  PreviewTypes: PreviewTypes;
  ProgressStepStatus: ProgressStepStatus;
  ProgressStepType: ProgressStepType;
  Query: ResolverTypeWrapper<{}>;
  RegexpMatchFormatter: ResolverTypeWrapper<RegexpMatchFormatter>;
  Region: ResolverTypeWrapper<Region>;
  RelationActions: RelationActions;
  RelationField: ResolverTypeWrapper<RelationField>;
  RelationFieldInput: RelationFieldInput;
  RelationFieldViewMode: RelationFieldViewMode;
  RelationType: RelationType;
  RequiredOneOfMetadataValidation: ResolverTypeWrapper<RequiredOneOfMetadataValidation>;
  RequiredOneOfMetadataValidationInput: RequiredOneOfMetadataValidationInput;
  RequiredOneOfRelationValidation: ResolverTypeWrapper<RequiredOneOfRelationValidation>;
  RequiredOneOfRelationValidationInput: RequiredOneOfRelationValidationInput;
  RequiredRelationValidation: ResolverTypeWrapper<RequiredRelationValidation>;
  RequiredRelationValidationInput: RequiredRelationValidationInput;
  RouteMatching: ResolverTypeWrapper<RouteMatching>;
  RouteMatchingInput: RouteMatchingInput;
  RouteNames: RouteNames;
  SavedSearch: ResolverTypeWrapper<SavedSearch>;
  Script: ResolverTypeWrapper<Script>;
  SearchFilter: SearchFilter;
  SearchInputType: SearchInputType;
  SelectionInput: SelectionInput;
  ShareLink: ResolverTypeWrapper<ShareLink>;
  SingleMediaFileElement: ResolverTypeWrapper<SingleMediaFileElement>;
  Site: ResolverTypeWrapper<Site>;
  SiteFunction: ResolverTypeWrapper<SiteFunction>;
  SiteType: ResolverTypeWrapper<SiteType>;
  SkeletonComponentType: SkeletonComponentType;
  SortOptions: ResolverTypeWrapper<SortOptions>;
  SortingDirection: SortingDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringOrInt: ResolverTypeWrapper<Scalars['StringOrInt']>;
  SubJobResults: ResolverTypeWrapper<SubJobResults>;
  Support: ResolverTypeWrapper<Support>;
  TagConfigurationByEntity: ResolverTypeWrapper<TagConfigurationByEntity>;
  TagConfigurationByEntityInput: TagConfigurationByEntityInput;
  TaggableEntityConfiguration: ResolverTypeWrapper<TaggableEntityConfiguration>;
  TaggableEntityConfigurationInput: TaggableEntityConfigurationInput;
  TaggingExtensionConfiguration: ResolverTypeWrapper<TaggingExtensionConfiguration>;
  Tenant: ResolverTypeWrapper<Tenant>;
  TextInput: TextInput;
  TimeUnit: TimeUnit;
  TranscodeType: TranscodeType;
  TypeModals: TypeModals;
  Typology: ResolverTypeWrapper<Typology>;
  Unit: Unit;
  UploadContainer: ResolverTypeWrapper<UploadContainer>;
  UploadEntityTypes: UploadEntityTypes;
  UploadField: ResolverTypeWrapper<UploadField>;
  UploadFieldSize: UploadFieldSize;
  UploadFieldType: UploadFieldType;
  UploadFlow: UploadFlow;
  User: ResolverTypeWrapper<User>;
  Validation: ResolverTypeWrapper<Validation>;
  ValidationFields: ValidationFields;
  ValidationInput: ValidationInput;
  ValidationRules: ValidationRules;
  ViewModes: ViewModes;
  ViewModesWithConfig: ResolverTypeWrapper<ViewModesWithConfig>;
  ViewModesWithConfigInput: ViewModesWithConfigInput;
  VisibilityLevels: VisibilityLevels;
  WindowElement: ResolverTypeWrapper<WindowElement>;
  WindowElementBulkDataPanel: ResolverTypeWrapper<WindowElementBulkDataPanel>;
  WindowElementLayout: WindowElementLayout;
  WindowElementPanel: ResolverTypeWrapper<WindowElementPanel>;
  Word: ResolverTypeWrapper<Word>;
  WritingTechnique: ResolverTypeWrapper<WritingTechnique>;
  WysiwygElement: ResolverTypeWrapper<WysiwygElement>;
  WysiwygExtensions: WysiwygExtensions;
  relationInput: RelationInput;
  teaserMetadata: ResolverTypeWrapper<TeaserMetadata>;
  teaserMetadataOptions: TeaserMetadataOptions;
  userPermissions: ResolverTypeWrapper<UserPermissions>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActionContext: ActionContext;
  ActionContextInput: ActionContextInput;
  ActionElement: ActionElement;
  ActionProgress: ActionProgress;
  ActionProgressStep: ActionProgressStep;
  AdvancedFilter: AdvancedFilter;
  AdvancedFilterInput: AdvancedFilterInput;
  AdvancedFilterInputType: AdvancedFilterInputType;
  AdvancedFilters: AdvancedFilters;
  AdvancedSearchInput: AdvancedSearchInput;
  AllowedViewModes: AllowedViewModes;
  Area: Area;
  Asset: Asset;
  BaseEntity: BaseEntity;
  BaseRelationValuesInput: BaseRelationValuesInput;
  BibliographicalReference: BibliographicalReference;
  Boolean: Scalars['Boolean'];
  BreadCrumbRoute: BreadCrumbRoute;
  BreadCrumbRouteInput: BreadCrumbRouteInput;
  BulkOperationCsvExportKeys: BulkOperationCsvExportKeys;
  BulkOperationInputModal: BulkOperationInputModal;
  BulkOperationModal: BulkOperationModal;
  BulkOperationOptions: BulkOperationOptions;
  BulkOperations: BulkOperations;
  CharacterReplacementSettings: CharacterReplacementSettings;
  CharacterReplacementSettingsInput: CharacterReplacementSettingsInput;
  Column: Column;
  ColumnList: ColumnList;
  CompositeSite: CompositeSite;
  Conditional: Conditional;
  ConditionalInput: ConditionalInput;
  ConfigItem: ConfigItem;
  ConfigItemInput: ConfigItemInput;
  ContextMenuActions: ContextMenuActions;
  ContextMenuElodyAction: ContextMenuElodyAction;
  ContextMenuGeneralAction: ContextMenuGeneralAction;
  ContextMenuLinkAction: ContextMenuLinkAction;
  Creator: Creator;
  DeleteEntitiesInput: DeleteEntitiesInput;
  DeleteQueryOptions: DeleteQueryOptions;
  Directory: Directory;
  DropdownOption: DropdownOption;
  DropdownOptionInput: DropdownOptionInput;
  DropzoneEntityToCreate: DropzoneEntityToCreate;
  EditMetadataButton: EditMetadataButton;
  EditMetadataButtonInput: EditMetadataButtonInput;
  EndpointInformation: EndpointInformation;
  EndpointInformationInput: EndpointInformationInput;
  EntitiesResults: EntitiesResults;
  Entity:
    | ResolversParentTypes['Area']
    | ResolversParentTypes['Asset']
    | ResolversParentTypes['BaseEntity']
    | ResolversParentTypes['BibliographicalReference']
    | ResolversParentTypes['CompositeSite']
    | ResolversParentTypes['Creator']
    | ResolversParentTypes['EpiDocTag']
    | ResolversParentTypes['ExternalSigla']
    | ResolversParentTypes['Inscription']
    | ResolversParentTypes['Job']
    | ResolversParentTypes['Language']
    | ResolversParentTypes['Location']
    | ResolversParentTypes['Media']
    | ResolversParentTypes['MediaFileEntity']
    | ResolversParentTypes['Point']
    | ResolversParentTypes['Region']
    | ResolversParentTypes['SavedSearch']
    | ResolversParentTypes['Script']
    | ResolversParentTypes['ShareLink']
    | ResolversParentTypes['Site']
    | ResolversParentTypes['SiteFunction']
    | ResolversParentTypes['SiteType']
    | ResolversParentTypes['Support']
    | ResolversParentTypes['Tenant']
    | ResolversParentTypes['Typology']
    | ResolversParentTypes['User']
    | ResolversParentTypes['Word']
    | ResolversParentTypes['WritingTechnique'];
  EntityFormInput: EntityFormInput;
  EntityInput: EntityInput;
  EntityListElement: EntityListElement;
  EntityViewElements: EntityViewElements;
  EntityViewerElement: EntityViewerElement;
  EpiDocTag: EpiDocTag;
  ExpandButtonOptions: ExpandButtonOptions;
  ExternalSigla: ExternalSigla;
  FacetInputInput: FacetInputInput;
  FacetInputType: FacetInputType;
  FetchDeepRelations: FetchDeepRelations;
  FileProgress: FileProgress;
  FileProgressStep: FileProgressStep;
  FilterInput: FilterInput;
  FilterMatcherMap: FilterMatcherMap;
  FilterOptionsMappingInput: FilterOptionsMappingInput;
  FilterOptionsMappingType: FilterOptionsMappingType;
  Filters: Filters;
  Form: Form;
  FormAction: FormAction;
  FormFields: FormFields;
  FormTab: FormTab;
  Formatters:
    | ResolversParentTypes['LinkFormatter']
    | ResolversParentTypes['PillFormatter']
    | ResolversParentTypes['RegexpMatchFormatter'];
  GeoJsonFeature: GeoJsonFeature;
  GeoJsonFeatureInput: GeoJsonFeatureInput;
  GraphDataset: GraphDataset;
  GraphDatasetFilter: GraphDatasetFilter;
  GraphDatasetFilterInput: GraphDatasetFilterInput;
  GraphDatasetInput: GraphDatasetInput;
  GraphElement: GraphElement;
  GraphElementInput: GraphElementInput;
  HiddenField: HiddenField;
  HiddenFieldInput: HiddenFieldInput;
  HierarchyListElement: HierarchyListElement;
  HierarchyRelationList: HierarchyRelationList;
  HierarchyRelationListInput: HierarchyRelationListInput;
  ImportReturn: ImportReturn;
  InheritFromInput: InheritFromInput;
  InputField: InputField;
  Inscription: Inscription;
  Int: Scalars['Int'];
  IntialValues: IntialValues;
  JSON: Scalars['JSON'];
  Job: Job;
  JobsResults: JobsResults;
  KeyAndValue: KeyAndValue;
  KeyValue: KeyValue;
  Language: Language;
  LinkFormatter: LinkFormatter;
  Location: Location;
  LookupInput: LookupInput;
  LookupInputType: LookupInputType;
  ManifestViewerElement: ManifestViewerElement;
  MapElement: MapElement;
  MapMetadata: MapMetadata;
  MarkdownViewerElement: MarkdownViewerElement;
  MatchMetadataValue: MatchMetadataValue;
  MatchMetadataValueInput: MatchMetadataValueInput;
  Media: Media;
  MediaFile: MediaFile;
  MediaFileElement: MediaFileElement;
  MediaFileEntity: MediaFileEntity;
  MediaFileInput: MediaFileInput;
  MediaFileMetadata: MediaFileMetadata;
  MediaFileMetadataInput: MediaFileMetadataInput;
  MediaFilePostReturn: MediaFilePostReturn;
  Menu: Menu;
  MenuItem: MenuItem;
  MenuTypeLink: MenuTypeLink;
  MenuTypeLinkInput: MenuTypeLinkInput;
  MenuTypeLinkInputModal: MenuTypeLinkInputModal;
  MenuTypeLinkInputRoute: MenuTypeLinkInputRoute;
  MenuTypeLinkModal: MenuTypeLinkModal;
  MenuTypeLinkRoute: MenuTypeLinkRoute;
  MenuWrapper: MenuWrapper;
  Metadata: Metadata;
  MetadataAndRelation:
    | ResolversParentTypes['Metadata']
    | ResolversParentTypes['MetadataRelation'];
  MetadataField: MetadataField;
  MetadataFieldInput: MetadataFieldInput;
  MetadataFieldOption: MetadataFieldOption;
  MetadataFieldOptionInput: MetadataFieldOptionInput;
  MetadataFormInput: MetadataFormInput;
  MetadataInput: MetadataInput;
  MetadataRelation: MetadataRelation;
  MetadataValuesInput: MetadataValuesInput;
  MinMaxInput: MinMaxInput;
  MultiSelectInput: MultiSelectInput;
  Mutation: {};
  PaginationInfo: PaginationInfo;
  PaginationLimitOptions: PaginationLimitOptions;
  PanelInfo: PanelInfo;
  PanelLink: PanelLink;
  PanelMetaData: PanelMetaData;
  PanelMetadataValueTooltip: PanelMetadataValueTooltip;
  PanelMetadataValueTooltipInput: PanelMetadataValueTooltipInput;
  PanelRelation: PanelRelation;
  PanelRelationMetaData: PanelRelationMetaData;
  PanelRelationRootData: PanelRelationRootData;
  PanelThumbnail: PanelThumbnail;
  PermissionMapping: PermissionMapping;
  PermissionRequestInfo: PermissionRequestInfo;
  PermissionResult: PermissionResult;
  PillFormatter: PillFormatter;
  Point: Point;
  PreviewComponent: PreviewComponent;
  Query: {};
  RegexpMatchFormatter: RegexpMatchFormatter;
  Region: Region;
  RelationField: RelationField;
  RelationFieldInput: RelationFieldInput;
  RequiredOneOfMetadataValidation: RequiredOneOfMetadataValidation;
  RequiredOneOfMetadataValidationInput: RequiredOneOfMetadataValidationInput;
  RequiredOneOfRelationValidation: RequiredOneOfRelationValidation;
  RequiredOneOfRelationValidationInput: RequiredOneOfRelationValidationInput;
  RequiredRelationValidation: RequiredRelationValidation;
  RequiredRelationValidationInput: RequiredRelationValidationInput;
  RouteMatching: RouteMatching;
  RouteMatchingInput: RouteMatchingInput;
  SavedSearch: SavedSearch;
  Script: Script;
  SearchFilter: SearchFilter;
  SelectionInput: SelectionInput;
  ShareLink: ShareLink;
  SingleMediaFileElement: SingleMediaFileElement;
  Site: Site;
  SiteFunction: SiteFunction;
  SiteType: SiteType;
  SortOptions: SortOptions;
  String: Scalars['String'];
  StringOrInt: Scalars['StringOrInt'];
  SubJobResults: SubJobResults;
  Support: Support;
  TagConfigurationByEntity: TagConfigurationByEntity;
  TagConfigurationByEntityInput: TagConfigurationByEntityInput;
  TaggableEntityConfiguration: TaggableEntityConfiguration;
  TaggableEntityConfigurationInput: TaggableEntityConfigurationInput;
  TaggingExtensionConfiguration: TaggingExtensionConfiguration;
  Tenant: Tenant;
  TextInput: TextInput;
  Typology: Typology;
  UploadContainer: UploadContainer;
  UploadField: UploadField;
  User: User;
  Validation: Validation;
  ValidationInput: ValidationInput;
  ViewModesWithConfig: ViewModesWithConfig;
  ViewModesWithConfigInput: ViewModesWithConfigInput;
  WindowElement: WindowElement;
  WindowElementBulkDataPanel: WindowElementBulkDataPanel;
  WindowElementPanel: WindowElementPanel;
  Word: Word;
  WritingTechnique: WritingTechnique;
  WysiwygElement: WysiwygElement;
  relationInput: RelationInput;
  teaserMetadata: TeaserMetadata;
  teaserMetadataOptions: TeaserMetadataOptions;
  userPermissions: UserPermissions;
};

export type ActionContextResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ActionContext'] = ResolversParentTypes['ActionContext']
> = {
  activeViewMode?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ActionContextViewModeTypes']>>>,
    ParentType,
    ContextType
  >;
  entitiesSelectionType?: Resolver<
    Maybe<ResolversTypes['ActionContextEntitiesSelectionType']>,
    ParentType,
    ContextType
  >;
  labelForTooltip?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  matchMetadataValue?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['MatchMetadataValue']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ActionElement'] = ResolversParentTypes['ActionElement']
> = {
  actions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Actions']>>>,
    ParentType,
    ContextType,
    Partial<ActionElementActionsArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ActionElementLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionProgressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ActionProgress'] = ResolversParentTypes['ActionProgress']
> = {
  step?: Resolver<
    Maybe<ResolversTypes['ActionProgressStep']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    ResolversTypes['ActionProgressIndicatorType'],
    ParentType,
    ContextType,
    RequireFields<ActionProgressTypeArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionProgressStepResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ActionProgressStep'] = ResolversParentTypes['ActionProgressStep']
> = {
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<ActionProgressStepLabelArgs, 'input'>
  >;
  status?: Resolver<
    ResolversTypes['ProgressStepStatus'],
    ParentType,
    ContextType
  >;
  stepType?: Resolver<
    ResolversTypes['ProgressStepType'],
    ParentType,
    ContextType,
    RequireFields<ActionProgressStepStepTypeArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdvancedFilterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AdvancedFilter'] = ResolversParentTypes['AdvancedFilter']
> = {
  advancedFilterInputForRetrievingOptions?: Resolver<
    Maybe<Array<ResolversTypes['AdvancedFilterInputType']>>,
    ParentType,
    ContextType
  >;
  aggregation?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  context?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  defaultValue?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType,
    RequireFields<AdvancedFilterDefaultValueArgs, 'value'>
  >;
  distinctBy?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  doNotOverrideDefaultValue?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<AdvancedFilterDoNotOverrideDefaultValueArgs>
  >;
  entityType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  facets?: Resolver<
    Maybe<Array<ResolversTypes['FacetInputType']>>,
    ParentType,
    ContextType
  >;
  filterOptionsMapping?: Resolver<
    Maybe<ResolversTypes['FilterOptionsMappingType']>,
    ParentType,
    ContextType
  >;
  hidden?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    Partial<AdvancedFilterHiddenArgs>
  >;
  isDisplayedByDefault?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  itemTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lookup?: Resolver<
    Maybe<ResolversTypes['LookupInputType']>,
    ParentType,
    ContextType
  >;
  matchExact?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  metadataKeyAsLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  min?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minDropdownSearchCharacters?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    Partial<AdvancedFilterMinDropdownSearchCharactersArgs>
  >;
  operator?: Resolver<
    Maybe<ResolversTypes['Operator']>,
    ParentType,
    ContextType
  >;
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType
  >;
  parentKey?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  selectionOption?: Resolver<
    Maybe<ResolversTypes['AutocompleteSelectionOptions']>,
    ParentType,
    ContextType
  >;
  showTimeForDateFilter?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  tooltip?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<AdvancedFilterTooltipArgs>
  >;
  type?: Resolver<
    ResolversTypes['AdvancedFilterTypes'],
    ParentType,
    ContextType
  >;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  useOldWayToFetchOptions?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdvancedFilterInputTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AdvancedFilterInputType'] = ResolversParentTypes['AdvancedFilterInputType']
> = {
  aggregation?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  context?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  distinct_by?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  inner_exact_matches?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  item_types?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  lookup?: Resolver<
    Maybe<ResolversTypes['LookupInputType']>,
    ParentType,
    ContextType
  >;
  match_exact?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  metadata_key_as_label?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  operator?: Resolver<
    Maybe<ResolversTypes['Operator']>,
    ParentType,
    ContextType
  >;
  parent_key?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  returnIdAtIndex?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  selectionOption?: Resolver<
    Maybe<ResolversTypes['AutocompleteSelectionOptions']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    ResolversTypes['AdvancedFilterTypes'],
    ParentType,
    ContextType
  >;
  value?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdvancedFiltersResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AdvancedFilters'] = ResolversParentTypes['AdvancedFilters']
> = {
  advancedFilter?: Resolver<
    ResolversTypes['AdvancedFilter'],
    ParentType,
    ContextType,
    RequireFields<AdvancedFiltersAdvancedFilterArgs, 'type'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AllowedViewModesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AllowedViewModes'] = ResolversParentTypes['AllowedViewModes']
> = {
  viewModes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ViewModesWithConfig']>>>,
    ParentType,
    ContextType,
    Partial<AllowedViewModesViewModesArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AreaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Area'] = ResolversParentTypes['Area']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BaseEntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BaseEntity'] = ResolversParentTypes['BaseEntity']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BibliographicalReferenceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BibliographicalReference'] = ResolversParentTypes['BibliographicalReference']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BreadCrumbRouteResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BreadCrumbRoute'] = ResolversParentTypes['BreadCrumbRoute']
> = {
  entityType?: Resolver<
    Maybe<ResolversTypes['Entitytyping']>,
    ParentType,
    ContextType
  >;
  overviewPage?: Resolver<
    Maybe<ResolversTypes['RouteNames']>,
    ParentType,
    ContextType
  >;
  relation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BulkOperationCsvExportKeysResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BulkOperationCsvExportKeys'] = ResolversParentTypes['BulkOperationCsvExportKeys']
> = {
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BulkOperationModalResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BulkOperationModal'] = ResolversParentTypes['BulkOperationModal']
> = {
  askForCloseConfirmation?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  formQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  formRelationType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  neededPermission?: Resolver<
    Maybe<ResolversTypes['Permission']>,
    ParentType,
    ContextType
  >;
  skipItemsWithRelationDuringBulkDelete?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  typeModal?: Resolver<ResolversTypes['TypeModals'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BulkOperationOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BulkOperationOptions'] = ResolversParentTypes['BulkOperationOptions']
> = {
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType,
    RequireFields<BulkOperationOptionsOptionsArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BulkOperationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BulkOperations'] = ResolversParentTypes['BulkOperations']
> = {
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType,
    RequireFields<BulkOperationsOptionsArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CharacterReplacementSettingsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CharacterReplacementSettings'] = ResolversParentTypes['CharacterReplacementSettings']
> = {
  characterToReplaceWith?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  replacementCharactersRegex?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ColumnResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Column'] = ResolversParentTypes['Column']
> = {
  elements?: Resolver<
    ResolversTypes['EntityViewElements'],
    ParentType,
    ContextType
  >;
  size?: Resolver<
    ResolversTypes['ColumnSizes'],
    ParentType,
    ContextType,
    Partial<ColumnSizeArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ColumnListResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ColumnList'] = ResolversParentTypes['ColumnList']
> = {
  column?: Resolver<ResolversTypes['Column'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompositeSiteResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CompositeSite'] = ResolversParentTypes['CompositeSite']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConditionalResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Conditional'] = ResolversParentTypes['Conditional']
> = {
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ifAnyValue?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConfigItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ConfigItem'] = ResolversParentTypes['ConfigItem']
> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContextMenuActionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ContextMenuActions'] = ResolversParentTypes['ContextMenuActions']
> = {
  doElodyAction?: Resolver<
    Maybe<ResolversTypes['ContextMenuElodyAction']>,
    ParentType,
    ContextType
  >;
  doGeneralAction?: Resolver<
    Maybe<ResolversTypes['ContextMenuGeneralAction']>,
    ParentType,
    ContextType
  >;
  doLinkAction?: Resolver<
    Maybe<ResolversTypes['ContextMenuLinkAction']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContextMenuElodyActionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ContextMenuElodyAction'] = ResolversParentTypes['ContextMenuElodyAction']
> = {
  action?: Resolver<
    ResolversTypes['ContextMenuElodyActionEnum'],
    ParentType,
    ContextType,
    Partial<ContextMenuElodyActionActionArgs>
  >;
  can?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    Partial<ContextMenuElodyActionCanArgs>
  >;
  icon?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ContextMenuElodyActionIconArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ContextMenuElodyActionLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContextMenuGeneralActionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ContextMenuGeneralAction'] = ResolversParentTypes['ContextMenuGeneralAction']
> = {
  action?: Resolver<
    ResolversTypes['ContextMenuGeneralActionEnum'],
    ParentType,
    ContextType,
    Partial<ContextMenuGeneralActionActionArgs>
  >;
  can?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    Partial<ContextMenuGeneralActionCanArgs>
  >;
  icon?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ContextMenuGeneralActionIconArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ContextMenuGeneralActionLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContextMenuLinkActionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ContextMenuLinkAction'] = ResolversParentTypes['ContextMenuLinkAction']
> = {
  can?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    Partial<ContextMenuLinkActionCanArgs>
  >;
  icon?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ContextMenuLinkActionIconArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ContextMenuLinkActionLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Creator'] = ResolversParentTypes['Creator']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteQueryOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteQueryOptions'] = ResolversParentTypes['DeleteQueryOptions']
> = {
  blockingRelationsLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsBlockingRelationsLabelArgs>
  >;
  customQueryBlockingEntityTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Entitytyping']>>>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsCustomQueryBlockingEntityTypesArgs>
  >;
  customQueryBlockingRelations?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsCustomQueryBlockingRelationsArgs>
  >;
  customQueryBlockingRelationsFilters?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsCustomQueryBlockingRelationsFiltersArgs>
  >;
  customQueryDeleteRelations?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsCustomQueryDeleteRelationsArgs>
  >;
  customQueryDeleteRelationsFilters?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsCustomQueryDeleteRelationsFiltersArgs>
  >;
  customQueryEntityTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Entitytyping']>>>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsCustomQueryEntityTypesArgs>
  >;
  deleteEntityLabel?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<DeleteQueryOptionsDeleteEntityLabelArgs, 'input'>
  >;
  deleteRelationsLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<DeleteQueryOptionsDeleteRelationsLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DirectoryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Directory'] = ResolversParentTypes['Directory']
> = {
  dir?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  has_subdirs?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DropdownOptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DropdownOption'] = ResolversParentTypes['DropdownOption']
> = {
  actionContext?: Resolver<
    Maybe<ResolversTypes['ActionContext']>,
    ParentType,
    ContextType,
    Partial<DropdownOptionActionContextArgs>
  >;
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  availableInPages?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['RouteMatching']>>>,
    ParentType,
    ContextType,
    Partial<DropdownOptionAvailableInPagesArgs>
  >;
  bulkOperationModal?: Resolver<
    Maybe<ResolversTypes['BulkOperationModal']>,
    ParentType,
    ContextType,
    Partial<DropdownOptionBulkOperationModalArgs>
  >;
  can?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  icon?: Resolver<Maybe<ResolversTypes['DamsIcons']>, ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  primary?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  required?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  requiresAuth?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  value?: Resolver<ResolversTypes['StringOrInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DropzoneEntityToCreateResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DropzoneEntityToCreate'] = ResolversParentTypes['DropzoneEntityToCreate']
> = {
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType,
    RequireFields<DropzoneEntityToCreateOptionsArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditMetadataButtonResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EditMetadataButton'] = ResolversParentTypes['EditMetadataButton']
> = {
  editmodeLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasButton?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  readmodeLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EndpointInformationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EndpointInformation'] = ResolversParentTypes['EndpointInformation']
> = {
  endpointName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  responseAction?: Resolver<
    Maybe<ResolversTypes['EndpointResponseActions']>,
    ParentType,
    ContextType
  >;
  variables?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitiesResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EntitiesResults'] = ResolversParentTypes['EntitiesResults']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  facets?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  results?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Entity']>>>,
    ParentType,
    ContextType
  >;
  sortKeys?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    Partial<EntitiesResultsSortKeysArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']
> = {
  __resolveType: TypeResolveFn<
    | 'Area'
    | 'Asset'
    | 'BaseEntity'
    | 'BibliographicalReference'
    | 'CompositeSite'
    | 'Creator'
    | 'EpiDocTag'
    | 'ExternalSigla'
    | 'Inscription'
    | 'Job'
    | 'Language'
    | 'Location'
    | 'Media'
    | 'MediaFileEntity'
    | 'Point'
    | 'Region'
    | 'SavedSearch'
    | 'Script'
    | 'ShareLink'
    | 'Site'
    | 'SiteFunction'
    | 'SiteType'
    | 'Support'
    | 'Tenant'
    | 'Typology'
    | 'User'
    | 'Word'
    | 'WritingTechnique',
    ParentType,
    ContextType
  >;
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type EntityListElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EntityListElement'] = ResolversParentTypes['EntityListElement']
> = {
  baseLibraryMode?: Resolver<
    Maybe<ResolversTypes['BaseLibraryModes']>,
    ParentType,
    ContextType,
    Partial<EntityListElementBaseLibraryModeArgs>
  >;
  can?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType,
    Partial<EntityListElementCanArgs>
  >;
  customBulkOperations?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementCustomBulkOperationsArgs>
  >;
  customQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementCustomQueryArgs>
  >;
  customQueryEntityPickerList?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementCustomQueryEntityPickerListArgs>
  >;
  customQueryEntityPickerListFilters?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementCustomQueryEntityPickerListFiltersArgs>
  >;
  customQueryFilters?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementCustomQueryFiltersArgs>
  >;
  customQueryRelationType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementCustomQueryRelationTypeArgs>
  >;
  enableAdvancedFilters?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<EntityListElementEnableAdvancedFiltersArgs>
  >;
  enableNavigation?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<EntityListElementEnableNavigationArgs>
  >;
  entityList?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Entity']>>>,
    ParentType,
    ContextType,
    Partial<EntityListElementEntityListArgs>
  >;
  entityListElement?: Resolver<
    Maybe<ResolversTypes['EntityListElement']>,
    ParentType,
    ContextType
  >;
  entityTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Entitytyping']>>>,
    ParentType,
    ContextType,
    Partial<EntityListElementEntityTypesArgs>
  >;
  fetchDeepRelations?: Resolver<
    Maybe<ResolversTypes['FetchDeepRelations']>,
    ParentType,
    ContextType
  >;
  filtersNeedContext?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['EntitySubelement']>>>,
    ParentType,
    ContextType,
    Partial<EntityListElementFiltersNeedContextArgs>
  >;
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<EntityListElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementLabelArgs>
  >;
  relationType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementRelationTypeArgs>
  >;
  searchInputType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementSearchInputTypeArgs>
  >;
  type?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<EntityListElementTypeArgs>
  >;
  viewMode?: Resolver<
    Maybe<ResolversTypes['EntityListViewMode']>,
    ParentType,
    ContextType,
    Partial<EntityListElementViewModeArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityViewElementsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EntityViewElements'] = ResolversParentTypes['EntityViewElements']
> = {
  actionElement?: Resolver<
    Maybe<ResolversTypes['ActionElement']>,
    ParentType,
    ContextType
  >;
  entityListElement?: Resolver<
    Maybe<ResolversTypes['EntityListElement']>,
    ParentType,
    ContextType
  >;
  entityViewerElement?: Resolver<
    Maybe<ResolversTypes['EntityViewerElement']>,
    ParentType,
    ContextType
  >;
  graphElement?: Resolver<
    Maybe<ResolversTypes['GraphElement']>,
    ParentType,
    ContextType
  >;
  hierarchyListElement?: Resolver<
    Maybe<ResolversTypes['HierarchyListElement']>,
    ParentType,
    ContextType
  >;
  manifestViewerElement?: Resolver<
    Maybe<ResolversTypes['ManifestViewerElement']>,
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  markdownViewerElement?: Resolver<
    Maybe<ResolversTypes['MarkdownViewerElement']>,
    ParentType,
    ContextType
  >;
  mediaFileElement?: Resolver<
    Maybe<ResolversTypes['MediaFileElement']>,
    ParentType,
    ContextType
  >;
  singleMediaFileElement?: Resolver<
    Maybe<ResolversTypes['SingleMediaFileElement']>,
    ParentType,
    ContextType
  >;
  windowElement?: Resolver<
    Maybe<ResolversTypes['WindowElement']>,
    ParentType,
    ContextType
  >;
  wysiwygElement?: Resolver<
    Maybe<ResolversTypes['WysiwygElement']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityViewerElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EntityViewerElement'] = ResolversParentTypes['EntityViewerElement']
> = {
  entityId?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<EntityViewerElementEntityIdArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<EntityViewerElementLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EpiDocTagResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['EpiDocTag'] = ResolversParentTypes['EpiDocTag']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExpandButtonOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ExpandButtonOptions'] = ResolversParentTypes['ExpandButtonOptions']
> = {
  orientation?: Resolver<
    Maybe<ResolversTypes['Orientations']>,
    ParentType,
    ContextType,
    Partial<ExpandButtonOptionsOrientationArgs>
  >;
  shown?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<ExpandButtonOptionsShownArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExternalSiglaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ExternalSigla'] = ResolversParentTypes['ExternalSigla']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetInputTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FacetInputType'] = ResolversParentTypes['FacetInputType']
> = {
  facets?: Resolver<
    Maybe<Array<ResolversTypes['FacetInputType']>>,
    ParentType,
    ContextType
  >;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lookups?: Resolver<
    Maybe<Array<ResolversTypes['LookupInputType']>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes['AdvancedFilterTypes']>,
    ParentType,
    ContextType
  >;
  value?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FetchDeepRelationsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FetchDeepRelations'] = ResolversParentTypes['FetchDeepRelations']
> = {
  amountOfRecursions?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    Partial<FetchDeepRelationsAmountOfRecursionsArgs>
  >;
  deepRelationsFetchStrategy?: Resolver<
    Maybe<ResolversTypes['DeepRelationsFetchStrategy']>,
    ParentType,
    ContextType,
    Partial<FetchDeepRelationsDeepRelationsFetchStrategyArgs>
  >;
  entityType?: Resolver<
    Maybe<ResolversTypes['Entitytyping']>,
    ParentType,
    ContextType,
    Partial<FetchDeepRelationsEntityTypeArgs>
  >;
  routeConfig?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['BreadCrumbRoute']>>>,
    ParentType,
    ContextType,
    Partial<FetchDeepRelationsRouteConfigArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileProgressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileProgress'] = ResolversParentTypes['FileProgress']
> = {
  steps?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['FileProgressStep']>>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    ResolversTypes['ActionProgressIndicatorType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileProgressStepResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FileProgressStep'] = ResolversParentTypes['FileProgressStep']
> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<
    ResolversTypes['ProgressStepStatus'],
    ParentType,
    ContextType
  >;
  stepType?: Resolver<
    ResolversTypes['ProgressStepType'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterMatcherMapResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FilterMatcherMap'] = ResolversParentTypes['FilterMatcherMap']
> = {
  boolean?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  metadata_on_relation?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  number?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  selection?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  text?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterOptionsMappingTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FilterOptionsMappingType'] = ResolversParentTypes['FilterOptionsMappingType']
> = {
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Form'] = ResolversParentTypes['Form']
> = {
  formTab?: Resolver<ResolversTypes['FormTab'], ParentType, ContextType>;
  infoLabel?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<FormInfoLabelArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<FormLabelArgs>
  >;
  modalStyle?: Resolver<
    ResolversTypes['ModalStyle'],
    ParentType,
    ContextType,
    RequireFields<FormModalStyleArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormActionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FormAction'] = ResolversParentTypes['FormAction']
> = {
  actionProgressIndicator?: Resolver<
    Maybe<ResolversTypes['ActionProgress']>,
    ParentType,
    ContextType
  >;
  actionQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<FormActionActionQueryArgs>
  >;
  actionType?: Resolver<
    Maybe<ResolversTypes['ActionType']>,
    ParentType,
    ContextType,
    Partial<FormActionActionTypeArgs>
  >;
  creationType?: Resolver<
    ResolversTypes['Entitytyping'],
    ParentType,
    ContextType,
    Partial<FormActionCreationTypeArgs>
  >;
  endpointInformation?: Resolver<
    ResolversTypes['EndpointInformation'],
    ParentType,
    ContextType,
    RequireFields<FormActionEndpointInformationArgs, 'input'>
  >;
  icon?: Resolver<
    Maybe<ResolversTypes['DamsIcons']>,
    ParentType,
    ContextType,
    Partial<FormActionIconArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<FormActionLabelArgs, 'input'>
  >;
  showsFormErrors?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<FormActionShowsFormErrorsArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormFieldsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FormFields'] = ResolversParentTypes['FormFields']
> = {
  action?: Resolver<
    Maybe<ResolversTypes['FormAction']>,
    ParentType,
    ContextType
  >;
  metaData?: Resolver<ResolversTypes['PanelMetaData'], ParentType, ContextType>;
  uploadContainer?: Resolver<
    Maybe<ResolversTypes['UploadContainer']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormTabResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['FormTab'] = ResolversParentTypes['FormTab']
> = {
  formFields?: Resolver<ResolversTypes['FormFields'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FormattersResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Formatters'] = ResolversParentTypes['Formatters']
> = {
  __resolveType: TypeResolveFn<
    'LinkFormatter' | 'PillFormatter' | 'RegexpMatchFormatter',
    ParentType,
    ContextType
  >;
};

export type GeoJsonFeatureResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GeoJsonFeature'] = ResolversParentTypes['GeoJsonFeature']
> = {
  value?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<GeoJsonFeatureValueArgs, 'coordinates' | 'id' | 'weight'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphDatasetResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GraphDataset'] = ResolversParentTypes['GraphDataset']
> = {
  filter?: Resolver<
    Maybe<ResolversTypes['GraphDatasetFilter']>,
    ParentType,
    ContextType
  >;
  labels?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphDatasetFilterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GraphDatasetFilter'] = ResolversParentTypes['GraphDatasetFilter']
> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  values?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GraphElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GraphElement'] = ResolversParentTypes['GraphElement']
> = {
  convert_to?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<GraphElementConvert_ToArgs, 'input'>
  >;
  datapoints?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<GraphElementDatapointsArgs, 'input'>
  >;
  dataset?: Resolver<
    ResolversTypes['GraphDataset'],
    ParentType,
    ContextType,
    RequireFields<GraphElementDatasetArgs, 'input'>
  >;
  datasource?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<GraphElementDatasourceArgs, 'input'>
  >;
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<GraphElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<GraphElementLabelArgs>
  >;
  timeUnit?: Resolver<
    ResolversTypes['TimeUnit'],
    ParentType,
    ContextType,
    RequireFields<GraphElementTimeUnitArgs, 'input'>
  >;
  type?: Resolver<
    ResolversTypes['GraphType'],
    ParentType,
    ContextType,
    RequireFields<GraphElementTypeArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HiddenFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['HiddenField'] = ResolversParentTypes['HiddenField']
> = {
  entityType?: Resolver<
    Maybe<ResolversTypes['Entitytyping']>,
    ParentType,
    ContextType
  >;
  hidden?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  inherited?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  keyToExtractValue?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  relationToExtractKey?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  searchValueForFilter?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HierarchyListElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['HierarchyListElement'] = ResolversParentTypes['HierarchyListElement']
> = {
  can?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    Partial<HierarchyListElementCanArgs>
  >;
  centerCoordinatesKey?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<HierarchyListElementCenterCoordinatesKeyArgs, 'input'>
  >;
  customQuery?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<HierarchyListElementCustomQueryArgs>
  >;
  entityTypeAsCenterPoint?: Resolver<
    Maybe<ResolversTypes['Entitytyping']>,
    ParentType,
    ContextType,
    Partial<HierarchyListElementEntityTypeAsCenterPointArgs>
  >;
  hierarchyRelationList?: Resolver<
    Array<Maybe<ResolversTypes['HierarchyRelationList']>>,
    ParentType,
    ContextType,
    Partial<HierarchyListElementHierarchyRelationListArgs>
  >;
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<HierarchyListElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<HierarchyListElementLabelArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HierarchyRelationListResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['HierarchyRelationList'] = ResolversParentTypes['HierarchyRelationList']
> = {
  entityType?: Resolver<
    ResolversTypes['Entitytyping'],
    ParentType,
    ContextType
  >;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportReturnResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ImportReturn'] = ResolversParentTypes['ImportReturn']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  message_id?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InputFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InputField'] = ResolversParentTypes['InputField']
> = {
  advancedFilterInputForRetrievingAllOptions?: Resolver<
    Maybe<Array<ResolversTypes['AdvancedFilterInputType']>>,
    ParentType,
    ContextType
  >;
  advancedFilterInputForRetrievingOptions?: Resolver<
    Maybe<Array<ResolversTypes['AdvancedFilterInputType']>>,
    ParentType,
    ContextType
  >;
  advancedFilterInputForRetrievingRelatedOptions?: Resolver<
    Maybe<Array<ResolversTypes['AdvancedFilterInputType']>>,
    ParentType,
    ContextType
  >;
  advancedFilterInputForSearchingOptions?: Resolver<
    Maybe<ResolversTypes['AdvancedFilterInputType']>,
    ParentType,
    ContextType
  >;
  autoSelectable?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  canCreateEntityFromOption?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  dependsOn?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  disabled?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  entityType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  fieldKeyToSave?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<InputFieldFieldKeyToSaveArgs>
  >;
  fieldName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<InputFieldFieldNameArgs>
  >;
  fileProgressSteps?: Resolver<
    Maybe<ResolversTypes['FileProgress']>,
    ParentType,
    ContextType
  >;
  fileTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['FileType']>>>,
    ParentType,
    ContextType
  >;
  fromRelationType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hasVirtualKeyboard?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  isMetadataField?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<InputFieldIsMetadataFieldArgs>
  >;
  lineClamp?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  maxAmountOfFiles?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  maxFileSize?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  metadataKeyToCreateEntityFromOption?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  multiple?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  options?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['DropdownOption']>>>,
    ParentType,
    ContextType
  >;
  relationFilter?: Resolver<
    Maybe<ResolversTypes['AdvancedFilterInputType']>,
    ParentType,
    ContextType
  >;
  relationType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadMultiple?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  validation?: Resolver<
    Maybe<ResolversTypes['Validation']>,
    ParentType,
    ContextType,
    Partial<InputFieldValidationArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Inscription'] = ResolversParentTypes['Inscription']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntialValuesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['IntialValues'] = ResolversParentTypes['IntialValues']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  keyLabel?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<IntialValuesKeyLabelArgs, 'key' | 'source'>
  >;
  keyValue?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<IntialValuesKeyValueArgs, 'key' | 'source'>
  >;
  relationMetadata?: Resolver<
    Maybe<ResolversTypes['IntialValues']>,
    ParentType,
    ContextType,
    RequireFields<IntialValuesRelationMetadataArgs, 'type'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type JobResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']
> = {
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _rev?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  amount_of_jobs?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  asset_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  completed_jobs?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  end_time?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  job_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  job_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  mediafile_id?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent_job_id?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  start_time?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sub_jobs?: Resolver<
    Maybe<ResolversTypes['SubJobResults']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JobsResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['JobsResults'] = ResolversParentTypes['JobsResults']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Job']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KeyAndValueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['KeyAndValue'] = ResolversParentTypes['KeyAndValue']
> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type KeyValueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['KeyValue'] = ResolversParentTypes['KeyValue']
> = {
  keyValue?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType,
    RequireFields<KeyValueKeyValueArgs, 'key'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LinkFormatterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LinkFormatter'] = ResolversParentTypes['LinkFormatter']
> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LookupInputTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LookupInputType'] = ResolversParentTypes['LookupInputType']
> = {
  as?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foreign_field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  local_field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ManifestViewerElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ManifestViewerElement'] = ResolversParentTypes['ManifestViewerElement']
> = {
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<ManifestViewerElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<ManifestViewerElementLabelArgs>
  >;
  manifestUrl?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<ManifestViewerElementManifestUrlArgs, 'metadataKey'>
  >;
  manifestVersion?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType,
    RequireFields<ManifestViewerElementManifestVersionArgs, 'metadataKey'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapElement'] = ResolversParentTypes['MapElement']
> = {
  center?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<MapElementCenterArgs>
  >;
  config?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ConfigItem']>>>,
    ParentType,
    ContextType,
    Partial<MapElementConfigArgs>
  >;
  geoJsonFeature?: Resolver<
    Maybe<ResolversTypes['GeoJsonFeature']>,
    ParentType,
    ContextType
  >;
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MapElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<MapElementLabelArgs>
  >;
  mapMetadata?: Resolver<
    Maybe<ResolversTypes['MapMetadata']>,
    ParentType,
    ContextType
  >;
  metaData?: Resolver<ResolversTypes['PanelMetaData'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<MapElementTypeArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapMetadataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MapMetadata'] = ResolversParentTypes['MapMetadata']
> = {
  value?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType,
    RequireFields<MapMetadataValueArgs, 'key' | 'source'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarkdownViewerElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MarkdownViewerElement'] = ResolversParentTypes['MarkdownViewerElement']
> = {
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MarkdownViewerElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<MarkdownViewerElementLabelArgs>
  >;
  markdownContent?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<MarkdownViewerElementMarkdownContentArgs, 'metadataKey'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchMetadataValueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MatchMetadataValue'] = ResolversParentTypes['MatchMetadataValue']
> = {
  matchKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  matchValue?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Media'] = ResolversParentTypes['Media']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaFileResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MediaFile'] = ResolversParentTypes['MediaFile']
> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entities?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  filename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isPublic?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  is_primary?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  is_primary_thumbnail?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  metadata?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['MediaFileMetadata']>>>,
    ParentType,
    ContextType
  >;
  mimetype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  original_file_location?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  thumbnail_file_location?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  transcode_filename?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaFileElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MediaFileElement'] = ResolversParentTypes['MediaFileElement']
> = {
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MediaFileElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<MediaFileElementLabelArgs>
  >;
  metaData?: Resolver<ResolversTypes['PanelMetaData'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<MediaFileElementTypeArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaFileEntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MediaFileEntity'] = ResolversParentTypes['MediaFileEntity']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaFileMetadataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MediaFileMetadata'] = ResolversParentTypes['MediaFileMetadata']
> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaFilePostReturnResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MediaFilePostReturn'] = ResolversParentTypes['MediaFilePostReturn']
> = {
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Menu'] = ResolversParentTypes['Menu']
> = {
  menuItem?: Resolver<
    Maybe<ResolversTypes['MenuItem']>,
    ParentType,
    ContextType,
    RequireFields<MenuMenuItemArgs, 'label'>
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MenuItem'] = ResolversParentTypes['MenuItem']
> = {
  can?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  entityType?: Resolver<
    Maybe<ResolversTypes['Entitytyping']>,
    ParentType,
    ContextType
  >;
  icon?: Resolver<Maybe<ResolversTypes['MenuIcons']>, ParentType, ContextType>;
  isLoggedIn?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requiresAuth?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  subMenu?: Resolver<
    Maybe<ResolversTypes['Menu']>,
    ParentType,
    ContextType,
    RequireFields<MenuItemSubMenuArgs, 'name'>
  >;
  typeLink?: Resolver<
    Maybe<ResolversTypes['MenuTypeLink']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuTypeLinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MenuTypeLink'] = ResolversParentTypes['MenuTypeLink']
> = {
  modal?: Resolver<
    Maybe<ResolversTypes['MenuTypeLinkModal']>,
    ParentType,
    ContextType
  >;
  route?: Resolver<
    Maybe<ResolversTypes['MenuTypeLinkRoute']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuTypeLinkModalResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MenuTypeLinkModal'] = ResolversParentTypes['MenuTypeLinkModal']
> = {
  askForCloseConfirmation?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  formQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  neededPermission?: Resolver<
    Maybe<ResolversTypes['Permission']>,
    ParentType,
    ContextType
  >;
  typeModal?: Resolver<ResolversTypes['TypeModals'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuTypeLinkRouteResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MenuTypeLinkRoute'] = ResolversParentTypes['MenuTypeLinkRoute']
> = {
  destination?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MenuWrapperResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MenuWrapper'] = ResolversParentTypes['MenuWrapper']
> = {
  menu?: Resolver<ResolversTypes['Menu'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']
> = {
  immutable?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lang?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<
    Maybe<ResolversTypes['Unit']>,
    ParentType,
    ContextType,
    Partial<MetadataUnitArgs>
  >;
  value?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataAndRelationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MetadataAndRelation'] = ResolversParentTypes['MetadataAndRelation']
> = {
  __resolveType: TypeResolveFn<
    'Metadata' | 'MetadataRelation',
    ParentType,
    ContextType
  >;
};

export type MetadataFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MetadataField'] = ResolversParentTypes['MetadataField']
> = {
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  config_key?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  options?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['MetadataFieldOption']>>>,
    ParentType,
    ContextType
  >;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['InputFieldTypes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataFieldOptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MetadataFieldOption'] = ResolversParentTypes['MetadataFieldOption']
> = {
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataRelationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MetadataRelation'] = ResolversParentTypes['MetadataRelation']
> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  linkedEntity?: Resolver<
    Maybe<ResolversTypes['Entity']>,
    ParentType,
    ContextType
  >;
  metadataOnRelation?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['KeyAndValue']>>>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  CreateEntity?: Resolver<
    Maybe<ResolversTypes['Entity']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateEntityArgs, 'entity'>
  >;
  bulkAddRelations?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationBulkAddRelationsArgs,
      'entityIds' | 'relationEntityId' | 'relationType'
    >
  >;
  bulkDeleteEntities?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationBulkDeleteEntitiesArgs, 'ids' | 'path'>
  >;
  deleteData?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteDataArgs, 'deleteMediafiles' | 'id' | 'path'>
  >;
  generateTranscode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationGenerateTranscodeArgs,
      'mediafileIds' | 'transcodeType'
    >
  >;
  getAssetsRelationedWithMediafFile?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Asset']>>>,
    ParentType,
    ContextType,
    RequireFields<MutationGetAssetsRelationedWithMediafFileArgs, 'mediaFileId'>
  >;
  getMediaRelationedWithMediafFile?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Media']>>>,
    ParentType,
    ContextType,
    RequireFields<MutationGetMediaRelationedWithMediafFileArgs, 'mediaFileId'>
  >;
  linkMediafileToEntity?: Resolver<
    Maybe<ResolversTypes['MediaFile']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkMediafileToEntityArgs,
      'entityId' | 'mediaFileInput'
    >
  >;
  mutateEntityValues?: Resolver<
    Maybe<ResolversTypes['Entity']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationMutateEntityValuesArgs,
      'collection' | 'formInput' | 'id'
    >
  >;
  patchMediaFileMetadata?: Resolver<
    Maybe<ResolversTypes['MediaFile']>,
    ParentType,
    ContextType,
    RequireFields<
      MutationPatchMediaFileMetadataArgs,
      'MediaFileMetadata' | 'MediafileId'
    >
  >;
  postStartImport?: Resolver<
    Maybe<ResolversTypes['ImportReturn']>,
    ParentType,
    ContextType,
    RequireFields<MutationPostStartImportArgs, 'folder'>
  >;
  setPrimaryMediafile?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<MutationSetPrimaryMediafileArgs, 'entityId' | 'mediafileId'>
  >;
  setPrimaryThumbnail?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<MutationSetPrimaryThumbnailArgs, 'entityId' | 'mediafileId'>
  >;
  updateMetadataWithCsv?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMetadataWithCsvArgs, 'csv' | 'entityType'>
  >;
};

export type PaginationLimitOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PaginationLimitOptions'] = ResolversParentTypes['PaginationLimitOptions']
> = {
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType,
    RequireFields<PaginationLimitOptionsOptionsArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelInfo'] = ResolversParentTypes['PanelInfo']
> = {
  inputField?: Resolver<
    ResolversTypes['InputField'],
    ParentType,
    ContextType,
    RequireFields<PanelInfoInputFieldArgs, 'type'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelInfoLabelArgs, 'input'>
  >;
  value?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelInfoValueArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelLinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelLink'] = ResolversParentTypes['PanelLink']
> = {
  key?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelLinkKeyArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelLinkLabelArgs, 'input'>
  >;
  linkIcon?: Resolver<
    Maybe<ResolversTypes['DamsIcons']>,
    ParentType,
    ContextType,
    RequireFields<PanelLinkLinkIconArgs, 'input'>
  >;
  linkText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<PanelLinkLinkTextArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelMetaDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelMetaData'] = ResolversParentTypes['PanelMetaData']
> = {
  can?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataCanArgs>
  >;
  copyToClipboard?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataCopyToClipboardArgs>
  >;
  customValue?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataCustomValueArgs>
  >;
  hiddenField?: Resolver<
    Maybe<ResolversTypes['HiddenField']>,
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataHiddenFieldArgs, 'input'>
  >;
  inputField?: Resolver<
    ResolversTypes['InputField'],
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataInputFieldArgs, 'type'>
  >;
  isMultilingual?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataIsMultilingualArgs>
  >;
  key?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataKeyArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataLabelArgs, 'input'>
  >;
  lineClamp?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<PanelMetaDataLineClampArgs>
  >;
  linkText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataLinkTextArgs, 'input'>
  >;
  showOnlyInEditMode?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataShowOnlyInEditModeArgs>
  >;
  tooltip?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataTooltipArgs, 'input'>
  >;
  unit?: Resolver<
    ResolversTypes['Unit'],
    ParentType,
    ContextType,
    RequireFields<PanelMetaDataUnitArgs, 'input'>
  >;
  valueTooltip?: Resolver<
    Maybe<ResolversTypes['PanelMetadataValueTooltip']>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataValueTooltipArgs>
  >;
  valueTranslationKey?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<PanelMetaDataValueTranslationKeyArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelMetadataValueTooltipResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelMetadataValueTooltip'] = ResolversParentTypes['PanelMetadataValueTooltip']
> = {
  type?: Resolver<
    ResolversTypes['PanelMetadataValueTooltipTypes'],
    ParentType,
    ContextType
  >;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelRelationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelRelation'] = ResolversParentTypes['PanelRelation']
> = {
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelRelationMetaDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelRelationMetaData'] = ResolversParentTypes['PanelRelationMetaData']
> = {
  inputField?: Resolver<
    ResolversTypes['InputField'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationMetaDataInputFieldArgs, 'type'>
  >;
  key?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationMetaDataKeyArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationMetaDataLabelArgs, 'input'>
  >;
  linkText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<PanelRelationMetaDataLinkTextArgs, 'input'>
  >;
  showOnlyInEditMode?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PanelRelationMetaDataShowOnlyInEditModeArgs>
  >;
  unit?: Resolver<
    ResolversTypes['Unit'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationMetaDataUnitArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelRelationRootDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelRelationRootData'] = ResolversParentTypes['PanelRelationRootData']
> = {
  inputField?: Resolver<
    ResolversTypes['InputField'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationRootDataInputFieldArgs, 'type'>
  >;
  key?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationRootDataKeyArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationRootDataLabelArgs, 'input'>
  >;
  linkText?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<PanelRelationRootDataLinkTextArgs, 'input'>
  >;
  showOnlyInEditMode?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PanelRelationRootDataShowOnlyInEditModeArgs>
  >;
  unit?: Resolver<
    ResolversTypes['Unit'],
    ParentType,
    ContextType,
    RequireFields<PanelRelationRootDataUnitArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PanelThumbnailResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PanelThumbnail'] = ResolversParentTypes['PanelThumbnail']
> = {
  customUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<PanelThumbnailCustomUrlArgs, 'input'>
  >;
  filename?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<PanelThumbnailFilenameArgs>
  >;
  height?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    RequireFields<PanelThumbnailHeightArgs, 'input'>
  >;
  key?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    RequireFields<PanelThumbnailKeyArgs, 'input'>
  >;
  width?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType,
    RequireFields<PanelThumbnailWidthArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionMappingResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PermissionMapping'] = ResolversParentTypes['PermissionMapping']
> = {
  hasPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionRequestInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PermissionRequestInfo'] = ResolversParentTypes['PermissionRequestInfo']
> = {
  body?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  crud?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  datasource?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PermissionResult'] = ResolversParentTypes['PermissionResult']
> = {
  hasPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PillFormatterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PillFormatter'] = ResolversParentTypes['PillFormatter']
> = {
  background?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PointResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Point'] = ResolversParentTypes['Point']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PreviewComponentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PreviewComponent'] = ResolversParentTypes['PreviewComponent']
> = {
  listItemsCoverage?: Resolver<
    ResolversTypes['ListItemCoverageTypes'],
    ParentType,
    ContextType,
    RequireFields<PreviewComponentListItemsCoverageArgs, 'input'>
  >;
  metadataPreviewQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<PreviewComponentMetadataPreviewQueryArgs>
  >;
  openByDefault?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PreviewComponentOpenByDefaultArgs>
  >;
  previewQuery?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<PreviewComponentPreviewQueryArgs>
  >;
  showCurrentPreviewFlow?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<PreviewComponentShowCurrentPreviewFlowArgs>
  >;
  title?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<PreviewComponentTitleArgs>
  >;
  type?: Resolver<
    ResolversTypes['PreviewTypes'],
    ParentType,
    ContextType,
    RequireFields<PreviewComponentTypeArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  AdvancedPermission?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType,
    RequireFields<QueryAdvancedPermissionArgs, 'permission'>
  >;
  AdvancedPermissions?: Resolver<
    Array<ResolversTypes['PermissionResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryAdvancedPermissionsArgs, 'permissions'>
  >;
  BulkOperationCsvExportKeys?: Resolver<
    ResolversTypes['BulkOperationCsvExportKeys'],
    ParentType,
    ContextType,
    RequireFields<QueryBulkOperationCsvExportKeysArgs, 'entityType'>
  >;
  BulkOperations?: Resolver<
    ResolversTypes['Entity'],
    ParentType,
    ContextType,
    RequireFields<QueryBulkOperationsArgs, 'entityType'>
  >;
  BulkOperationsRelationForm?: Resolver<
    ResolversTypes['WindowElement'],
    ParentType,
    ContextType
  >;
  CustomBulkOperations?: Resolver<
    ResolversTypes['Entity'],
    ParentType,
    ContextType
  >;
  CustomFormattersSettings?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType
  >;
  Directories?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Directory']>>>,
    ParentType,
    ContextType,
    Partial<QueryDirectoriesArgs>
  >;
  DownloadItemsInZip?: Resolver<
    Maybe<ResolversTypes['Entity']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryDownloadItemsInZipArgs,
      | 'basicCsv'
      | 'downloadEntity'
      | 'entities'
      | 'includeAssetCsv'
      | 'mediafiles'
    >
  >;
  DropzoneEntityToCreate?: Resolver<
    ResolversTypes['DropzoneEntityToCreate'],
    ParentType,
    ContextType
  >;
  Entities?: Resolver<
    Maybe<ResolversTypes['EntitiesResults']>,
    ParentType,
    ContextType,
    RequireFields<QueryEntitiesArgs, 'advancedFilterInputs' | 'searchValue'>
  >;
  EntitiesByAdvancedSearch?: Resolver<
    ResolversTypes['EntitiesResults'],
    ParentType,
    ContextType,
    RequireFields<
      QueryEntitiesByAdvancedSearchArgs,
      | 'facet_by'
      | 'filter_by'
      | 'q'
      | 'query_by'
      | 'query_by_weights'
      | 'sort_by'
    >
  >;
  Entity?: Resolver<
    Maybe<ResolversTypes['Entity']>,
    ParentType,
    ContextType,
    RequireFields<QueryEntityArgs, 'id' | 'type'>
  >;
  EntityTypeFilters?: Resolver<
    ResolversTypes['Entity'],
    ParentType,
    ContextType,
    RequireFields<QueryEntityTypeFiltersArgs, 'type'>
  >;
  EntityTypeSortOptions?: Resolver<
    ResolversTypes['Entity'],
    ParentType,
    ContextType,
    RequireFields<QueryEntityTypeSortOptionsArgs, 'entityType'>
  >;
  FetchMediafilesOfEntity?: Resolver<
    Array<Maybe<ResolversTypes['MediaFileEntity']>>,
    ParentType,
    ContextType,
    RequireFields<QueryFetchMediafilesOfEntityArgs, 'entityIds'>
  >;
  FilterMatcherMapping?: Resolver<
    ResolversTypes['FilterMatcherMap'],
    ParentType,
    ContextType
  >;
  FilterOptions?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType,
    RequireFields<QueryFilterOptionsArgs, 'entityType' | 'input' | 'limit'>
  >;
  GenerateOcrWithAsset?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryGenerateOcrWithAssetArgs,
      'assetId' | 'language' | 'operation'
    >
  >;
  GeoFilterForMap?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  GetDynamicForm?: Resolver<ResolversTypes['Form'], ParentType, ContextType>;
  GetEntityDetailContextMenuActions?: Resolver<
    ResolversTypes['ContextMenuActions'],
    ParentType,
    ContextType
  >;
  GraphData?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType,
    RequireFields<QueryGraphDataArgs, 'graph' | 'id'>
  >;
  Job?: Resolver<
    Maybe<ResolversTypes['Job']>,
    ParentType,
    ContextType,
    RequireFields<QueryJobArgs, 'failed' | 'id'>
  >;
  Jobs?: Resolver<
    Maybe<ResolversTypes['JobsResults']>,
    ParentType,
    ContextType,
    RequireFields<QueryJobsArgs, 'failed'>
  >;
  Menu?: Resolver<
    Maybe<ResolversTypes['MenuWrapper']>,
    ParentType,
    ContextType,
    RequireFields<QueryMenuArgs, 'name'>
  >;
  PaginationLimitOptions?: Resolver<
    ResolversTypes['PaginationLimitOptions'],
    ParentType,
    ContextType
  >;
  PermissionMapping?: Resolver<
    ResolversTypes['JSON'],
    ParentType,
    ContextType,
    RequireFields<QueryPermissionMappingArgs, 'entities'>
  >;
  PermissionMappingCreate?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryPermissionMappingCreateArgs, 'entityType'>
  >;
  PermissionMappingEntityDetail?: Resolver<
    Array<ResolversTypes['PermissionMapping']>,
    ParentType,
    ContextType,
    RequireFields<QueryPermissionMappingEntityDetailArgs, 'entityType' | 'id'>
  >;
  PermissionMappingPerEntityType?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryPermissionMappingPerEntityTypeArgs, 'type'>
  >;
  PreviewComponents?: Resolver<
    Maybe<ResolversTypes['Entity']>,
    ParentType,
    ContextType,
    RequireFields<QueryPreviewComponentsArgs, 'entityType'>
  >;
  PreviewElement?: Resolver<
    Maybe<ResolversTypes['ColumnList']>,
    ParentType,
    ContextType
  >;
  Tenants?: Resolver<
    Maybe<ResolversTypes['EntitiesResults']>,
    ParentType,
    ContextType
  >;
  User?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  UserPermissions?: Resolver<
    Maybe<ResolversTypes['userPermissions']>,
    ParentType,
    ContextType
  >;
  getMediafile?: Resolver<
    Maybe<ResolversTypes['MediaFile']>,
    ParentType,
    ContextType,
    Partial<QueryGetMediafileArgs>
  >;
};

export type RegexpMatchFormatterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RegexpMatchFormatter'] = ResolversParentTypes['RegexpMatchFormatter']
> = {
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RelationFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RelationField'] = ResolversParentTypes['RelationField']
> = {
  acceptedEntityTypes?: Resolver<
    Array<Maybe<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  disabled?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['MetadataField']>>>,
    ParentType,
    ContextType
  >;
  relationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  viewMode?: Resolver<
    Maybe<ResolversTypes['RelationFieldViewMode']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequiredOneOfMetadataValidationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RequiredOneOfMetadataValidation'] = ResolversParentTypes['RequiredOneOfMetadataValidation']
> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  includedMetadataFields?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequiredOneOfRelationValidationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RequiredOneOfRelationValidation'] = ResolversParentTypes['RequiredOneOfRelationValidation']
> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  relationTypes?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RequiredRelationValidationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RequiredRelationValidation'] = ResolversParentTypes['RequiredRelationValidation']
> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  exact?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  relationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RouteMatchingResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RouteMatching'] = ResolversParentTypes['RouteMatching']
> = {
  entityType?: Resolver<
    Maybe<ResolversTypes['Entitytyping']>,
    ParentType,
    ContextType
  >;
  routeName?: Resolver<
    Maybe<ResolversTypes['RouteNames']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SavedSearchResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SavedSearch'] = ResolversParentTypes['SavedSearch']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScriptResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Script'] = ResolversParentTypes['Script']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShareLinkResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ShareLink'] = ResolversParentTypes['ShareLink']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SingleMediaFileElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SingleMediaFileElement'] = ResolversParentTypes['SingleMediaFileElement']
> = {
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<SingleMediaFileElementIsCollapsedArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<SingleMediaFileElementLabelArgs>
  >;
  metaData?: Resolver<ResolversTypes['PanelMetaData'], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<SingleMediaFileElementTypeArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Site'] = ResolversParentTypes['Site']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteFunctionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SiteFunction'] = ResolversParentTypes['SiteFunction']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SiteTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SiteType'] = ResolversParentTypes['SiteType']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SortOptionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SortOptions'] = ResolversParentTypes['SortOptions']
> = {
  isAsc?: Resolver<
    Maybe<ResolversTypes['SortingDirection']>,
    ParentType,
    ContextType,
    RequireFields<SortOptionsIsAscArgs, 'input'>
  >;
  options?: Resolver<
    Array<ResolversTypes['DropdownOption']>,
    ParentType,
    ContextType,
    RequireFields<SortOptionsOptionsArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface StringOrIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['StringOrInt'], any> {
  name: 'StringOrInt';
}

export type SubJobResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SubJobResults'] = ResolversParentTypes['SubJobResults']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  results?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Job']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SupportResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Support'] = ResolversParentTypes['Support']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagConfigurationByEntityResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TagConfigurationByEntity'] = ResolversParentTypes['TagConfigurationByEntity']
> = {
  colorMetadataKey?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  configurationEntityRelationType?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  configurationEntityType?: Resolver<
    ResolversTypes['Entitytyping'],
    ParentType,
    ContextType
  >;
  metadataKeysToSetAsAttribute?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  secondaryAttributeToDetermineTagConfig?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  tagMetadataKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaggableEntityConfigurationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TaggableEntityConfiguration'] = ResolversParentTypes['TaggableEntityConfiguration']
> = {
  createNewEntityFormQuery?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  metadataFilterForTagContent?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  metadataKeysToSetAsAttribute?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  relationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  replaceCharacterFromTagSettings?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['CharacterReplacementSettings']>>>,
    ParentType,
    ContextType
  >;
  tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tagConfigurationByEntity?: Resolver<
    Maybe<ResolversTypes['TagConfigurationByEntity']>,
    ParentType,
    ContextType
  >;
  taggableEntityType?: Resolver<
    ResolversTypes['Entitytyping'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaggingExtensionConfigurationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TaggingExtensionConfiguration'] = ResolversParentTypes['TaggingExtensionConfiguration']
> = {
  customQuery?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<TaggingExtensionConfigurationCustomQueryArgs, 'input'>
  >;
  taggableEntityConfiguration?: Resolver<
    Array<ResolversTypes['TaggableEntityConfiguration']>,
    ParentType,
    ContextType,
    RequireFields<
      TaggingExtensionConfigurationTaggableEntityConfigurationArgs,
      'configuration'
    >
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TenantResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Tenant'] = ResolversParentTypes['Tenant']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TypologyResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Typology'] = ResolversParentTypes['Typology']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadContainerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UploadContainer'] = ResolversParentTypes['UploadContainer']
> = {
  uploadField?: Resolver<
    ResolversTypes['UploadField'],
    ParentType,
    ContextType
  >;
  uploadFlow?: Resolver<
    ResolversTypes['UploadFlow'],
    ParentType,
    ContextType,
    RequireFields<UploadContainerUploadFlowArgs, 'input'>
  >;
  uploadMetadata?: Resolver<
    Maybe<ResolversTypes['PanelMetaData']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadFieldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UploadField'] = ResolversParentTypes['UploadField']
> = {
  dryRunUpload?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    Partial<UploadFieldDryRunUploadArgs>
  >;
  extraMediafileType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<UploadFieldExtraMediafileTypeArgs>
  >;
  infoLabelUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<UploadFieldInfoLabelUrlArgs>
  >;
  inputField?: Resolver<
    ResolversTypes['InputField'],
    ParentType,
    ContextType,
    RequireFields<UploadFieldInputFieldArgs, 'type'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<UploadFieldLabelArgs, 'input'>
  >;
  templateCsvs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType,
    RequireFields<UploadFieldTemplateCsvsArgs, 'input'>
  >;
  uploadFieldSize?: Resolver<
    ResolversTypes['UploadFieldSize'],
    ParentType,
    ContextType,
    Partial<UploadFieldUploadFieldSizeArgs>
  >;
  uploadFieldType?: Resolver<
    ResolversTypes['UploadFieldType'],
    ParentType,
    ContextType,
    RequireFields<UploadFieldUploadFieldTypeArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  family_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  given_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  mapElement?: Resolver<
    Maybe<ResolversTypes['MapElement']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preferred_username?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ValidationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Validation'] = ResolversParentTypes['Validation']
> = {
  available_if?: Resolver<
    Maybe<ResolversTypes['Conditional']>,
    ParentType,
    ContextType
  >;
  customValue?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  fastValidationMessage?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  has_one_of_required_metadata?: Resolver<
    Maybe<ResolversTypes['RequiredOneOfMetadataValidation']>,
    ParentType,
    ContextType
  >;
  has_one_of_required_relations?: Resolver<
    Maybe<ResolversTypes['RequiredOneOfRelationValidation']>,
    ParentType,
    ContextType
  >;
  has_required_relation?: Resolver<
    Maybe<ResolversTypes['RequiredRelationValidation']>,
    ParentType,
    ContextType
  >;
  regex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  required_if?: Resolver<
    Maybe<ResolversTypes['Conditional']>,
    ParentType,
    ContextType
  >;
  value?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ValidationRules']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ViewModesWithConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ViewModesWithConfig'] = ResolversParentTypes['ViewModesWithConfig']
> = {
  config?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ConfigItem']>>>,
    ParentType,
    ContextType
  >;
  viewMode?: Resolver<
    Maybe<ResolversTypes['ViewModes']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindowElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WindowElement'] = ResolversParentTypes['WindowElement']
> = {
  editMetadataButton?: Resolver<
    Maybe<ResolversTypes['EditMetadataButton']>,
    ParentType,
    ContextType,
    RequireFields<WindowElementEditMetadataButtonArgs, 'input'>
  >;
  expandButtonOptions?: Resolver<
    Maybe<ResolversTypes['ExpandButtonOptions']>,
    ParentType,
    ContextType
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<WindowElementLabelArgs>
  >;
  layout?: Resolver<
    Maybe<ResolversTypes['WindowElementLayout']>,
    ParentType,
    ContextType,
    Partial<WindowElementLayoutArgs>
  >;
  lineClamp?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    Partial<WindowElementLineClampArgs>
  >;
  panels?: Resolver<
    ResolversTypes['WindowElementPanel'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindowElementBulkDataPanelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WindowElementBulkDataPanel'] = ResolversParentTypes['WindowElementBulkDataPanel']
> = {
  intialValueKey?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<WindowElementBulkDataPanelIntialValueKeyArgs, 'input'>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<WindowElementBulkDataPanelLabelArgs, 'input'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WindowElementPanelResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WindowElementPanel'] = ResolversParentTypes['WindowElementPanel']
> = {
  bulkData?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<WindowElementPanelBulkDataArgs, 'bulkDataSource'>
  >;
  canBeMultipleColumns?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<WindowElementPanelCanBeMultipleColumnsArgs, 'input'>
  >;
  entityListElement?: Resolver<
    Maybe<ResolversTypes['EntityListElement']>,
    ParentType,
    ContextType
  >;
  info?: Resolver<ResolversTypes['PanelInfo'], ParentType, ContextType>;
  isCollapsed?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<WindowElementPanelIsCollapsedArgs, 'input'>
  >;
  isEditable?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<WindowElementPanelIsEditableArgs, 'input'>
  >;
  label?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType,
    Partial<WindowElementPanelLabelArgs>
  >;
  metaData?: Resolver<ResolversTypes['PanelMetaData'], ParentType, ContextType>;
  panelType?: Resolver<
    ResolversTypes['PanelType'],
    ParentType,
    ContextType,
    RequireFields<WindowElementPanelPanelTypeArgs, 'input'>
  >;
  relation?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['PanelRelation']>>>,
    ParentType,
    ContextType
  >;
  wysiwygElement?: Resolver<
    Maybe<ResolversTypes['WysiwygElement']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WordResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Word'] = ResolversParentTypes['Word']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WritingTechniqueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WritingTechnique'] = ResolversParentTypes['WritingTechnique']
> = {
  advancedFilters?: Resolver<
    Maybe<ResolversTypes['AdvancedFilters']>,
    ParentType,
    ContextType
  >;
  allowedViewModes?: Resolver<
    Maybe<ResolversTypes['AllowedViewModes']>,
    ParentType,
    ContextType
  >;
  bulkOperationOptions?: Resolver<
    Maybe<ResolversTypes['BulkOperationOptions']>,
    ParentType,
    ContextType
  >;
  deleteQueryOptions?: Resolver<
    Maybe<ResolversTypes['DeleteQueryOptions']>,
    ParentType,
    ContextType
  >;
  entityView?: Resolver<ResolversTypes['ColumnList'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  intialValues?: Resolver<
    ResolversTypes['IntialValues'],
    ParentType,
    ContextType
  >;
  previewComponent?: Resolver<
    Maybe<ResolversTypes['PreviewComponent']>,
    ParentType,
    ContextType
  >;
  relationValues?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType
  >;
  sortOptions?: Resolver<
    Maybe<ResolversTypes['SortOptions']>,
    ParentType,
    ContextType
  >;
  teaserMetadata?: Resolver<
    Maybe<ResolversTypes['teaserMetadata']>,
    ParentType,
    ContextType
  >;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WysiwygElementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['WysiwygElement'] = ResolversParentTypes['WysiwygElement']
> = {
  extensions?: Resolver<
    Array<Maybe<ResolversTypes['WysiwygExtensions']>>,
    ParentType,
    ContextType,
    RequireFields<WysiwygElementExtensionsArgs, 'input'>
  >;
  hasVirtualKeyboard?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    Partial<WysiwygElementHasVirtualKeyboardArgs>
  >;
  label?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<WysiwygElementLabelArgs, 'input'>
  >;
  metadataKey?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType,
    RequireFields<WysiwygElementMetadataKeyArgs, 'input'>
  >;
  taggingConfiguration?: Resolver<
    Maybe<ResolversTypes['TaggingExtensionConfiguration']>,
    ParentType,
    ContextType
  >;
  virtualKeyboardLayouts?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    Partial<WysiwygElementVirtualKeyboardLayoutsArgs>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeaserMetadataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['teaserMetadata'] = ResolversParentTypes['teaserMetadata']
> = {
  contextMenuActions?: Resolver<
    Maybe<ResolversTypes['ContextMenuActions']>,
    ParentType,
    ContextType
  >;
  link?: Resolver<Maybe<ResolversTypes['PanelLink']>, ParentType, ContextType>;
  metaData?: Resolver<
    Maybe<ResolversTypes['PanelMetaData']>,
    ParentType,
    ContextType
  >;
  relationMetaData?: Resolver<
    Maybe<ResolversTypes['PanelRelationMetaData']>,
    ParentType,
    ContextType
  >;
  relationRootData?: Resolver<
    Maybe<ResolversTypes['PanelRelationRootData']>,
    ParentType,
    ContextType
  >;
  thumbnail?: Resolver<
    Maybe<ResolversTypes['PanelThumbnail']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPermissionsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['userPermissions'] = ResolversParentTypes['userPermissions']
> = {
  payload?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActionContext?: ActionContextResolvers<ContextType>;
  ActionElement?: ActionElementResolvers<ContextType>;
  ActionProgress?: ActionProgressResolvers<ContextType>;
  ActionProgressStep?: ActionProgressStepResolvers<ContextType>;
  AdvancedFilter?: AdvancedFilterResolvers<ContextType>;
  AdvancedFilterInputType?: AdvancedFilterInputTypeResolvers<ContextType>;
  AdvancedFilters?: AdvancedFiltersResolvers<ContextType>;
  AllowedViewModes?: AllowedViewModesResolvers<ContextType>;
  Area?: AreaResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  BaseEntity?: BaseEntityResolvers<ContextType>;
  BibliographicalReference?: BibliographicalReferenceResolvers<ContextType>;
  BreadCrumbRoute?: BreadCrumbRouteResolvers<ContextType>;
  BulkOperationCsvExportKeys?: BulkOperationCsvExportKeysResolvers<ContextType>;
  BulkOperationModal?: BulkOperationModalResolvers<ContextType>;
  BulkOperationOptions?: BulkOperationOptionsResolvers<ContextType>;
  BulkOperations?: BulkOperationsResolvers<ContextType>;
  CharacterReplacementSettings?: CharacterReplacementSettingsResolvers<ContextType>;
  Column?: ColumnResolvers<ContextType>;
  ColumnList?: ColumnListResolvers<ContextType>;
  CompositeSite?: CompositeSiteResolvers<ContextType>;
  Conditional?: ConditionalResolvers<ContextType>;
  ConfigItem?: ConfigItemResolvers<ContextType>;
  ContextMenuActions?: ContextMenuActionsResolvers<ContextType>;
  ContextMenuElodyAction?: ContextMenuElodyActionResolvers<ContextType>;
  ContextMenuGeneralAction?: ContextMenuGeneralActionResolvers<ContextType>;
  ContextMenuLinkAction?: ContextMenuLinkActionResolvers<ContextType>;
  Creator?: CreatorResolvers<ContextType>;
  DeleteQueryOptions?: DeleteQueryOptionsResolvers<ContextType>;
  Directory?: DirectoryResolvers<ContextType>;
  DropdownOption?: DropdownOptionResolvers<ContextType>;
  DropzoneEntityToCreate?: DropzoneEntityToCreateResolvers<ContextType>;
  EditMetadataButton?: EditMetadataButtonResolvers<ContextType>;
  EndpointInformation?: EndpointInformationResolvers<ContextType>;
  EntitiesResults?: EntitiesResultsResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  EntityListElement?: EntityListElementResolvers<ContextType>;
  EntityViewElements?: EntityViewElementsResolvers<ContextType>;
  EntityViewerElement?: EntityViewerElementResolvers<ContextType>;
  EpiDocTag?: EpiDocTagResolvers<ContextType>;
  ExpandButtonOptions?: ExpandButtonOptionsResolvers<ContextType>;
  ExternalSigla?: ExternalSiglaResolvers<ContextType>;
  FacetInputType?: FacetInputTypeResolvers<ContextType>;
  FetchDeepRelations?: FetchDeepRelationsResolvers<ContextType>;
  FileProgress?: FileProgressResolvers<ContextType>;
  FileProgressStep?: FileProgressStepResolvers<ContextType>;
  FilterMatcherMap?: FilterMatcherMapResolvers<ContextType>;
  FilterOptionsMappingType?: FilterOptionsMappingTypeResolvers<ContextType>;
  Form?: FormResolvers<ContextType>;
  FormAction?: FormActionResolvers<ContextType>;
  FormFields?: FormFieldsResolvers<ContextType>;
  FormTab?: FormTabResolvers<ContextType>;
  Formatters?: FormattersResolvers<ContextType>;
  GeoJsonFeature?: GeoJsonFeatureResolvers<ContextType>;
  GraphDataset?: GraphDatasetResolvers<ContextType>;
  GraphDatasetFilter?: GraphDatasetFilterResolvers<ContextType>;
  GraphElement?: GraphElementResolvers<ContextType>;
  HiddenField?: HiddenFieldResolvers<ContextType>;
  HierarchyListElement?: HierarchyListElementResolvers<ContextType>;
  HierarchyRelationList?: HierarchyRelationListResolvers<ContextType>;
  ImportReturn?: ImportReturnResolvers<ContextType>;
  InputField?: InputFieldResolvers<ContextType>;
  Inscription?: InscriptionResolvers<ContextType>;
  IntialValues?: IntialValuesResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Job?: JobResolvers<ContextType>;
  JobsResults?: JobsResultsResolvers<ContextType>;
  KeyAndValue?: KeyAndValueResolvers<ContextType>;
  KeyValue?: KeyValueResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  LinkFormatter?: LinkFormatterResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  LookupInputType?: LookupInputTypeResolvers<ContextType>;
  ManifestViewerElement?: ManifestViewerElementResolvers<ContextType>;
  MapElement?: MapElementResolvers<ContextType>;
  MapMetadata?: MapMetadataResolvers<ContextType>;
  MarkdownViewerElement?: MarkdownViewerElementResolvers<ContextType>;
  MatchMetadataValue?: MatchMetadataValueResolvers<ContextType>;
  Media?: MediaResolvers<ContextType>;
  MediaFile?: MediaFileResolvers<ContextType>;
  MediaFileElement?: MediaFileElementResolvers<ContextType>;
  MediaFileEntity?: MediaFileEntityResolvers<ContextType>;
  MediaFileMetadata?: MediaFileMetadataResolvers<ContextType>;
  MediaFilePostReturn?: MediaFilePostReturnResolvers<ContextType>;
  Menu?: MenuResolvers<ContextType>;
  MenuItem?: MenuItemResolvers<ContextType>;
  MenuTypeLink?: MenuTypeLinkResolvers<ContextType>;
  MenuTypeLinkModal?: MenuTypeLinkModalResolvers<ContextType>;
  MenuTypeLinkRoute?: MenuTypeLinkRouteResolvers<ContextType>;
  MenuWrapper?: MenuWrapperResolvers<ContextType>;
  Metadata?: MetadataResolvers<ContextType>;
  MetadataAndRelation?: MetadataAndRelationResolvers<ContextType>;
  MetadataField?: MetadataFieldResolvers<ContextType>;
  MetadataFieldOption?: MetadataFieldOptionResolvers<ContextType>;
  MetadataRelation?: MetadataRelationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationLimitOptions?: PaginationLimitOptionsResolvers<ContextType>;
  PanelInfo?: PanelInfoResolvers<ContextType>;
  PanelLink?: PanelLinkResolvers<ContextType>;
  PanelMetaData?: PanelMetaDataResolvers<ContextType>;
  PanelMetadataValueTooltip?: PanelMetadataValueTooltipResolvers<ContextType>;
  PanelRelation?: PanelRelationResolvers<ContextType>;
  PanelRelationMetaData?: PanelRelationMetaDataResolvers<ContextType>;
  PanelRelationRootData?: PanelRelationRootDataResolvers<ContextType>;
  PanelThumbnail?: PanelThumbnailResolvers<ContextType>;
  PermissionMapping?: PermissionMappingResolvers<ContextType>;
  PermissionRequestInfo?: PermissionRequestInfoResolvers<ContextType>;
  PermissionResult?: PermissionResultResolvers<ContextType>;
  PillFormatter?: PillFormatterResolvers<ContextType>;
  Point?: PointResolvers<ContextType>;
  PreviewComponent?: PreviewComponentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegexpMatchFormatter?: RegexpMatchFormatterResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  RelationField?: RelationFieldResolvers<ContextType>;
  RequiredOneOfMetadataValidation?: RequiredOneOfMetadataValidationResolvers<ContextType>;
  RequiredOneOfRelationValidation?: RequiredOneOfRelationValidationResolvers<ContextType>;
  RequiredRelationValidation?: RequiredRelationValidationResolvers<ContextType>;
  RouteMatching?: RouteMatchingResolvers<ContextType>;
  SavedSearch?: SavedSearchResolvers<ContextType>;
  Script?: ScriptResolvers<ContextType>;
  ShareLink?: ShareLinkResolvers<ContextType>;
  SingleMediaFileElement?: SingleMediaFileElementResolvers<ContextType>;
  Site?: SiteResolvers<ContextType>;
  SiteFunction?: SiteFunctionResolvers<ContextType>;
  SiteType?: SiteTypeResolvers<ContextType>;
  SortOptions?: SortOptionsResolvers<ContextType>;
  StringOrInt?: GraphQLScalarType;
  SubJobResults?: SubJobResultsResolvers<ContextType>;
  Support?: SupportResolvers<ContextType>;
  TagConfigurationByEntity?: TagConfigurationByEntityResolvers<ContextType>;
  TaggableEntityConfiguration?: TaggableEntityConfigurationResolvers<ContextType>;
  TaggingExtensionConfiguration?: TaggingExtensionConfigurationResolvers<ContextType>;
  Tenant?: TenantResolvers<ContextType>;
  Typology?: TypologyResolvers<ContextType>;
  UploadContainer?: UploadContainerResolvers<ContextType>;
  UploadField?: UploadFieldResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Validation?: ValidationResolvers<ContextType>;
  ViewModesWithConfig?: ViewModesWithConfigResolvers<ContextType>;
  WindowElement?: WindowElementResolvers<ContextType>;
  WindowElementBulkDataPanel?: WindowElementBulkDataPanelResolvers<ContextType>;
  WindowElementPanel?: WindowElementPanelResolvers<ContextType>;
  Word?: WordResolvers<ContextType>;
  WritingTechnique?: WritingTechniqueResolvers<ContextType>;
  WysiwygElement?: WysiwygElementResolvers<ContextType>;
  teaserMetadata?: TeaserMetadataResolvers<ContextType>;
  userPermissions?: UserPermissionsResolvers<ContextType>;
};
