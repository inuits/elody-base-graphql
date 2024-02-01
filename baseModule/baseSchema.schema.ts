import { gql } from 'graphql-modules';

export const baseSchema = gql`
  scalar JSON
  # Generic
  enum RouteNames {
    Home
    SingleEntity
    NotFound
  }

  enum Collection {
    entities
    mediafiles
  }

  enum Entitytyping {
    BaseEntity
    tenant
    user
  }

  enum Unit {
    DATETIME_DEFAULT
    DATETIME_DMY12
    DATETIME_MDY12
    DATETIME_DMY24
    DATETIME_MDY24
    SECONDS_DEFAULT
    COORDINATES_DEFAULT
    LIST_DEFAULT
    HTML
  }

  enum Permission {
    cancreate
    canread
    canupdate
    candelete
  }
  enum Actions {
    ocr
    download
    noActions
  }

  enum InputFieldTypes {
    checkbox
    date
    number
    radio
    range
    text
    color
    dropdown
    textarea
    dropdownMultiselect
    dropdownSingleselect
    fileUpload
    csvUpload
  }

  enum BaseFieldType {
    baseCheckbox
    baseColorField
    baseTextField
    baseNumberField
    baseDateField
    baseDateTimeField
    baseTextareaField
    baseFileUploadField
    baseCsvUploadField
  }

  enum FileType {
    pdf
    alto
    txt
    csv
    png
    jpg
    jpeg
    svg
  }

  enum TranscodeType {
    pdf
  }

  type FormFields {
    metaData: PanelMetaData!
    uploadField: UploadField
  }

  type Form {
    formFields: FormFields!
  }

  type CreateEntityForm {
    formFields: Entity!
  }

  type Conditional {
    field: String!
    value: String
    ifAnyValue: Boolean!
  }

  input ConditionalInput {
    field: String!
    value: String
    ifAnyValue: Boolean
  }

  type Validation {
    value: String
    required_if: Conditional
    available_if: Conditional
  }

  input ValidationInput {
    value: String
    required_if: ConditionalInput
    available_if: ConditionalInput
  }

  input InputFieldInput {
    fieldName: String
    type: String!
    acceptedEntityTypes: [String]
    validation: ValidationInput
    options: [DropdownOptionInput]
    relationType: String
  }

  type InputField {
    fieldName(input: String): String
    type: String!
    acceptedEntityTypes: [String]
    validation(input: ValidationInput): Validation
    options: [DropdownOption]
    relationType(input: String!): String
    fileTypes: [FileType]
  }

  enum ModalState {
    Initial
    Show
    Hide
    Loading
  }

  enum TypeModals {
    BulkOperationsEdit
    BulkOperations
    Confirm
    Create
    EntityPicker
    OCR
    Upload
    Search
  }

  enum ModalChoices {
    Import
    Dropzone
  }

  input MenuTypeLinkInputModal {
    typeModal: TypeModals!
  }

  input MenuTypeLinkInputRoute {
    destination: String!
  }

  input MenuTypeLinkInput {
    modal: MenuTypeLinkInputModal
    route: MenuTypeLinkInputRoute
  }

  type MenuTypeLinkModal {
    typeModal: TypeModals!
  }

  type MenuTypeLinkRoute {
    destination: String!
  }

  type MenuTypeLink {
    modal: MenuTypeLinkModal
    route: MenuTypeLinkRoute
  }

  # Menu Types
  type MenuItem {
    label: String!
    entityType: Entitytyping
    subMenu(name: String!): Menu
    icon: MenuIcons
    isLoggedIn: Boolean
    typeLink: MenuTypeLink
    requiresAuth: Boolean
  }

  enum MenuIcons {
    BookOpen
    Create
    Focus
    Image
    Upload
    History
    Iot
    Police
    Settings
    KeyholeSquare
    InfoCircle
  }

  type Menu {
    name: String!
    menuItem(
      label: String!
      entityType: Entitytyping
      icon: MenuIcons
      isLoggedIn: Boolean
      typeLink: MenuTypeLinkInput
      requiresAuth: Boolean
    ): MenuItem
  }

  type MenuWrapper {
    menu: Menu!
  }

  # DropdownOption
  enum DamsIcons {
    NoIcon
    AngleDoubleLeft
    AngleDoubleRight
    AngleDown
    AngleLeft
    AngleRight
    AngleUp
    Apps
    ArrowCircleLeft
    ArrowCircleRight
    AudioThumbnail
    BookOpen
    Check
    CheckCircle
    CheckSquare
    Close
    Create
    Cross
    CrossCircle
    Desktop
    DocumentInfo
    Download
    DownloadAlt
    Edit
    EditAlt
    EllipsisV
    EllipsisH
    ExclamationTriangle
    Export
    Eye
    FileAlt
    Filter
    Focus
    History
    Image
    InfoCircle
    KeyholeSquare
    Link
    ListUl
    Minus
    Music
    NoImage
    Plus
    PlusCircle
    QuestionCircle
    Redo
    Save
    SearchGlass
    SearchMinus
    SearchPlus
    SignOut
    SortDown
    SortUp
    SquareFull
    Text
    Trash
    Upload
    User
    UserCircle
    WindowGrid
    WindowMaximize
    Settings
    Iiif
  }

  scalar StringOrInt
  type DropdownOption {
    icon: DamsIcons
    label: String!
    value: StringOrInt!
  }

  input DropdownOptionInput {
    icon: DamsIcons
    label: String!
    value: StringOrInt!
  }

  type DropzoneEntityToCreate {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  enum BulkOperationTypes {
    downloadMediafiles
    exportCsv
    edit
    transcodePDF
  }

  type BulkOperations {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type BulkOperationCsvExportKeys {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  input MetadataFieldInput {
    key: String!
    value: String
  }

  input MinMaxInput {
    min: Int
    max: Int
    isRelation: Boolean
  }

  input TextInput {
    value: String
  }

  input MultiSelectInput {
    value: [String]
    AndOrValue: Boolean
  }

  enum SearchInputType {
    AdvancedInputMediaFilesType
    AdvancedInputType
    SimpleInputtype
  }

  enum AdvancedInputType {
    MinMaxInput
    TextInput
    SelectionInput
  }

  input MetadataInput {
    key: String!
    value: JSON
    lang: String
    type: String
    label: String
    immutable: Boolean
  }

  input relationInput {
    relationType: String!
    metadata: [MetadataFieldInput]
    linkedEntityId: String
    label: String
    value: String
  }

  input MetadataFormInput {
    Metadata: [MetadataFieldInput]
    relations: [relationInput]
  }

  input FilterInput {
    key: String!
    type: AdvancedInputType!
    minMaxInput: MinMaxInput
    textInput: TextInput
    multiSelectInput: MultiSelectInput
  }

  type User {
    id: String!
    email: String!
    family_name: String!
    given_name: String!
    name: String!
    preferred_username: String!
  }

  type userPermissions {
    payload: [String]
  }

  type Media {
    primaryMediafile: String
    primary_transcode: String
    primaryMediafileLocation: String
    primaryThumbnailLocation: String
    mediafiles: [MediaFile]
  }

  enum RelationType {
    frames
    stories
  }

  type KeyAndValue {
    key: String!
    value: String!
  }

  type Metadata {
    key: String!
    value: JSON!
    unit(input: Unit): Unit
    lang: String
    label: String!
    immutable: Boolean
  }

  type MetadataRelation {
    key: String!
    value: JSON!
    label: String!
    type: String
    metadataOnRelation: [KeyAndValue]
    linkedEntity: Entity
  }

  type PaginationLimitOptions {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type SortOptions {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type BulkOperationOptions {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type MetadataFieldOption {
    label: String
    value: String!
  }

  input MetadataFieldOptionInput {
    label: String
    value: String!
  }

  type MetadataField {
    label: String
    key: String!
    type: InputFieldTypes!
    order: Int
    active: Boolean
    options: [MetadataFieldOption]
    config_key: String
  }

  enum RelationFieldViewMode {
    small
    big
  }

  type RelationField {
    key: String!
    label: String
    relationType: String!
    metadata: [MetadataField]
    acceptedEntityTypes: [String]!
    disabled: Boolean
    viewMode: RelationFieldViewMode
  }

  union MetadataAndRelation = Metadata | MetadataRelation

  union MetadataOrRelationField = MetadataField | RelationField

  # EntityTypes
  input EntityInput {
    title: String
    id: String
    type: String
    metadata: [MetadataFieldInput]
    identifiers: [String]
  }

  type KeyValue {
    keyValue(key: String!): JSON!
  }

  enum KeyValueSource {
    root
    metadata
    relations
    relationMetadata
  }

  type IntialValues {
    id: String!
    keyValue(
      key: String!
      source: KeyValueSource!
      uuid: String
      metadataKeyAsLabel: String
    ): JSON!
    relationMetadata(type: String!): IntialValues
  }

  type AllowedViewModes {
    viewModes(input: [ViewModes]): [ViewModes]
  }

  type RelationValues {
    label(input: String): String!
    relations: [IntialValues!]!
  }

  enum EditStatus {
    new
    changed
    deleted
    unchanged
  }

  input BaseRelationValuesInput {
    key: String!
    label: String
    type: String!
    value: String
    editStatus: EditStatus!
    teaserMetadata: [MetadataInput]
    metadata: [MetadataInput]
  }

  input MetadataValuesInput {
    key: String!
    value: JSON!
  }

  input EntityFormInput {
    metadata: [MetadataValuesInput!]!
    relations: [BaseRelationValuesInput!]!
  }

  enum MediaFileElementTypes {
    map
    media
  }

  enum Orientations {
    top
    right
    bottom
    left
  }

  type ExpandButtonOptions {
    shown(input: Boolean!): Boolean!
    orientation(input: Orientations): Orientations
  }

  enum ColumnSizes {
    ten
    twenty
    thirty
    forty
    fifty
    sixty
    seventy
    eighty
    ninety
  }

  type EntityListElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String
    type(input: MediaFileElementTypes): String
    entityTypes(input: [Entitytyping]): [Entitytyping]
    entityList(metaKey: String): [Entity]
    relationType(input: String): String
    viewMode(input: EntityListViewMode): EntityListViewMode
    customQuery(input: String): String
    customQueryRelationType(input: String): String
    searchInputType(input: String): String
  }

  enum EntityListViewMode {
    Dropdown
    Library
  }

  type MediaFileElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String!
    type(input: MediaFileElementTypes): String!
    metaData: PanelMetaData!
  }

  type SingleMediaFileElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String!
    type(input: MediaFileElementTypes): String!
    metaData: PanelMetaData!
  }

  enum GraphType {
    bar
    bubble
    doughnut
    line
    pie
    polarArea
    radar
    scatter
  }

  enum TimeUnit {
    month
    hour
    dayOfYear
    dayOfWeek
  }

  input GraphDatasetFilterInput {
    key: String
    values: [String!]
  }

  input GraphDatasetInput {
    labels: [String!]!
    filter: GraphDatasetFilterInput
  }

  type GraphDatasetFilter {
    key: String
    values: [String!]
  }

  type GraphDataset {
    labels: [String!]!
    filter: GraphDatasetFilter
  }

  type GraphElement {
    label(input: String): String!
    isCollapsed(input: Boolean!): Boolean!
    type(input: GraphType!): GraphType!
    datasource(input: String!): String!
    dataset(input: GraphDatasetInput!): GraphDataset!
    timeUnit(input: TimeUnit!): TimeUnit!
    datapoints(input: Int!): Int!
    convert_to(input: String!): String
  }

  input GraphElementInput {
    datasource: String!
    dataset: GraphDatasetInput!
    timeUnit: TimeUnit!
    datapoints: Int!
    convert_to: String
  }

  enum PanelType {
    metadata
    relation
    mediainfo
  }

  type PanelInfo {
    label(input: String!): String!
    value(input: String!): String!
    inputField(type: BaseFieldType!): InputField!
  }

  type UploadField {
    label(input: String!): String!
    inputField(type: BaseFieldType!): InputField!
  }

  type PanelMetaData {
    label(input: String!): String!
    key(input: String!): String!
    unit(input: Unit!): Unit!
    linkText(input: String!): String
    inputField(type: BaseFieldType!): InputField!
  }

  type PanelRelationMetaData {
    label(input: String!): String!
    key(input: String!): String!
    unit(input: Unit!): Unit!
    linkText(input: String!): String
    inputField(type: BaseFieldType!): InputField!
    showOnlyInEditMode(input: Boolean): Boolean
  }

  type PanelThumbnail {
    key(input: String!): String
    customUrl(input: String!): String
    filename(input: String, fromMediafile: Boolean): String
    width(input: Int!): Int
    height(input: Int!): Int
  }

  type PanelLink {
    label(input: String!): String!
    key(input: String!): String!
    linkText(input: String!): String
    linkIcon(input: DamsIcons!): DamsIcons
  }

  type PanelRelation {
    value: String
    label: String
  }

  type WindowElementPanel {
    label(input: String!): String!
    panelType(input: PanelType!): PanelType!
    isEditable(input: Boolean!): Boolean!
    isCollapsed(input: Boolean!): Boolean!
    info: PanelInfo!
    metaData: PanelMetaData!
    relation: [PanelRelation]
    entityListElement: EntityListElement
  }

  type WindowElement {
    label(input: String): String!
    panels: WindowElementPanel!
    expandButtonOptions: ExpandButtonOptions
  }

  type ActionElement {
    label(input: String): String!
    actions(input: [Actions]): [Actions]
  }

  type ManifestViewerElement {
    label(input: String): String!
    isCollapsed(input: Boolean!): Boolean!
    manifestUrl(metadataKey: String!): String!
    manifestVersion(metadataKey: String!): Int!
  }

  type MarkdownViewerElement {
    label(input: String): String!
    isCollapsed(input: Boolean!): Boolean!
    markdownContent(metadataKey: String!): String!
  }

  type ColumnList {
    column: Column!
  }

  type EntityViewElements {
    markdownViewerElement: MarkdownViewerElement
    manifestViewerElement: ManifestViewerElement
    entityListElement: EntityListElement
    mediaFileElement: MediaFileElement
    singleMediaFileElement: SingleMediaFileElement
    graphElement: GraphElement
    windowElement: WindowElement
    actionElement: ActionElement
  }

  type Column {
    size(size: ColumnSizes): ColumnSizes!
    elements: EntityViewElements!
  }

  input teaserMetadataOptions {
    key: String
    unit: Unit
  }

  enum ContextMenuGeneralActionEnum {
    SetPrimaryMediafile
  }
  
  enum ContextMenuElodyActionEnum {
    Delete
  }

  type ContextMenuGeneralAction {
    label(input: String): String!
    action(input: ContextMenuGeneralActionEnum): ContextMenuGeneralActionEnum!
  }
  
  type ContextMenuElodyAction {
    label(input: String): String!
    action(input: ContextMenuElodyActionEnum): ContextMenuElodyActionEnum!
  }
  
  type ContextMenuLinkAction {
    label(input: String): String!
    action(input: RouteNames): RouteNames!
  }
  
  type ContextMenuActions {
    doLinkAction: ContextMenuLinkAction
    doGeneralAction: ContextMenuGeneralAction
    doElodyAction: ContextMenuElodyAction
  }

  type teaserMetadata {
    metaData: PanelMetaData
    relationMetaData: PanelRelationMetaData
    thumbnail: PanelThumbnail
    link: PanelLink
    contextMenuActions: ContextMenuActions
  }

  interface Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    permission: [Permission]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    createFormFields: FormFields
    bulkOperationOptions: BulkOperationOptions
  }

  type BaseEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    media: Media
    permission: [Permission]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    createFormFields: FormFields
    bulkOperationOptions: BulkOperationOptions
  }

  type MediaFileEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    media: Media
    teaserMetadata: teaserMetadata
    permission: [Permission]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    createFormFields: FormFields
    bulkOperationOptions: BulkOperationOptions
  }

  type Tenant implements Entity {
    id: String!
    uuid: String!
    type: String!
    media: Media
    teaserMetadata: teaserMetadata
    title: [MetadataAndRelation]
    permission: [Permission]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    createFormFields: FormFields
    bulkOperationOptions: BulkOperationOptions
  }

  type User implements Entity {
    id: String!
    uuid: String!
    type: String!
    media: Media
    teaserMetadata: teaserMetadata
    title: [MetadataAndRelation]
    permission: [Permission]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    createFormFields: FormFields
    bulkOperationOptions: BulkOperationOptions
  }

  type EntitiesResults {
    results: [Entity]
    sortKeys(sortItems: [String]): [String]
    count: Int
    limit: Int
  }

  type Query {
    Entity(id: String!, type: String!, preferredLanguage: String): Entity
    Entities(
      type: Entitytyping!
      limit: Int
      skip: Int
      searchInputType: SearchInputType
      searchValue: SearchFilter!
      advancedSearchValue: [FilterInput]
      advancedFilterInputs: [AdvancedFilterInput!]!
      fetchPolicy: String
    ): EntitiesResults
    Tenants: EntitiesResults
    User: User
    UserPermissions: userPermissions
    Menu(name: String!): MenuWrapper
    EntityTypeSortOptions(entityType: String!): Entity!
    DropzoneEntityToCreate: DropzoneEntityToCreate!
    PaginationLimitOptions: PaginationLimitOptions!
    BulkOperations(entityType: String!): Entity!
    BulkOperationCsvExportKeys: BulkOperationCsvExportKeys!
    CreateEntityForm(type: Entitytyping!): CreateEntityForm!
    BulkOperationsRelationForm: WindowElement!
    GraphData(id: String!, graph: GraphElementInput!): JSON!
    PermissionMappingPerEntityType(type: String!): Boolean!
    PermissionMappingCreate(entityType: String!): Boolean!
    PermissionMappingEntityDetail(id: String!): [PermissionMapping!]!
  }

  type Mutation {
    mutateEntityValues(
      id: String!
      formInput: EntityFormInput!
      collection: Collection!
    ): Entity
    deleteData(
      id: String!
      path: Collection!
      deleteMediafiles: Boolean!
    ): String
    linkMediafileToEntity(
      entityId: String!
      mediaFileInput: MediaFileInput!
    ): MediaFile
    bulkAddRelations(
      entityIds: [String!]!
      relationEntityId: String!
      relationType: String!
    ): String
    generateTranscode(
      mediafileIds: [String!]!
      transcodeType: TranscodeType!
      masterEntityId: String
    ): String
  }

  enum ViewModes {
    ViewModesList
    ViewModesGrid
    ViewModesMedia
  }

  type PermissionMapping {
    permission: Permission!
    hasPermission: Boolean!
  }
`;
