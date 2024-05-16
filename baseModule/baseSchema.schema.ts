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

  enum MediaTypeEntities {
    asset
    mediafile
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
    mp3
    mp4
    tiff
  }

  enum TranscodeType {
    pdf
  }

  enum ValidationRules {
    required
    has_required_relation
  }

  enum ValidationFields {
    intialValues
    relationValues
    relations
    relationMetadata
  }

  type FormFields {
    metaData: PanelMetaData!
    uploadContainer: UploadContainer
    action: FormAction
  }

  type Form {
    label(input: String): String!
    formFields: FormFields!
  }

  enum ActionType {
    upload
    update
    submit
    download
  }

  enum ActionProgressIndicatorType {
    spinner
    progressSteps
  }

  enum ProgressStepStatus {
    complete
    loading
    empty
    failed
  }

  enum ProgressStepType {
    validate
    prepare
    upload
  }

  type ActionProgressStep {
    label(input: String!): String!
    stepType(input: ProgressStepType!): ProgressStepType!
    status: ProgressStepStatus!
  }

  type FileProgressStep {
    label: String!
    stepType: ProgressStepType!
    status: ProgressStepStatus!
  }

  type ActionProgress {
    type(input: ActionProgressIndicatorType!): ActionProgressIndicatorType!
    step: ActionProgressStep
  }

  type FileProgress {
    type: ActionProgressIndicatorType!
    steps: [FileProgressStep]
  }

  type FormAction {
    label(input: String!): String!
    icon(input: DamsIcons): DamsIcons
    actionType(input: ActionType): ActionType
    actionQuery(input: String): String
    creationType(input: Entitytyping): Entitytyping!
    showsFormErrors(input: Boolean): Boolean
    actionProgressIndicator: ActionProgress
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

  type RequiredRelationValidation {
    relationType: String!
    amount: Int!
  }

  input RequiredRelationValidationInput {
    relationType: String!
    amount: Int!
  }

  type Validation {
    value: String
    required_if: Conditional
    available_if: Conditional
    has_required_relation: RequiredRelationValidation
  }

  input ValidationInput {
    value: String
    required_if: ConditionalInput
    available_if: ConditionalInput
    has_required_relation: RequiredRelationValidationInput
  }

  type InputField {
    fieldName(input: String): String
    type: String!
    acceptedEntityTypes: [String]
    validation(input: ValidationInput): Validation
    options: [DropdownOption]
    relationType: String
    fromRelationType: String
    advancedFilterInputForSearchingOptions: AdvancedFilterInputType
    fileTypes: [FileType]
    maxFileSize: String
    maxAmountOfFiles: Int
    uploadMultiple: Boolean
    fileProgressSteps: FileProgress
    autoSelectable: Boolean
    disabled: Boolean
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
    EntityPicker
    DynamicForm
    Search
  }

  enum ModalChoices {
    Import
    Dropzone
  }

  input MenuTypeLinkInputModal {
    typeModal: TypeModals!
    formQuery: String
    askForCloseConfirmation: Boolean
    neededPermission: Permission
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
    formQuery: String
    askForCloseConfirmation: Boolean
    neededPermission: Permission
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
    ArchiveAlt
    BookOpen
    BrightnessPlus
    Create
    ExclamationTriangle
    Focus
    History
    Image
    InfoCircle
    Iot
    KeyholeSquare
    Police
    Settings
    Upload
    Update
    CloudBookmark
    Database
    Compass
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
    Ban
    BookOpen
    Check
    CheckCircle
    CheckSquare
    Circle
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
    Process
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
    Update
    Upload
    User
    UserCircle
    WindowGrid
    WindowMaximize
    Settings
    Iiif
  }

  input BulkOperationInputModal {
    typeModal: TypeModals!
    formQuery: String
    formRelationType: String!
    askForCloseConfirmation: Boolean
    neededPermission: Permission
  }
  type BulkOperationModal {
    typeModal: TypeModals!
    formQuery: String
    formRelationType: String!
    askForCloseConfirmation: Boolean
    neededPermission: Permission
  }

  scalar StringOrInt
  type DropdownOption {
    icon: DamsIcons
    label: String!
    value: StringOrInt!
    bulkOperationModal(input: BulkOperationInputModal): BulkOperationModal
  }

  input DropdownOptionInput {
    icon: DamsIcons
    label: String!
    value: StringOrInt!
    bulkOperationModal: BulkOperationInputModal
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

  input RelationFieldInput {
    key: String!
    label: String
    type: String!
    value: String
    editStatus: EditStatus!
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

  input SearchFilter {
    value: String
    isAsc: Boolean
    key: String
    order_by: String
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

  enum SortingDirection {
    asc
    desc
  }

  type SortOptions {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
    isAsc(input: SortingDirection!): SortingDirection
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
    relations: [RelationFieldInput]
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
      rootKeyAsLabel: String
      containsRelationProperty: String
      relationKey: String
    ): JSON!
    keyLabel(key: String!, source: KeyValueSource!): JSON
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

  enum BaseLibraryModes {
    normalBaseLibrary
    basicBaseLibraryWithBorder
    basicBaseLibrary
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
    customQueryFilters(input: String): String
    searchInputType(input: String): String
    baseLibraryMode(input: BaseLibraryModes): BaseLibraryModes
    entityListElement: EntityListElement
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

  enum UploadFlow {
    updateMetadata
    mediafilesOnly
    mediafilesWithRequiredCsv
    mediafilesWithOptionalCsv
  }

  enum UploadFieldSize {
    small
    normal
    big
  }

  enum UploadFieldType {
    batch
    single
  }

  type PanelInfo {
    label(input: String!): String!
    value(input: String!): String!
    inputField(type: BaseFieldType!): InputField!
  }

  type UploadContainer {
    uploadFlow(input: UploadFlow!): UploadFlow!
    uploadMetadata: PanelMetaData
    uploadField: UploadField!
  }

  type UploadField {
    label(input: String!): String!
    uploadFieldSize(input: UploadFieldSize): UploadFieldSize!
    uploadFieldType(input: UploadFieldType!): UploadFieldType!
    inputField(type: BaseFieldType!): InputField!
    dryRunUpload(input: Boolean): Boolean
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
    SetPrimaryThumbnail
  }

  enum ContextMenuElodyActionEnum {
    Delete
  }

  type ContextMenuGeneralAction {
    label(input: String): String!
    action(input: ContextMenuGeneralActionEnum): ContextMenuGeneralActionEnum!
    icon(input: String): String!
  }

  type ContextMenuElodyAction {
    label(input: String): String!
    action(input: ContextMenuElodyActionEnum): ContextMenuElodyActionEnum!
    icon(input: String): String!
  }

  type ContextMenuLinkAction {
    label(input: String): String!
    icon(input: String): String!
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
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
  }

  type BaseEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    media: Media
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
  }

  type MediaFileEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    media: Media
    teaserMetadata: teaserMetadata
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
  }

  type Tenant implements Entity {
    id: String!
    uuid: String!
    type: String!
    media: Media
    teaserMetadata: teaserMetadata
    title: [MetadataAndRelation]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
  }

  type User implements Entity {
    id: String!
    uuid: String!
    type: String!
    media: Media
    teaserMetadata: teaserMetadata
    title: [MetadataAndRelation]
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: RelationValues
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
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
    BulkOperationsRelationForm: WindowElement!
    GraphData(id: String!, graph: GraphElementInput!): JSON!
    PermissionMappingPerEntityType(type: String!): Boolean!
    PermissionMappingCreate(entityType: String!): Boolean!
    PermissionMappingEntityDetail(id: String!): [PermissionMapping!]!
    GetDynamicForm: Form!
    DownloadItemsInZip(
      entities: [String]!
      mediafiles: [String]!
      basicCsv: Boolean!
      includeAssetCsv: Boolean!
      downloadEntity: EntityInput!
    ): Entity
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
    setPrimaryMediafile(entityId: String!, mediafileId: String!): JSON
    setPrimaryThumbnail(entityId: String!, mediafileId: String!): JSON
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
