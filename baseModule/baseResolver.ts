import {
  isMetaDataRelation,
  MediaFileToMedia,
  parseIdToGetMoreData,
  removePrefixFromId,
} from '../parsers/entity';
import {
  resolveMedia,
  resolveMetadata,
  resolvePermission,
  resolveMetadataItemOfPreferredLanguage,
} from '../resolvers/entityResolver';
import {
  Collection,
  Column,
  ColumnSizes,
  EntitiesResults,
  EntityListElement,
  EntityViewElements,
  EntityListViewMode,
  MediaFileElement,
  Metadata,
  MenuIcons,
  PanelMetaData,
  PanelInfo,
  PanelRelation,
  Resolvers,
  SearchInputType,
  WindowElement,
  ActionElement,
  PromGraphElement,
  WindowElementPanel,
  MenuTypeLink,
  MediaFileElementTypes,
  Actions,
  KeyValueSource,
  Entitytyping,
  Entity,
  TeaserMetadataOptions,
  EditStatus,
  BaseRelationValuesInput,
  InputField,
  ManifestViewerElement,
} from '../../../generated-types/type-defs';
import { ContextValue } from '../types';
import { baseFields, getOptionsByEntityType } from '../sources/forms';
import { Orientations } from '../../../generated-types/type-defs';
import { ExpandButtonOptions } from '../../../generated-types/type-defs';
import { GraphQLScalarType, Kind } from 'graphql';
import { setPreferredLanguageForDataSources } from '../helpers/helpers';

export const baseResolver: Resolvers<ContextValue> = {
  StringOrInt: new GraphQLScalarType({
    name: 'StringOrInt',
    description: 'A String or an Int union type',
    serialize(value) {
      if (typeof value !== 'string' && typeof value !== 'number')
        throw new Error('Value must be either a String or an Int');
      if (typeof value === 'number' && !Number.isInteger(value))
        throw new Error('Number value must be an Int');
      return value;
    },
    parseValue(value) {
      if (typeof value !== 'string' && typeof value !== 'number')
        throw new Error('Value must be either a String or an Int');
      if (typeof value === 'number' && !Number.isInteger(value))
        throw new Error('Number value must be an Int');
      return value;
    },
    parseLiteral(value) {
      switch (value.kind) {
        case Kind.INT:
          return parseInt(value.value, 10);
        case Kind.STRING:
          return value.value;
        default:
          throw new Error('Value must be either a String or an Int');
      }
    },
  }),
  Query: {
    OCRForm: async (_source, {}, { dataSources }) => {
      return {
        inputFields: [],
      };
    },
    Entity: async (
      _source,
      { id, type, preferredLanguage },
      { dataSources }
    ) => {
      if (preferredLanguage)
        setPreferredLanguageForDataSources(dataSources, preferredLanguage);
      if (type.toLowerCase() === 'mediafile') {
        return await dataSources.CollectionAPI.getMediaFile(id);
      } else {
        return dataSources.CollectionAPI.getEntity(parseIdToGetMoreData(id));
      }
    },
    Entities: async (
      _source,
      {
        type,
        limit,
        skip,
        searchValue,
        advancedSearchValue,
        advancedFilterInputs,
        searchInputType,
      },
      { dataSources }
    ) => {
      let entities: EntitiesResults = { results: [] };
      const entityType: Entitytyping = type || Entitytyping.Asset;

      if (searchInputType === SearchInputType.AdvancedSavedSearchType) {
        entities = await dataSources.CollectionAPI.getSavedSearches(
          limit || 20,
          skip || 0,
          searchValue
        );
      } else if (
        searchInputType === SearchInputType.AdvancedInputMediaFilesType &&
        advancedFilterInputs?.length >= 0
      ) {
        entities = await dataSources.CollectionAPI.GetAdvancedEntities(
          Entitytyping.Mediafile,
          limit || 20,
          skip || 0,
          advancedFilterInputs,
          searchValue || { value: '' }
        );
      } else if (
        searchInputType === SearchInputType.AdvancedInputType &&
        advancedFilterInputs?.length
      ) {
        entities = await dataSources.CollectionAPI.GetAdvancedEntities(
          entityType,
          limit || 20,
          skip || 0,
          advancedFilterInputs,
          searchValue || { value: '' }
        );
      } else if (searchInputType === SearchInputType.AdvancedInputType) {
        entities = await dataSources.CollectionAPI.getEntities(
          limit || 20,
          skip || 0,
          searchValue || { value: '' }
        );
      }
      return entities;
    },
    Tenants: async (_source, _args, { dataSources }) => {
      return await dataSources.CollectionAPI.getTenants();
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
    EntityTypeSortOptions: async (_source, { entityType }, { dataSources }) => {
      return {
        type: entityType,
        sortOptions: {},
      } as Entity;
    },
    PaginationLimitOptions: async (_source, {}, { dataSources }) => {
      return { options: [] };
    },
    BulkOperations: async (_source, {}, { dataSources }) => {
      return { options: [] };
    },
    BulkOperationCsvExportKeys: async (_source, {}, { dataSources }) => {
      return { options: [] };
    },
  },
  // OCRForm: {
  //   // inputFields: async (parent, { type, fieldLabels }, { dataSources }) => {
  //   inputFields: async (parent, { type, fieldLabels }, { dataSources }) => {
  //     const inputFieldsArray: any[] = [];

  //     type.forEach((fieldType, i) => {
  //       if (fieldType !== null) {
  //         const field = baseFields[fieldType];

  //         let fieldWithOptions = getOptionsByEntityType(dataSources).then(
  //           (result) => {
  //             result.fieldName = fieldLabels[i];
  //             inputFieldsArray.push(result);
  //           }
  //         );
  //         // inputFieldsArray.push(fieldWithOptions);
  //       }
  //     });
  //     return inputFieldsArray;
  //   },
  // },
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
    mutateEntityValues: async (_source, { id, formInput }, { dataSources }) => {
      const filterEditStatus = (
        editStatus: EditStatus
      ): BaseRelationValuesInput[] => {
        return formInput.relations
          .filter((relationInput) => relationInput.editStatus === editStatus)
          .map((relationInput) => {
            const relation: any = {};
            Object.keys(relationInput)
              .filter((key) => key !== 'editStatus' && key !== 'teaserMetadata')
              .forEach((key) => {
                relation[key] = (relationInput as any)[key];
              });
            return relation;
          });
      };

      await dataSources.CollectionAPI.patchMetadata(id, formInput.metadata);
      await dataSources.CollectionAPI.postRelations(
        id,
        filterEditStatus(EditStatus.New)
      );
      await dataSources.CollectionAPI.patchRelations(
        id,
        filterEditStatus(EditStatus.Changed)
      );
      await dataSources.CollectionAPI.deleteRelations(
        id,
        filterEditStatus(EditStatus.Deleted)
      );

      return await dataSources.CollectionAPI.getEntity(
        parseIdToGetMoreData(id)
      );
    },
    deleteData: async (
      _source,
      { id, path, deleteMediafiles },
      { dataSources }
    ) => {
      return dataSources.CollectionAPI.deleteData(id, path, deleteMediafiles);
    },
    bulkAddRelations: async (
      _source,
      { entityIds, relationEntityId, relationType },
      { dataSources }
    ) => {
      const relationsInput: BaseRelationValuesInput[] = entityIds.map(
        (entityId: string) => {
          return {
            editStatus: EditStatus.New,
            key: entityId,
            type: relationType,
          };
        }
      );
      dataSources.CollectionAPI.patchRelations(
        relationEntityId,
        relationsInput
      );
      return '';
    },
  },
  BaseEntity: {
    media: async (parent: any, _args, { dataSources }) => {
      return resolveMedia(dataSources, parent);
    },
    permission: async (parent: any, _args, { dataSources }) => {
      return resolvePermission(dataSources, parent.id);
    },
  },
  teaserMetadata: {
    metaData: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelMetaData;
    },
  },
  MediaFileEntity: {
    id: async (parent: any) => {
      return parent._id;
    },
    type: async (parent: any) => 'MediaFile',
    media: async (parent: any, _args) => {
      let parsedMedia = MediaFileToMedia(parent);
      return parsedMedia;
    },
    intialValues: async (parent: any, _args) => {
      return parent;
    },
    relationValues: async (parent: any, _args, { dataSources }) => {
      return parent.relations ?? [];
    },
    entityView: async (parent: any, _args, { dataSources }) => {
      return parent;
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
        // Check if the Object is an OCR'ed mediafile
        if (
          parent?.metadataOnRelation?.find(
            (m) => m !== null && m.key === 'is_ocr' && Boolean(m.value) === true
          )
        ) {
          // OCR'ed objects are mediafiles, so use getMediaFile
          return await dataSources.CollectionAPI.getMediaFile(parent.key);
        } else {
          // use getEntity for the other things
          //        return await dataSources.CollectionAPI.getEntity(
          //          parseIdToGetMoreData(parent.key)
          //        );
        }
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
    keyValue: async (parent: any, { key, source }, { dataSources }) => {
      if (source === KeyValueSource.Metadata) {
        const preferredLanguage = dataSources.CollectionAPI.preferredLanguage;
        const metadata = await resolveMetadata(parent, [key], undefined);
        if (metadata.length > 1) {
          return resolveMetadataItemOfPreferredLanguage(
            metadata,
            preferredLanguage
          )?.value;
        }
        return metadata[0]?.value ?? '';
      } else if (source === KeyValueSource.Root) {
        return parent?.[key] ?? '';
      } else if (source === KeyValueSource.Relations) {
        try {
          return parent?.relations.find(
            (relation: any) => relation.type === key
          ).value;
        } catch {
          return parent?.[key] ?? '';
        }
      }

      return '';
    },
  },
  RelationValues: {
    label: async (parent: any, { input }, { dataSources }) => {
      return input ?? '';
    },
    relations: async (parent: any, {}, { dataSources }) => {
      return parent;
    },
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
  PromGraphElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    query: async (_source, { input }, { dataSources }) => {
      return input ? input : ['no-query'];
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
  },
  EntityListElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    metaKey: async (parent, { key }, { dataSources }) => {
      return key ? key : 'no-key';
    },
    entityTypes: async (parent: any, { input }, { dataSources }) => {
      return input || [];
    },
    viewMode: async (parent: any, { input }, { dataSources }) => {
      return input || EntityListViewMode.Library;
    },
    entityList: async (
      parent: any,
      { metaKey },
      { dataSources }
    ): Promise<any[]> => {
      const ids: [string] = parent.metadata.find(
        (dataItem: Metadata) => dataItem.key === metaKey
      )?.value;
      const entities: Promise<any>[] = [];

      if (!ids) return [];

      ids.forEach(async (id) => {
        const entity = dataSources.CollectionAPI.getEntity(
          parseIdToGetMoreData(id)
        );
        //      entities.push(entity);
      });

      const res = await Promise.all(entities);

      return res;
    },
  },
  ManifestViewerElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    manifestUrl: async (_source: any, { metadataKey }, { dataSources }) => {
      const url = _source.metadata.find(
        (metadataItem: Metadata) => metadataItem.key === metadataKey
      )?.value;
      return url;
    },
    manifestVersion: async (_source: any, { metadataKey }, { dataSources }) => {
      const version = _source.metadata.find(
        (metadataItem: Metadata) => metadataItem.key === metadataKey
      )?.value;
      return version || 3;
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
  ActionElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    actions: async (_source, { input }, { dataSources }) => {
      return input ? input : [Actions.NoActions];
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
          ? Collection.Mediafiles
          : Collection.Entities;
        const relations = (
          await dataSources.CollectionAPI.getRelations(
            removePrefixFromId(parent.uuid),
            collection
          )
        ).map((rel: Metadata) => {
          return { value: rel.value || rel.key, label: rel.label };
        });
        return relations as [PanelRelation];
      } catch (e) {
        console.log('Item has no relations');
        return [];
      }
    },
    entityListElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as EntityListElement;
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
    inputField: async (parent, { type }, { dataSources }) => {
      return baseFields[type];
    },
  },
  PanelMetaData: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    key: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    unit: async (_source, { input }, { dataSources }) => {
      return input;
    },
    inputField: async (parent: any, { type }, { dataSources }) => {
      return baseFields[type];
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
    actionElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as ActionElement;
    },
    promGraphElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as PromGraphElement;
    },
    manifestViewerElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as ManifestViewerElement;
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
  PaginationLimitOptions: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  BulkOperations: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  BulkOperationCsvExportKeys: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  InputField: {
    fieldName: async (parent, { input }, { dataSources }) => {
      return input || '';
    },
    type: async (parent, _args, { dataSources }) => {
      return parent.type;
    },
    acceptedEntityTypes: async (parent, _args, { dataSources }) => {
      return parent.acceptedEntityTypes || [];
    },
    validation: async (parent, { input }, { dataSources }) => {
      return input || '';
    },
    options: async (parent, _args, { dataSources }) => {
      if (parent['options'] && parent['options'].length > 0)
        return parent['options'];

      const options = getOptionsByEntityType(
        (parent.acceptedEntityTypes as string[]) || undefined,
        dataSources
      );
      return options;
    },
  },
};
