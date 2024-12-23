import { gql } from 'graphql-modules';

export const baseSchema = gql`
  scalar JSON
  # Generic
  enum RouteNames {
    Home
    SingleEntity
    NotFound
    Unauthorized
    AccessDenied
    Jobs
  }

  enum Collection {
    entities
    mediafiles
    jobs
  }

  enum Entitytyping {
    BaseEntity
    tenant
    user
    job
    shareLink
  }

  enum ElodyServices {
    pwa
    apolloGraphql
  }

  enum MediaTypeEntities {
    asset
    mediafile
  }

  enum VisibilityLevels {
    public
    not_public
    private
  }

  enum ErrorCodeType {
    read
    write
  }

  enum Unit {
    COORDINATES_DEFAULT
    DATETIME_DEFAULT
    DATETIME_DMY12
    DATETIME_DMY24
    DATETIME_MDY12
    DATETIME_MDY24
    HTML
    LIST_DEFAULT
    PERCENT
    SECONDS_DEFAULT
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
    dropdownMultiselectRelations
    dropdownMultiselectMetadata
    dropdownSingleselectRelations
    dropdownSingleselectMetadata
    fileUpload
    csvUpload
    baseFileSystemImportField
    baseEntityPickerField
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
    baseFileSystemImportField
    baseEntityPickerField
    csvEntityTypeTypeField
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
    tif
    gif
  }

  enum TranscodeType {
    pdf
  }

  enum OcrType {
    pdf
    txt
    alto
    manualUpload
  }

  type Form {
    label(input: String): String!
    infoLabel(input: String): String
    modalStyle(input: ModalStyle!): ModalStyle!
    formTab: FormTab!
  }

  type FormTab {
    formFields: FormFields!
  }

  enum ValidationRules {
    alpha_dash
    alpha_num
    alpha_spaces
    customValue
    has_one_of_required_relations
    has_required_relation
    required
    has_one_of_required_metadata
    max_date_today
    existing_date
    regex
    email
  }

  enum ValidationFields {
    intialValues
    relationValues
    relations
    relationMetadata
    relatedEntityData
  }

  type FormFields {
    metaData: PanelMetaData!
    uploadContainer: UploadContainer
    action: FormAction
  }

  enum ActionType {
    submit
    upload
    download
    ocr
    endpoint
    uploadCsvForReordening
    updateMetadata
    submitWithExtraMetadata
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

  enum EntityPickerMode {
    save
    emit
  }

  enum ElodyViewers {
    iiif
    video
    audio
    pdf
    text
  }

  enum ContextMenuDirection {
    left
    right
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

  enum EndpointResponseActions {
    downloadResponse
    notification
  }

  input EndpointInformationInput {
    method: String
    endpointName: String
    variables: [String]
    responseAction: EndpointResponseActions
  }
  type EndpointInformation {
    method: String
    endpointName: String
    variables: [String]
    responseAction: EndpointResponseActions
  }

  type FormAction {
    label(input: String!): String!
    icon(input: DamsIcons): DamsIcons
    actionType(input: ActionType): ActionType
    actionQuery(input: String): String
    endpointInformation(input: EndpointInformationInput!): EndpointInformation!
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

  type RequiredOneOfRelationValidation {
    relationTypes: [String!]!
    amount: Int!
  }
  input RequiredOneOfRelationValidationInput {
    relationTypes: [String!]!
    amount: Int!
  }

  type RequiredOneOfMetadataValidation {
    includedMetadataFields: [String!]!
    amount: Int!
  }
  input RequiredOneOfMetadataValidationInput {
    includedMetadataFields: [String!]!
    amount: Int!
  }

  type Validation {
    value: [ValidationRules]
    customValue: String
    fastValidationMessage: String
    required_if: Conditional
    available_if: Conditional
    has_required_relation: RequiredRelationValidation
    has_one_of_required_relations: RequiredOneOfRelationValidation
    has_one_of_required_metadata: RequiredOneOfMetadataValidation
    regex: String
  }

  input ValidationInput {
    value: [ValidationRules]
    customValue: String
    fastValidationMessage: String
    required_if: ConditionalInput
    available_if: ConditionalInput
    has_required_relation: RequiredRelationValidationInput
    has_one_of_required_relations: RequiredOneOfRelationValidationInput
    has_one_of_required_metadata: RequiredOneOfMetadataValidationInput
    regex: String
  }

  type InputField {
    fieldName(input: String): String
    type: String!
    validation(input: ValidationInput): Validation
    options: [DropdownOption]
    relationType: String
    fromRelationType: String
    canCreateEntityFromOption: Boolean
    metadataKeyToCreateEntityFromOption: String
    advancedFilterInputForRetrievingOptions: [AdvancedFilterInputType!]
    advancedFilterInputForRetrievingRelatedOptions: [AdvancedFilterInputType!]
    advancedFilterInputForRetrievingAllOptions: [AdvancedFilterInputType!]
    advancedFilterInputForSearchingOptions: AdvancedFilterInputType
    fileTypes: [FileType]
    maxFileSize: String
    maxAmountOfFiles: Int
    uploadMultiple: Boolean
    fileProgressSteps: FileProgress
    autoSelectable: Boolean
    disabled: Boolean
    fieldKeyToSave(input: String): String
    isMetadataField(input: Boolean): Boolean
    dependsOn: String
    multiple: Boolean
  }

  enum TypeModals {
    BulkOperationsEdit
    BulkOperations
    BulkOperationsDeleteEntities
    Confirm
    Delete
    DynamicForm
    Search
    SaveSearch
    SaveSearchPicker
  }

  enum ModalStyle {
    left
    right
    center
    centerWide
    rightWide
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
    can: [String!]
  }

  enum MenuIcons {
    Anpr
    ArchiveAlt
    BookOpen
    BrightnessPlus
    CloudBookmark
    Compass
    Create
    Database
    Download
    ExclamationTriangle
    Focus
    FocusTarget
    Globe
    Hdd
    History
    Image
    InfoCircle
    Iot
    KeyholeSquare
    LocationArrowAlt
    LocationPoint
    MapMarker
    MapMarkerInfo
    Police
    Process
    Settings
    Swatchbook
    Update
    Upload
    UserSquare
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
      can: [String!]
    ): MenuItem
  }

  type MenuWrapper {
    menu: Menu!
  }

  # DropdownOption
  enum DamsIcons {
    NoIcon
    FocusTarget
    AngleDoubleLeft
    AngleDoubleRight
    AngleDown
    AngleLeft
    AngleRight
    AngleUp
    Apps
    ArchiveAlt
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
    EllipsisH
    EllipsisV
    ExclamationTriangle
    Export
    Eye
    FileAlt
    FileExport
    Filter
    Focus
    Hdd
    History
    Iiif
    Image
    InfoCircle
    KeyholeSquare
    Link
    ListUl
    LocationArrowAlt
    Map
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
    Settings
    SignOut
    Sort
    SortDown
    SortUp
    SquareFull
    Swatchbook
    Text
    Trash
    Update
    Upload
    User
    UserCircle
    WindowGrid
    WindowMaximize
  }

  input BulkOperationInputModal {
    typeModal: TypeModals!
    formQuery: String
    formRelationType: String
    askForCloseConfirmation: Boolean
    neededPermission: Permission
  }
  type BulkOperationModal {
    typeModal: TypeModals!
    formQuery: String
    formRelationType: String
    askForCloseConfirmation: Boolean
    neededPermission: Permission
  }

  enum ActionContextEntitiesSelectionType {
    noneSelected
    someSelected
  }

  enum ActionContextViewModeTypes {
    readMode
    editMode
  }

  type MatchMetadataValue {
    matchKey: String
    matchValue: String
  }

  input MatchMetadataValueInput {
    matchKey: String
    matchValue: String
  }

  type ActionContext {
    entitiesSelectionType: ActionContextEntitiesSelectionType
    activeViewMode: [ActionContextViewModeTypes]
    matchMetadataValue: [MatchMetadataValue]
    labelForTooltip: String
  }
  input ActionContextInput {
    entitiesSelectionType: ActionContextEntitiesSelectionType
    activeViewMode: [ActionContextViewModeTypes]
    matchMetadataValue: [MatchMetadataValueInput]
    labelForTooltip: String
  }

  scalar StringOrInt
  type DropdownOption {
    icon: DamsIcons
    label: String!
    value: StringOrInt!
    availableInPages(input: [RouteMatchingInput]): [RouteMatching]
    active: Boolean
    required: Boolean
    actionContext(input: ActionContextInput): ActionContext
    bulkOperationModal(input: BulkOperationInputModal): BulkOperationModal
    primary: Boolean
    requiresAuth: Boolean
    can: [String!]
  }

  type RouteMatching {
    routeName: RouteNames
    entityType: Entitytyping
  }
  input RouteMatchingInput {
    routeName: RouteNames
    entityType: Entitytyping
  }

  input DropdownOptionInput {
    icon: DamsIcons
    label: String!
    value: StringOrInt!
    availableInPages: [RouteMatchingInput]
    active: Boolean
    actionContext: ActionContextInput
    bulkOperationModal: BulkOperationInputModal
    primary: Boolean
    requiresAuth: Boolean
    can: [String!]
  }

  type DropzoneEntityToCreate {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  enum BulkOperationTypes {
    createEntity
    downloadMediafiles
    reorderEntities
    exportCsv
    exportCsvOfMediafilesFromAsset
    edit
    startOcr
    addRelation
    deleteEntities
  }

  type BulkOperations {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type BulkOperationCsvExportKeys {
    options: [DropdownOption!]!
  }

  input MetadataFieldInput {
    key: String!
    value: JSON
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

  type PermissionRequestInfo {
    crud: String!
    uri: String!
    body: JSON!
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

  type DeleteQueryOptions {
    customQueryDeleteRelations(input: String): String
    customQueryDeleteRelationsFilters(input: String): String
    customQueryEntityTypes(input: [Entitytyping]): [Entitytyping]
    customQueryBlockingRelations(input: String): String
    customQueryBlockingRelationsFilters(input: String): String
    customQueryBlockingEntityTypes(input: [Entitytyping]): [Entitytyping]
  }

  enum MapTypes {
    heatMap
  }

  input SplitRegexInput {
    separator: String!
    retrieveSection: Int!
  }

  type SplitRegex {
    separator: String!
    retrieveSection: Int!
  }

  type MapMetadata {
    value(
      key: String!
      source: KeyValueSource!
      relationKey: String
      splitRegex: SplitRegexInput
    ): JSON!
  }
  type MapComponent {
    mapType(input: MapTypes!): MapTypes!
    center(input: [Float]!): [Float]!
    zoom(input: Int!): Int!
    blur(input: Int!): Int!
    radius(input: Int!): Int!
    mapMetadata: MapMetadata
  }

  enum DeepRelationsFetchStrategy {
    useExistingBreadcrumbsInfo
    useMethodsAndFetch
  }
  input BreadCrumbRouteInput {
    relation: String
    entityType: Entitytyping
    overviewPage: RouteNames
  }
  type BreadCrumbRoute {
    relation: String
    entityType: Entitytyping
    overviewPage: RouteNames
  }
  type FetchDeepRelations {
    deepRelationsFetchStrategy(
      input: DeepRelationsFetchStrategy
    ): DeepRelationsFetchStrategy
    entityType(input: Entitytyping): Entitytyping
    routeConfig(input: [BreadCrumbRouteInput]): [BreadCrumbRoute]
    amountOfRecursions(input: Int): Int
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
    technicalMetadata
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
      containsRelationPropertyKey: String
      containsRelationPropertyValue: String
      relationKey: String
      relationEntityType: String
      keyOnMetadata: String
      formatter: String
    ): JSON!
    keyLabel(key: String!, source: KeyValueSource!): JSON
    relationMetadata(type: String!): IntialValues
  }

  input ViewModesWithConfigInput {
    viewMode: ViewModes
    config: [ConfigItemInput]
  }
  input ConfigItemInput {
    key: String!
    value: JSON!
  }

  type ViewModesWithConfig {
    viewMode: ViewModes
    config: [ConfigItem]
  }
  type ConfigItem {
    key: String!
    value: JSON!
  }

  type AllowedViewModes {
    viewModes(input: [ViewModesWithConfigInput]): [ViewModesWithConfig]
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
    sort: JSON
    is_primary_thumbnail: Boolean
    is_primary: Boolean
    is_ocr: Boolean
    operation: String
    lang: String
    roles: [String]
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

  enum RelationActions {
    addRelation
    removeRelation
  }

  type EntityListElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String
    type(input: MediaFileElementTypes): String
    entityTypes(input: [Entitytyping]): [Entitytyping]
    entityList(metaKey: String): [Entity]
    relationType(input: String): String
    viewMode(input: EntityListViewMode): EntityListViewMode
    enableNavigation(input: Boolean): Boolean
    customQuery(input: String): String
    customQueryRelationType(input: String): String
    customQueryFilters(input: String): String
    customQueryEntityPickerList(input: String): String
    customQueryEntityPickerListFilters(input: String): String
    searchInputType(input: String): String
    baseLibraryMode(input: BaseLibraryModes): BaseLibraryModes
    entityListElement: EntityListElement
    allowedActionsOnRelations(input: [RelationActions]): [RelationActions]
    customBulkOperations(input: String): String
    fetchDeepRelations: FetchDeepRelations
    can(input: [String!]): [String!]
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
    bulkData
    metadata
    relation
    mediainfo
    map
  }

  enum UploadFlow {
    updateMetadata
    csvOnly
    mediafilesOnly
    mediafilesWithRequiredCsv
    mediafilesWithOptionalCsv
    uploadCsvForReordening
  }

  enum UploadFieldSize {
    small
    normal
    big
  }

  enum UploadFieldType {
    batch
    single
    reorderEntities
    editMetadataWithCsv
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
    templateCsvs(input: [String!]!): [String]
  }

  type HiddenField {
    hidden: Boolean!
    searchValueForFilter: String!
  }
  input HiddenFieldInput {
    hidden: Boolean!
    searchValueForFilter: String!
  }

  type PanelMetaData {
    label(input: String!): String!
    key(input: String!): String!
    hiddenField(input: HiddenFieldInput!): HiddenField
    unit(input: Unit!): Unit!
    linkText(input: String!): String
    inputField(type: BaseFieldType!): InputField!
    showOnlyInEditMode(input: Boolean): Boolean
    tooltip(input: String!): String!
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

  input EditMetadataButtonInput {
    hasButton: Boolean!
    readmodeLabel: String
    editmodeLabel: String
  }
  type EditMetadataButton {
    hasButton: Boolean!
    readmodeLabel: String
    editmodeLabel: String
  }

  type WindowElementPanel {
    label(input: String!): String!
    panelType(input: PanelType!): PanelType!
    isEditable(input: Boolean!): Boolean!
    isCollapsed(input: Boolean!): Boolean!
    canBeMultipleColumns(input: Boolean!): Boolean!
    bulkData(bulkDataSource: String!): JSON
    info: PanelInfo!
    metaData: PanelMetaData!
    relation: [PanelRelation]
    entityListElement: EntityListElement
  }

  type WindowElementBulkDataPanel {
    label(input: String!): String!
    intialValueKey(input: String!): String!
  }

  type WindowElement {
    label(input: String): String!
    panels: WindowElementPanel!
    expandButtonOptions: ExpandButtonOptions
    editMetadataButton(input: EditMetadataButtonInput!): EditMetadataButton
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

  type EntityViewerElement {
    label(input: String): String!
    entityId(relationType: String, metadataKey: String): String!
  }

  type ColumnList {
    column: Column!
  }

  type EntityViewElements {
    entityViewerElement: EntityViewerElement
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
    DeleteRelation
    DeleteEntity
    Share
  }

  type ContextMenuGeneralAction {
    label(input: String): String!
    action(input: ContextMenuGeneralActionEnum): ContextMenuGeneralActionEnum!
    icon(input: String): String!
    can(input: [String]): [String]
  }

  type ContextMenuElodyAction {
    label(input: String): String!
    action(input: ContextMenuElodyActionEnum): ContextMenuElodyActionEnum!
    icon(input: String): String!
    can(input: [String]): [String]
  }

  type ContextMenuLinkAction {
    label(input: String): String!
    icon(input: String): String!
    can(input: [String]): [String]
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
    relationValues: JSON
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
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: JSON
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
    deleteQueryOptions: DeleteQueryOptions
    mapComponent: MapComponent
  }

  type MediaFileEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: JSON
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
    deleteQueryOptions: DeleteQueryOptions
    mapComponent: MapComponent
  }

  type Tenant implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: JSON
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
    deleteQueryOptions: DeleteQueryOptions
    mapComponent: MapComponent
  }

  type User implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: JSON
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
    deleteQueryOptions: DeleteQueryOptions
    mapComponent: MapComponent
  }

  type Job implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: JSON
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
    deleteQueryOptions: DeleteQueryOptions
    mapComponent: MapComponent
  }

  type ShareLink implements Entity {
    id: String!
    uuid: String!
    type: String!
    teaserMetadata: teaserMetadata
    intialValues: IntialValues!
    allowedViewModes: AllowedViewModes
    relationValues: JSON
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
    sortOptions: SortOptions
    bulkOperationOptions: BulkOperationOptions
    deleteQueryOptions: DeleteQueryOptions
    mapComponent: MapComponent
  }

  type EntitiesResults {
    results: [Entity]
    sortKeys(sortItems: [String]): [String]
    count: Int
    limit: Int
  }

  input DeleteEntitiesInput {
    deleteMediafiles: Boolean
  }

  type Query {
    Entity(id: String!, type: String!, preferredLanguage: String): Entity
    Entities(
      type: Entitytyping
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
    CustomBulkOperations: Entity!
    BulkOperationCsvExportKeys(entityType: String!): BulkOperationCsvExportKeys!
    BulkOperationsRelationForm: WindowElement!
    GraphData(id: String!, graph: GraphElementInput!): JSON!
    PermissionMappingPerEntityType(type: String!): Boolean!
    PermissionMappingCreate(entityType: String!): Boolean!
    PermissionMapping(entities: [String]!): JSON!
    AdvancedPermission(
      permission: String!
      parentEntityId: String
      childEntityId: String
    ): JSON!
    CustomFormattersSettings: JSON!
    CustomTypeUrlMapping: JSON!
    PermissionMappingEntityDetail(
      id: String!
      entityType: String!
    ): [PermissionMapping!]!
    GetDynamicForm: Form!
    DownloadItemsInZip(
      entities: [String]!
      mediafiles: [String]!
      basicCsv: Boolean!
      includeAssetCsv: Boolean!
      downloadEntity: EntityInput!
    ): Entity
    GenerateOcrWithAsset(
      assetId: String!
      operation: [String!]!
      language: String!
    ): JSON
    FetchMediafilesOfEntity(entityIds: [String!]!): [MediaFileEntity]!
    GetEntityDetailContextMenuActions: ContextMenuActions!
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
    bulkDeleteEntities(
      ids: [String!]!
      path: Collection!
      deleteEntities: DeleteEntitiesInput
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
    updateMetadataWithCsv(entityType: String!, csv: String!): String
    setPrimaryMediafile(entityId: String!, mediafileId: String!): JSON
    setPrimaryThumbnail(entityId: String!, mediafileId: String!): JSON
  }

  enum ViewModes {
    ViewModesList
    ViewModesGrid
    ViewModesMedia
    ViewModesMap
  }

  type PermissionMapping {
    permission: Permission!
    hasPermission: Boolean!
  }

  enum CustomFormatterTypes {
    link
    pill
    regexpMatch
  }

  type LinkFormatter {
    link: String!
    label: String!
    value: String!
  }

  type PillFormatter {
    background: String!
    text: String!
  }

  type RegexpMatchFormatter {
    value: String!
  }

  union Formatters = LinkFormatter | PillFormatter | RegexpMatchFormatter
`;
