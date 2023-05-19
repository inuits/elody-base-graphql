import { filterInputParser } from 'advanced-filter-module';
import {
  formInputToPatchDeleteRelationsMetadata,
  FormInputToRelations,
  isMetaDataRelation,
  MediaFileToMedia,
  parseIdToGetMoreData,
  removePrefixFromId,
} from '../parsers/entity';
import {
  resolveMedia,
  resolveMetadata,
  resolvePermission,
} from '../resolvers/entityResolver';
import { resolveMediafileForm } from '../resolvers/formResolver';
import {
  Collection,
  Column,
  ColumnSizes,
  EntitiesResults,
  Entity,
  EntityListElement,
  EntityViewElements,
  ExcludeOrInclude,
  Form,
  Maybe,
  MediaFileElement,
  Metadata,
  MenuIcons,
  MetadataInput,
  MetadataValuesInput,
  PanelMetaData,
  PanelInfo,
  PanelRelation,
  Resolvers,
  SearchInputType,
  WindowElement,
  WindowElementPanel,
  MenuTypeLink,
  MediaFileElementTypes,
} from '../../../generated-types/type-defs';
import { ContextValue } from 'base-graphql';
import { InputRelationsDelete, relationInput } from '../sources/collection';
import { DataSources } from '../types';
import { baseFields, getOptionsByConfigKey } from '../sources/forms';
import { Orientations } from '../../../generated-types/type-defs';
import { ExpandButtonOptions } from '../../../generated-types/type-defs';
import { GraphQLScalarType, Kind } from 'graphql';
export const baseResolver: Resolvers<ContextValue> = {
  StringOrInt: new GraphQLScalarType({
    name: "StringOrInt",
    description: "A String or an Int union type",
    serialize(value) {
      if (typeof value !== "string" && typeof value !== "number")
        throw new Error("Value must be either a String or an Int");
      if (typeof value === "number" && !Number.isInteger(value))
        throw new Error("Number value must be an Int");
      return value;
    },
    parseValue(value) {
      if (typeof value !== "string" && typeof value !== "number")
        throw new Error("Value must be either a String or an Int");
      if (typeof value === "number" && !Number.isInteger(value))
        throw new Error("Number value must be an Int");
      return value;
    },
    parseLiteral(value) {
      switch (value.kind) {
        case Kind.INT: return parseInt(value.value, 10);
        case Kind.STRING: return value.value;
        default:
          throw new Error("Value must be either a String or an Int");
      }
    }
  }),
  Query: {
    Entity: async (_source, { id, type }, { dataSources }) => {
      if (type === 'MediaFile') {
        return await dataSources.CollectionAPI.getMediaFile(id);
      } else {
        return dataSources.CollectionAPI.getEntity(parseIdToGetMoreData(id));
      }
    },
    Entities: async (
      _source,
      { limit, skip, searchValue, advancedSearchValue, searchInputType },
      { dataSources }
    ) => {
      let entities: EntitiesResults = { results: [] };
      if (searchInputType === SearchInputType.AdvancedSavedSearchType) {
        entities = await dataSources.CollectionAPI.getSavedSearches(
          limit || 20,
          skip || 0,
          searchValue
        );
      } else if (
        searchInputType === SearchInputType.AdvancedInputMediaFilesType
      ) {
        entities = await dataSources.CollectionAPI.getAdvancedMediaFiles(
          limit || 20,
          skip || 0,
          advancedSearchValue ? filterInputParser(advancedSearchValue) : []
        );
      } else if (
        searchInputType === SearchInputType.AdvancedInputType &&
        advancedSearchValue?.length
      ) {
        entities = await dataSources.CollectionAPI.GetAdvancedEntities(
          limit || 20,
          skip || 0,
          advancedSearchValue ? filterInputParser(advancedSearchValue) : []
        );
      } else if (searchInputType === SearchInputType.AdvancedInputType) {
        entities = await dataSources.CollectionAPI.getEntities(
          limit || 20,
          skip || 0,
          searchValue || { value: '' }
        );
      } else {
        entities = await dataSources.SearchAPI.getEntities(
          limit || 20,
          skip || 0,
          searchValue || { value: '' }
        );
      }
      return entities;
    },
    Form: async (_source, { type }, { dataSources }): Promise<Maybe<Form>> => {
      switch (type) {
        case 'media':
          return await resolveMediafileForm(dataSources);
        default:
          return null;
      }
    },
    UserPermissions: async (_source, _args, { dataSources }) => {
      return dataSources.CollectionAPI.getUserPermissions();
    },
    Menu: async (_source, { name }, { dataSources }) => {
      return {
        menu: {
          name,
        },
      };
    },
    DropzoneEntityToCreate: async (_source, {}, { dataSources }) => {
      return {
        options: [],
      };
    },
    SortOptions: async (_source, {}, { dataSources }) => {
      return {
        options: [],
      };
    },
    BulkOperations: async (_source, {}, { dataSources }) => {
      return { options: [] };
    },
    PaginationLimitOptions: async (_source, {}, { dataSources }) => {
      return { options: [] };
    },
  },
  Mutation: {
    linkMediafileToEntity: async (
      _source,
      { entityId, mediaFileInput },
      { dataSources }
    ) => {
      const linkedResult: any =
        await dataSources.CollectionAPI.linkMediafileToEntity(
          entityId,
          mediaFileInput
        );
      return linkedResult;
    },
    replaceRelationsAndMetaData: async (
      _source,
      { id, form },
      { dataSources }
    ) => {
      const relationInput = FormInputToRelations(form);
      //@ts-ignore
      if (relationInput && relationInput.length > 0)
        //@ts-ignore
        await dataSources.CollectionAPI.patchRelations(id, relationInput);

      if (form?.Metadata)
        await dataSources.CollectionAPI.patchMetadata(id, form.Metadata);

      return dataSources.CollectionAPI.getEntity(parseIdToGetMoreData(id));
    },
    updateRelationsAndMetadata: async (
      _source,
      { id, data },
      { dataSources }
    ) => {
      const dataForApi = formInputToPatchDeleteRelationsMetadata(
        data.relations,
        data.metadata
      );

      if (dataForApi.relationsToDelete !== 'nothing-to-delete')
        await dataSources.CollectionAPI.deleteRelations(
          id,
          dataForApi.relationsToDelete
        );
      if (dataForApi.relationsToUpdate !== 'nothing-to-update')
        await dataSources.CollectionAPI.patchRelations(
          id,
          dataForApi.relationsToUpdate
        );
      if (dataForApi.metadataToUpdate !== 'nothing-to-update')
        await dataSources.CollectionAPI.patchMetadata(
          id,
          dataForApi.metadataToUpdate
        );

      return dataSources.CollectionAPI.getEntity(parseIdToGetMoreData(id));
    },
    replaceMetadata: async (_source, { id, metadata }, { dataSources }) => {
      return dataSources.CollectionAPI.replaceMetadata(id, metadata);
    },
    setMediaPrimaire: async (
      _source,
      { entity_id, mediafile_id },
      { dataSources }
    ) => {
      return dataSources.CollectionAPI.setMediaPrimaire(
        entity_id,
        mediafile_id
      );
    },
    setThumbnailPrimaire: async (
      _source,
      { entity_id, mediafile_id },
      { dataSources }
    ) => {
      return dataSources.CollectionAPI.setThumbnailPrimaire(
        entity_id,
        mediafile_id
      );
    },
    deleteData: async (_source, { id, path }, { dataSources }) => {
      return dataSources.CollectionAPI.deleteData(id, path);
    },
    deleteRelations: async (_source, { id, metadata }, { dataSources }) => {
      return dataSources.CollectionAPI.deleteRelations(
        id,
        metadata as InputRelationsDelete
      );
    },
    updateMediafilesOrder: async (_source, { value }, { dataSources }) => {
      return dataSources.CollectionAPI.updateMediafilesOrder(value);
    },
  },
  BaseEntity: {
    media: async (parent: any, _args, { dataSources }) => {
      return resolveMedia(dataSources, parent);
    },
    metadata: async (parent: any, { keys, excludeOrInclude }) => {
      return await resolveMetadata(parent, keys, excludeOrInclude);
    },
    permission: async (parent: any, _args, { dataSources }) => {
      return resolvePermission(dataSources, parent.id);
    },
  },
  SimpleEntity: {
    metadata: async (parent: any, { keys, excludeOrInclude }) => {
      return await resolveMetadata(parent, keys, excludeOrInclude);
    },
    permission: async (parent: any, _args, { dataSources }) => {
      return resolvePermission(dataSources, parent.id);
    },
  },
  IntermediateEntity: {
    metadata: async (parent: any, { keys, excludeOrInclude }) => {
      return await resolveMetadata(parent, keys, excludeOrInclude);
    },
    permission: async (parent: any, _args, { dataSources }) => {
      return resolvePermission(dataSources, parent.id);
    },
  },
  person: {
    metadata: async (parent: any, { keys, excludeOrInclude }) => {
      return await resolveMetadata(parent, keys, excludeOrInclude);
    },
    permission: async (parent: any, _args, { dataSources }) => {
      return resolvePermission(dataSources, parent.id);
    },
  },
  MediaFileEntity: {
    id: async (parent: any) => {
      return parent._key;
    },
    type: async (parent: any) => 'MediaFile',
    metadata: async (parent: any, { keys, excludeOrInclude }) => {
      const parseMetadata = await resolveMetadata(
        parent,
        keys,
        excludeOrInclude
      );
      parseMetadata.push({
        key: 'filename',
        label: 'filename',
        value: parent.filename,
      });
      return parseMetadata;
    },
    media: async (parent: any, _args) => {
      let parsedMedia = MediaFileToMedia(parent);
      return parsedMedia;
    },
    permission: async (parent: any, _args, { dataSources }) => {
      return resolvePermission(
        dataSources,
        parent['_id'].replace('mediafiles/', ''),
        Collection.Mediafiles
      );
    },
  },
  MetadataRelation: {
    linkedEntity: async (parent, _args, { dataSources }) => {
      if (parent.type !== 'hasMediafile') {
        return await dataSources.CollectionAPI.getEntity(
          parseIdToGetMoreData(parent.key)
        );
      }
    },
  },
  MetadataAndRelation: {
    __resolveType(obj: any) {
      return isMetaDataRelation(obj);
    },
  },
  MetadataOrRelationField: {
    __resolveType(obj: any) {
      return obj.relationType ? 'RelationField' : 'MetadataField';
    },
  },
  Media: {
    mediafiles: async (parent: any, _args, { dataSources }) => {
      return parent.parentId
        ? dataSources.CollectionAPI.getMediafiles(parent.parentId)
        : parent.mediafiles;
    },
  },
  IntialValues: {
    keyValue: async (parent, _args, { dataSources }) => {
      const metaData = await resolveMetadata(
        parent,
        [_args.key],
        ExcludeOrInclude.Include
      );
      let returnString: string = '';
      metaData.forEach((data: any) => {
        returnString = data.value;
      });
      return returnString;
    },
    relation: async (parent: any, { key }, { dataSources }) => {
      return parent.relations
        ? parent.relations.filter(
            (relation: { label: string; type: string }) =>
              relation.label === key && relation.type !== null
          )
        : [];
    },
  },
  relationValues: {
    teaserMetadata: async (
      parent: any,
      { keys, excludeOrInclude },
      { dataSources }
    ) => {
      const entity = await dataSources.CollectionAPI.getEntity(
        parseIdToGetMoreData(parent.key)
      );
      return await resolveMetadata(entity, keys, excludeOrInclude);
    },
    id: async (parent: any, _args, { dataSources }) => {
      return parent.key;
    },
    relationType: async (parent: any, _args, { dataSources }) => {
      return parent.type === null ? 'no-type-in-api' : parent.type;
    },
    toBeDeleted: () => false,
  },
  MediaFileElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    type: async (_source, { input }, { dataSources }) => {
      return input || MediaFileElementTypes.Media;
    },
  },
  EntityListElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    type: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    key: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
  },
  WindowElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    panels: async (parent: unknown, {}, { dataSources }) => {
      return parent as WindowElementPanel;
    },
    expandButtonOptions: async (parent: unknown, {}, { dataSources }) => {
      return parent as ExpandButtonOptions;
    },
  },
  WindowElementPanel: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isEditable: async (_source, { input }, { dataSources }) => {
      return input != undefined ? input : false;
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    panelType: async (_source, { input }, { dataSources }) => {
      return input;
    },
    info: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelInfo;
    },
    metaData: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelMetaData;
    },
    relation: async (parent: any, {}, { dataSources }) => {
      try {
        const collection: Collection = parent.uuid.includes(Collection.Entities)
          ? Collection.Entities
          : Collection.Mediafiles;
        const relations = (
          await dataSources.CollectionAPI.getRelations(
            removePrefixFromId(parent.uuid),
            collection
          )
        ).map((rel: Metadata) => {
          return { value: rel.value, label: rel.label };
        });
        return relations as [PanelRelation];
      } catch (e) {
        console.log('Item has no relations');
        return [];
      }
    },
  },
  ExpandButtonOptions: {
    shown: async (_source, { input }, { dataSources }) => {
      return input ? input : true;
    },
    orientation: async (_source, { input }, { dataSources }) => {
      return input ? input : Orientations.Left;
    },
  },
  PanelInfo: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    value: async (_source: any, { input }, { dataSources }) => {
      return _source[input] || '';
    },
    inputField: async (_source, { type }, { dataSources }) => {
      const field = baseFields[type];
      const fieldWithOptions = getOptionsByConfigKey(field, dataSources);
      return fieldWithOptions;
    },
  },
  PanelMetaData: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    key: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    inputField: async (_source, { type }, { dataSources }) => {
      const field = baseFields[type];
      const fieldWithOptions = getOptionsByConfigKey(field, dataSources);
      return fieldWithOptions;
    },
  },
  Column: {
    size: async (_source, { size }, { dataSources }) => {
      return size as ColumnSizes;
    },
    elements: async (parent: unknown, {}, { dataSources }) => {
      return parent as EntityViewElements;
    },
  },
  ColumnList: {
    column: async (parent: unknown, {}, { dataSources }) => {
      return parent as Column;
    },
  },
  EntityViewElements: {
    entityListElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as EntityListElement;
    },
    mediaFileElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as MediaFileElement;
    },
    windowElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as WindowElement;
    },
  },
  MenuWrapper: {
    menu: async (parent, {}, { dataSources }) => {
      return parent.menu;
    },
  },
  Menu: {
    menuItem: async (
      _source,
      { label, icon, isLoggedIn, typeLink },
      { dataSources }
    ) => {
      return {
        label,
        icon,
        isLoggedIn,
        typeLink,
      };
    },
  },
  MenuItem: {
    label: async (parent, {}, { dataSources }) => {
      return parent.label;
    },
    subMenu: async (parent, { name }, { dataSources }) => {
      return { name };
    },
    icon: async (parent, {}, { dataSources }) => {
      return parent.icon as MenuIcons;
    },
    isLoggedIn: async (parent, {}, { dataSources }) => {
      return parent.isLoggedIn as boolean;
    },
    typeLink: async (parent, {}, { dataSources }) => {
      return parent.typeLink as MenuTypeLink;
    },
  },
  DropzoneEntityToCreate: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  SortOptions: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  BulkOperations: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  PaginationLimitOptions: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
};
