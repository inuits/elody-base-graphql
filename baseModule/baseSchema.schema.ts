import { gql } from 'graphql-modules';
export const baseSchema = gql`
  # Generic
  enum ExcludeOrInclude {
    exclude
    include
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
    dropdownMultiselect
  }

  enum BaseFieldType {
    baseTextField
    baseDateField
  }

  type InputField {
    type: InputFieldTypes!
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

  type DropzoneEntityToCreate {
    options(input: [DropzoneEntityOptionInput!]!): [DropzoneEntityOption!]!
  }

  input DropzoneEntityOptionInput {
    label: String!
    value: String!
  }

  type DropzoneEntityOption {
    label: String!
    value: String!
  }

  type Form {
    fields: [MetadataOrRelationField]!
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
    MultiSelectInput
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

  type InputField {
    type: InputFieldTypes!
    acceptedEntityTypes: [String]
    validation: Boolean
    options: [String]
    optionsConfigKey: String
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
    value: String!
    lang: String
    label: String!
    immutable: Boolean
  }

  type MetadataRelation {
    key: String!
    value: String!
    label: String!
    type: String
    metadataOnRelation: [RelationMetaData]
    linkedEntity: Entity
  }

  type SortOptions {
    options(input: [MetadataFieldOptionInput!]!): [MetadataFieldOption!]!
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
    keyValue(key: String!): String!
  }

  type relationValues {
    teaserMetadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    id: String!
    metaData: KeyValue
    relationType: String!
    toBeDeleted: Boolean!
  }

  type IntialValues {
    keyValue(key: String!): String!
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
    value: String!
  }

  input EntityFormInput {
    metadata: [MetadataValuesInput!]!
    relations: [RelationValuesInput!]!
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
    key(input: String): String
  }

  type MediaFileElement {
    isCollapsed(input: Boolean!): Boolean!
    label(input: String): String!
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
  }

  type BaseEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    media: Media
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
  }
  type MediaFileEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    media: Media
    teaserMetadata: [MetadataAndRelation]
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
  }

  type person implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
  }

  type SimpleEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    media: Media
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
  }

  type IntermediateEntity implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    media: Media
    permission: [Permission]
    intialValues: IntialValues!
    entityView: ColumnList!
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
      searchValue: SearchFilter
      advancedSearchValue: [FilterInput]
      fetchPolicy: String
    ): EntitiesResults
    Form(type: String!): Form
    User: User
    UserPermissions: userPermissions
    Menu(name: String!): MenuWrapper
    DropzoneEntityToCreate: DropzoneEntityToCreate!
    SortOptions: SortOptions!
  }

  type Mutation {
    updateRelationsAndMetadata(id: String!, data: EntityFormInput!): Entity
    replaceRelationsAndMetaData(id: String!, form: MetadataFormInput): Entity
    replaceMetadata(id: String!, metadata: [MetadataInput!]!): [Metadata!]!
    setMediaPrimaire(entity_id: String!, mediafile_id: String!): String
    setThumbnailPrimaire(entity_id: String!, mediafile_id: String!): String
    deleteData(id: String!, path: Collection!): String
    updateMediafilesOrder(value: OrderArrayInput!): String
    deleteRelations(id: String!, metadata: [MetadataInput!]!): String
    linkMediafileToEntity(
      entityId: String!
      mediaFileInput: MediaFileInput!
    ): MediaFile
  }
`;
