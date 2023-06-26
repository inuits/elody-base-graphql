import { gql } from 'graphql-modules';
export const baseSchema = gql`
  scalar JSON
  # Generic
  enum ExcludeOrInclude {
    exclude
    include
  }

  enum Unit {
    datetime
    seconds
    coordinates
  }

  enum Permission {
    canget
    canput
    canpatch
    candelete
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
  }

  enum BaseFieldType {
    baseCheckbox
    baseColorField
    baseTextField
    baseNumberField
    baseDateField
    baseDateTimeField
  }

  type InputField {
    fieldName(input: String): String
    type: String!
    acceptedEntityTypes: [String]
    validation: Boolean
    options: [String]
    optionsConfigKey: String
  }

  enum validation {
    required
    optional
  }

  enum Collection {
    entities
    mediafiles
  }

  #TYPEMODALS

  enum ModalState {
    Initial
    Show
    Hide
    Loading
  }

  enum TypeModals {
    Upload
    Create
    BulkOperations
    Confirm
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
    subMenu(name: String!): Menu
    icon: MenuIcons
    isLoggedIn: Boolean
    typeLink: MenuTypeLink
  }

  enum MenuIcons {
    BookOpen
    Create
    Image
    Upload
    History
    Iot
    Police
  }
  type Menu {
    name: String!
    menuItem(
      label: String!
      icon: MenuIcons
      isLoggedIn: Boolean
      typeLink: MenuTypeLinkInput
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
    Create
    Cross
    Desktop
    DocumentInfo
    Download
    DownloadAlt
    Edit
    EditAlt
    EllipsisV
    ExclamationTriangle
    Export
    Eye
    FileAlt
    Filter
    History
    Image
    Link
    ListUl
    Minus
    Music
    NoImage
    Plus
    PlusCircle
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
  }

  scalar StringOrInt
  type DropdownOption {
    icon: DamsIcons!
    label: String!
    value: StringOrInt!
  }

  input DropdownOptionInput {
    icon: DamsIcons!
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
  }

  type BulkOperations {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type BulkOperationCsvExportKeys {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  interface Form {
    inputFields(type: [BaseFieldType]!, fieldLabels: [String]!): [InputField]
  }

  type CreateEntityForm implements Form {
    idPrefix: String
    inputFields(type: [BaseFieldType]!, fieldLabels: [String]!): [InputField]
  }

  input updateOrderNode {
    id: String!
    order: Int!
  }

  input OrderArrayInput {
    value: [updateOrderNode!]!
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
    value: String
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

  type RelationMetaData {
    key: String!
    value: String!
  }

  type Metadata {
    key: String!
    value: JSON!
    unit(input: Unit!): Unit
    lang: String
    label: String!
    immutable: Boolean
  }

  type MetadataRelation {
    key: String!
    value: JSON!
    label: String!
    type: String
    metadataOnRelation: [RelationMetaData]
    linkedEntity: Entity
  }

  type PaginationLimitOptions {
    options(input: [DropdownOptionInput!]!): [DropdownOption!]!
  }

  type SortOptions {
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
    validation: validation
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

  type relationValues {
    teaserMetadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]
    id: String!
    metaData: KeyValue
    relationType: String!
    toBeDeleted: Boolean!
  }

  type IntialValues {
    keyValue(key: String!): JSON!
    relation(key: String!): [relationValues]
  }

  input RelationValuesInput {
    label: String!
    id: String!
    metaData: [MetadataValuesInput!]!
    relationType: String!
    toBeDeleted: Boolean!
  }

  input MetadataValuesInput {
    key: String!
    value: JSON!
  }

  input EntityFormInput {
    metadata: [MetadataValuesInput!]!
    relations: [RelationValuesInput!]!
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
    type(input: String): String
    meta_key(input: String): String
    entity_types(input: [Entitytyping]): [Entitytyping]
    entityList: [Entity]
  }

  type MediaFileElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String!
    type(input: MediaFileElementTypes): String!
    metaData: PanelMetaData!
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

  type PanelMetaData {
    label(input: String!): String!
    key(input: String!): String!
    unit(input: Unit!): Unit!
    inputField(type: BaseFieldType!): InputField!
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
  }

  type WindowElement {
    label(input: String): String!
    panels: WindowElementPanel!
    expandButtonOptions: ExpandButtonOptions
  }

  type ColumnList {
    column: Column!
  }

  type EntityViewElements {
    entityListElement: EntityListElement
    mediaFileElement: MediaFileElement
    windowElement: WindowElement
  }

  type Column {
    size(size: ColumnSizes): ColumnSizes!
    elements: EntityViewElements!
  }

  interface Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
  }

  type BaseEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]
    teaserMetadata: [MetadataAndRelation]
    media: Media
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
  }

  type MediaFileEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]
    media: Media
    teaserMetadata: [MetadataAndRelation]
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
    advancedFilters: AdvancedFilters
  }

  type EntitiesResults {
    results: [Entity]
    sortKeys(sortItems: [String]): [String]
    count: Int
    limit: Int
  }

  type Query {
    Entity(id: String!, type: String!): Entity
    Entities(
      limit: Int
      skip: Int
      searchInputType: SearchInputType
      searchValue: SearchFilter!
      advancedSearchValue: [FilterInput]
      advancedFilterInputs: [AdvancedFilterInput!]!
      fetchPolicy: String
    ): EntitiesResults
    Form(type: String!): Form
    User: User
    UserPermissions: userPermissions
    Menu(name: String!): MenuWrapper
    DropzoneEntityToCreate: DropzoneEntityToCreate!
    SortOptions: SortOptions!
    PaginationLimitOptions: PaginationLimitOptions!
    BulkOperations: BulkOperations!
    BulkOperationCsvExportKeys: BulkOperationCsvExportKeys!
    GetCreateEntityForm(type: String!): CreateEntityForm!
  }

  type Mutation {
    updateRelationsAndMetadata(id: String!, data: EntityFormInput!): Entity
    replaceRelationsAndMetaData(id: String!, form: MetadataFormInput): Entity
    replaceMetadata(id: String!, metadata: [MetadataInput!]!): [Metadata!]!
    setMediaPrimaire(entity_id: String!, mediafile_id: String!): String
    setThumbnailPrimaire(entity_id: String!, mediafile_id: String!): String
    deleteData(id: String!, path: Collection!, deleteMediafiles: Boolean!): String
    updateMediafilesOrder(value: OrderArrayInput!): String
    deleteRelations(id: String!, metadata: [MetadataInput!]!): String
    linkMediafileToEntity(
      entityId: String!
      mediaFileInput: MediaFileInput!
    ): MediaFile
  }
`;
