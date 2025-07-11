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
    history
  }

  enum Matchers {
    AnyMatcher
    NoneMatcher
    ExactMatcher
    ContainsMatcher
    MinIncludedMatcher
    MaxIncludedMatcher
    InBetweenMatcher
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
    DATE_DEFAULT
    DATETIME_DEFAULT
    DATETIME_DMY12
    DATETIME_DMY24
    DATETIME_MDY12
    DATETIME_MDY24
    HTML
    LIST_DEFAULT
    PERCENT
    SECONDS_DEFAULT
    VOLT
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
    resizableTextarea
    dropdownMultiselectRelations
    dropdownMultiselectMetadata
    dropdownSingleselectRelations
    dropdownSingleselectMetadata
    fileUpload
    csvUpload
    xmlUpload
    baseEntityPickerField
    baseFileSystemImportField
    baseMagazineWithMetsImportField
    baseMagazineWithCsvImportField
    baseMediafilesWithOcrImportField
  }

  enum BaseFieldType {
    baseCheckbox
    baseColorField
    baseTextField
    baseNumberField
    baseDateField
    baseDateTimeField
    baseTextareaField
    baseResizableTextareaField
    baseFileUploadField
    baseCsvUploadField
    baseEntityPickerField
    csvEntityTypeTypeField
    baseFileSystemImportField
    baseMagazineWithMetsImportField
    baseMagazineWithCsvImportField
    baseMediafilesWithOcrImportField
    baseXmlUploadField
  }

  enum FileType {
    pdf
    alto
    xml
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
    json
  }

  enum TranscodeType {
    pdf
  }

  enum SkeletonComponentType {
    Title
    Subtitle
    UploadInfoLink
    UploadCsvTemplates
    DropzoneInfo
    Dropdown
    RelationDropdown
    Input
    Textarea
    Checkbox
    ButtonWithProgress
    DropzoneSmall
    DropzoneMedium
    DropzoneBig
    Button
    DisabledButton
    Progress
    EntityPicker
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
    url
  }

  enum ValidationFields {
    intialValues
    relationValues
    relations
    relationMetadata
    relationRootdata
    relatedEntityData
  }

  type FormFields {
    metaData: PanelMetaData!
    uploadContainer: UploadContainer
    action: FormAction
  }

  enum ActionType {
    submit
    submitWithUpload
    upload
    uploadWithOcr
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
    incomplete
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
    exact: Boolean
  }
  input RequiredRelationValidationInput {
    relationType: String!
    amount: Int!
    exact: Boolean
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
    relationFilter: AdvancedFilterInputType
    dependsOn: String
    multiple: Boolean
    lineClamp: String
    entityType: String
  }

  enum TypeModals {
    BulkOperationsEdit
    BulkOperations
    BulkOperationsDeleteEntities
    BulkOperationsDeleteRelations
    Confirm
    Delete
    DynamicForm
    Search
    SearchAi
    SaveSearch
    SaveSearchPicker
    ElodyEntityTaggingModal
    EntityDetailModal
    IiifOperationsModal
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
    Car
    CloudBookmark
    Compass
    Create
    Database
    Download
    Draggabledots
    ExclamationTriangle
    FileInfoAlt
    Focus
    FocusTarget
    Font
    Globe
    Hdd
    History
    Image
    InfoCircle
    Iot
    KeyholeSquare
    ListUl
    LocationArrowAlt
    LocationPoint
    MapMarker
    MapMarkerInfo
    MapPin
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
    ImagePlus
    InfoCircle
    KeyholeSquare
    Link
    ListUl
    ListOl
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
    Tag
    Text
    Trash
    Update
    Upload
    User
    UserCircle
    WindowGrid
    WindowMaximize
    Folder
    VideoSlash
  }

  input BulkOperationInputModal {
    typeModal: TypeModals!
    formQuery: String
    formRelationType: String
    askForCloseConfirmation: Boolean
    neededPermission: Permission
    skipItemsWithRelationDuringBulkDelete: [String]
  }
  type BulkOperationModal {
    typeModal: TypeModals!
    formQuery: String
    formRelationType: String
    askForCloseConfirmation: Boolean
    neededPermission: Permission
    skipItemsWithRelationDuringBulkDelete: [String]
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
    deleteRelations
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
    datasource: String!
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
    options(
      input: [DropdownOptionInput!]!
      excludeBaseSortOptions: Boolean
    ): [DropdownOption!]!
    isAsc(input: SortingDirection!): SortingDirection
  }

  type BulkOperationOptions {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type DeleteQueryOptions {
    deleteEntityLabel(input: String!): String!
    customQueryDeleteRelations(input: String): String
    customQueryDeleteRelationsFilters(input: String): String
    customQueryEntityTypes(input: [Entitytyping]): [Entitytyping]
    deleteRelationsLabel(input: String): String
    customQueryBlockingRelations(input: String): String
    customQueryBlockingRelationsFilters(input: String): String
    customQueryBlockingEntityTypes(input: [Entitytyping]): [Entitytyping]
    blockingRelationsLabel(input: String): String
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
    relationRootdata
    metadataOrRelation
    derivatives
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
      technicalOrigin: String
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
    lang: String
  }

  input EntityFormInput {
    metadata: [MetadataValuesInput!]!
    relations: [BaseRelationValuesInput!]!
    updateOnlyRelations: Boolean
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
    hundred
  }

  enum BaseLibraryModes {
    normalBaseLibrary
    basicBaseLibraryWithBorder
    basicBaseLibrary
    previewBaseLibrary
  }

  enum RelationActions {
    addRelation
    removeRelation
  }

  enum EntitySubelement {
    intialValues
    relationValues
  }

  type EntityListElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String
    enableAdvancedFilters(input: Boolean): Boolean
    type(input: MediaFileElementTypes): String
    entityTypes(input: [Entitytyping]): [Entitytyping]
    entityList(metaKey: String): [Entity]
    relationType(input: String): String
    viewMode(input: EntityListViewMode): EntityListViewMode
    enableNavigation(input: Boolean): Boolean
    customQuery(input: String): String
    customQueryRelationType(input: String): String
    customQueryFilters(input: String): String
    filtersNeedContext(input: [EntitySubelement]): [EntitySubelement]
    customQueryEntityPickerList(input: String): String
    customQueryEntityPickerListFilters(input: String): String
    searchInputType(input: String): String
    baseLibraryMode(input: BaseLibraryModes): BaseLibraryModes
    entityListElement: EntityListElement
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

  enum MapTypes {
    heatMap
    wktMap
  }

  type MapMetadata {
    value(
      key: String!
      source: KeyValueSource!
      defaultValue: JSON
      relationKey: String
    ): JSON!
  }

  input GeoJsonFeatureInput {
    key: String!
    source: KeyValueSource!
    defaultValue: JSON
    relationKey: String
  }

  type GeoJsonFeature {
    value(
      id: GeoJsonFeatureInput!
      coordinates: GeoJsonFeatureInput!
      weight: GeoJsonFeatureInput!
    ): JSON
  }

  type MapElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String!
    type(input: MapTypes): String!
    center(input: String): String!
    metaData: PanelMetaData!
    mapMetadata: MapMetadata
    geoJsonFeature: GeoJsonFeature
    config(input: [ConfigItemInput]): [ConfigItem]
  }

  input HierarchyRelationListInput {
    key: String!
    entityType: Entitytyping!
  }

  type HierarchyRelationList {
    key: String!
    entityType: Entitytyping!
  }

  type HierarchyListElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String!
    hierarchyRelationList(
      input: [HierarchyRelationListInput]
    ): [HierarchyRelationList]!
    entityTypeAsCenterPoint(input: Entitytyping): Entitytyping
    centerCoordinatesKey(input: String!): String!
    customQuery(input: String): String!
    can(input: [String]): [String]
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
    mediafilesWithOcr
    optionalMediafiles
    xmlMarc
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

  enum WysiwygExtensions {
    color
    listItem
    textStyle
    starterKit
    bold
    italic
    paragraph
    doc
    text
    elodyTaggingExtension
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
    infoLabelUrl(input: String): String
    extraMediafileType(input: String): String
  }

  type HiddenField {
    hidden: Boolean!
    searchValueForFilter: String!
  }

  input HiddenFieldInput {
    hidden: Boolean!
    searchValueForFilter: String!
  }

  enum PanelMetadataValueTooltipTypes {
    plane
    preview
  }

  type PanelMetadataValueTooltip {
    type: PanelMetadataValueTooltipTypes!
    value: String
  }

  input PanelMetadataValueTooltipInput {
    type: PanelMetadataValueTooltipTypes!
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
    valueTooltip(
      input: PanelMetadataValueTooltipInput
    ): PanelMetadataValueTooltip
    lineClamp(input: String): String!
    copyToClipboard(input: Boolean): Boolean
    isMultilingual(input: Boolean): Boolean
    customValue(input: String): String
    can(input: [String!]): [String]
    valueTranslationKey(input: String): String
  }

  type PanelRelationMetaData {
    label(input: String!): String!
    key(input: String!): String!
    unit(input: Unit!): Unit!
    linkText(input: String!): String
    inputField(type: BaseFieldType!): InputField!
    showOnlyInEditMode(input: Boolean): Boolean
  }

  type PanelRelationRootData {
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
    label(input: String): String
    panelType(input: PanelType!): PanelType!
    isEditable(input: Boolean!): Boolean!
    isCollapsed(input: Boolean!): Boolean!
    canBeMultipleColumns(input: Boolean!): Boolean!
    bulkData(bulkDataSource: String!): JSON
    info: PanelInfo!
    metaData: PanelMetaData!
    relation: [PanelRelation]
    entityListElement: EntityListElement
    wysiwygElement: WysiwygElement
  }

  type WindowElementBulkDataPanel {
    label(input: String!): String!
    intialValueKey(input: String!): String!
  }

  enum WindowElementLayout {
    Vertical
    HorizontalGrid
  }

  type WindowElement {
    label(input: String): String!
    panels: WindowElementPanel!
    layout(input: WindowElementLayout): WindowElementLayout
    expandButtonOptions: ExpandButtonOptions
    editMetadataButton(input: EditMetadataButtonInput!): EditMetadataButton
    lineClamp(input: String): String!
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

  input TagConfigurationByEntityInput {
    configurationEntityType: Entitytyping!
    configurationEntityRelationType: String!
    tagMetadataKey: String!
    colorMetadataKey: String!
    metadataKeysToSetAsAttribute: [String]
    secondaryAttributeToDetermineTagConfig: String # This is needed when entities can have the same tag
  }

  type TagConfigurationByEntity {
    configurationEntityType: Entitytyping!
    configurationEntityRelationType: String!
    tagMetadataKey: String!
    colorMetadataKey: String!
    metadataKeysToSetAsAttribute: [String]
    secondaryAttributeToDetermineTagConfig: String # This is needed when entities can have the same tag
  }

  input CharacterReplacementSettingsInput {
    replacementCharactersRegex: String!
    characterToReplaceWith: String!
  }

  type CharacterReplacementSettings {
    replacementCharactersRegex: String!
    characterToReplaceWith: String!
  }

  input TaggableEntityConfigurationInput {
    taggableEntityType: Entitytyping!
    createNewEntityFormQuery: String!
    relationType: String!
    metadataFilterForTagContent: String!
    replaceCharacterFromTagSettings: [CharacterReplacementSettingsInput]
    metadataKeysToSetAsAttribute: [String]
    tag: String
    tagConfigurationByEntity: TagConfigurationByEntityInput
  }

  type TaggableEntityConfiguration {
    taggableEntityType: Entitytyping!
    createNewEntityFormQuery: String!
    relationType: String!
    metadataFilterForTagContent: String!
    replaceCharacterFromTagSettings: [CharacterReplacementSettings]
    metadataKeysToSetAsAttribute: [String]
    tag: String
    tagConfigurationByEntity: TagConfigurationByEntity
  }

  type TaggingExtensionConfiguration {
    customQuery(input: String!): String!
    taggableEntityConfiguration(
      configuration: [TaggableEntityConfigurationInput!]!
    ): [TaggableEntityConfiguration!]!
  }

  type WysiwygElement {
    label(input: String!): String!
    metadataKey(input: String!): String!
    extensions(input: [WysiwygExtensions]!): [WysiwygExtensions]!
    taggingConfiguration: TaggingExtensionConfiguration
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
    wysiwygElement: WysiwygElement
    mapElement: MapElement
    hierarchyListElement: HierarchyListElement
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
    relationRootData: PanelRelationRootData
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
    previewComponent: PreviewComponent
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
    previewComponent: PreviewComponent
    deleteQueryOptions: DeleteQueryOptions
    mapElement: MapElement
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
    previewComponent: PreviewComponent
    deleteQueryOptions: DeleteQueryOptions
    mapElement: MapElement
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
    previewComponent: PreviewComponent
    deleteQueryOptions: DeleteQueryOptions
    mapElement: MapElement
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
    previewComponent: PreviewComponent
    deleteQueryOptions: DeleteQueryOptions
    mapElement: MapElement
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
    previewComponent: PreviewComponent
    deleteQueryOptions: DeleteQueryOptions
    mapElement: MapElement
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
    previewComponent: PreviewComponent
    deleteQueryOptions: DeleteQueryOptions
    mapElement: MapElement
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

  enum PreviewTypes {
    ColumnList
    MediaViewer
    Map
  }

  enum ListItemCoverageTypes {
    OneListItem
    AllListItems
  }

  type PreviewComponent {
    type(input: PreviewTypes!): PreviewTypes!
    listItemsCoverage(input: ListItemCoverageTypes!): ListItemCoverageTypes!
    title(input: String): String
    previewQuery(input: String): String
    openByDefault(input: Boolean): Boolean
    metadataPreviewQuery(input: String): String
    showCurrentPreviewFlow(input: Boolean): Boolean
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
      preferredLanguage: String
    ): EntitiesResults
    Tenants: EntitiesResults
    User: User
    UserPermissions: userPermissions
    Menu(name: String!): MenuWrapper
    EntityTypeSortOptions(entityType: String!): Entity!
    DropzoneEntityToCreate: DropzoneEntityToCreate!
    PaginationLimitOptions: PaginationLimitOptions!
    PreviewComponents(entityType: String!): Entity
    PreviewElement: ColumnList
    BulkOperations(entityType: String!): Entity!
    CustomBulkOperations: Entity!
    BulkOperationCsvExportKeys(entityType: String!): BulkOperationCsvExportKeys!
    BulkOperationsRelationForm: WindowElement!
    EntitiesByAdvancedSearch(
      q: String!
      filter_by: String!
      query_by: String!
      query_by_weights: String!
      sort_by: String!
      limit: Int
      per_page: Int
      facet_by: String!
    ): EntitiesResults!
    EntitiesByAiSearch(input: String!): EntitiesResults!
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
    GeoFilterForMap: AdvancedFilters
  }

  type Mutation {
    mutateEntityValues(
      id: String!
      formInput: EntityFormInput!
      collection: Collection!
      preferredLanguage: String
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
      skipItemsWithRelationDuringBulkDelete: [String!]
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
      @deprecated(reason: "We use the new mediaviewer integrated in previews")
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
