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
    boolean
    text
    number
    checkbox
    dropdown
  }

  enum validation {
    required
    optional
  }

  enum Collection {
    entities
    mediafiles
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

  input SearchFilter {
    value: String
    isAsc: Boolean
    key: String
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

  type Form {
    fields: [MetadataOrRelationField]!
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

  type MetadataFieldOption {
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
    type: Entitytyping
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
  }

  type IntialValues {
    keyValue(key: String!): String
    relation(key: String!): [relationValues]
  }

  enum ColumnSizes {
    fifty
    thirty
    seventy
  }

  type EntityListElement {
    label(input: String): String
    type(input: String): String
    key(input: String): String
  }

  type MediaFileElement {
    label(input: String): String!
  }

  type PanelMetaData {
    label(input: String!): String!
    key(input: String!): String!
  }

  type WindowElementPanel {
    label(input: String!): String!
    metaData: PanelMetaData!
  }

  type WindowElement {
    label(input: String): String!
    panels: WindowElementPanel!
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
    ): [MetadataAndRelation]!
    form: Form
    permission: [Permission]
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
    form: Form
    permission: [Permission]
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
    form: Form
    teaserMetadata: [MetadataAndRelation]
    permission: [Permission]
  }

  type person implements Entity {
    id: String!
    uuid: String!
    type: String!
    metadata(
      keys: [String]!
      excludeOrInclude: ExcludeOrInclude!
    ): [MetadataAndRelation]!
    form: Form
    permission: [Permission]
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
    form: Form
    permission: [Permission]
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
    form: Form
    permission: [Permission]
  }

  type EntitiesResults {
    results: [Entity]
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
  }

  type Mutation {
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
