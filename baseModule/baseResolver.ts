import {
  isMetaDataRelation,
  parseIdToGetMoreData,
  parseRelationTypesForEntityType,
  removePrefixFromId,
} from '../parsers/entity';
import {
  resolveMetadata,
  resolveMetadataItemOfPreferredLanguage,
  resolveRelations,
} from '../resolvers/entityResolver';
import {
  ActionElement,
  ActionProgress,
  ActionProgressIndicatorType,
  ActionProgressStep,
  Actions,
  ActionType,
  AdvancedFilterTypes,
  BaseLibraryModes,
  BaseRelationValuesInput,
  Collection,
  Column,
  ColumnSizes,
  Conditional,
  ContextMenuActions,
  ContextMenuElodyAction,
  ContextMenuElodyActionEnum,
  ContextMenuGeneralAction,
  ContextMenuGeneralActionEnum,
  ContextMenuLinkAction,
  DamsIcons,
  DropdownOption,
  EditStatus,
  EntitiesResults,
  Entity,
  EntityListElement,
  EntityListViewMode,
  Entitytyping,
  EntityViewElements,
  ExpandButtonOptions,
  Form,
  FormAction,
  FormFields,
  FormTab,
  GraphElement,
  IntialValues,
  KeyValueSource,
  ManifestViewerElement,
  MarkdownViewerElement,
  MediaFile,
  MediaFileElement,
  MediaFileElementTypes,
  MenuIcons,
  MenuTypeLink,
  Metadata,
  Orientations,
  PanelInfo,
  PanelLink,
  PanelMetaData,
  PanelRelation,
  PanelRelationMetaData,
  PanelThumbnail,
  Permission,
  ProgressStepStatus,
  Resolvers,
  SearchInputType,
  SingleMediaFileElement,
  SortingDirection,
  TimeUnit,
  UploadContainer,
  UploadField,
  UploadFieldSize,
  UploadFieldType,
  Validation,
  ValidationRules,
  ViewModes,
  WindowElement,
  WindowElementPanel,
} from '../../../generated-types/type-defs';
import { ContextValue } from '../types';
import { baseFields, getOptionsByEntityType } from '../sources/forms';
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import {
  getEntityId,
  setPreferredLanguageForDataSources,
} from '../helpers/helpers';
import { parseItemTypesFromInputField } from '../parsers/inputField';
import { baseTypeCollectionMapping } from '../sources/typeCollectionMapping';

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
        return await dataSources.CollectionAPI.getEntity(
          parseIdToGetMoreData(id),
          type
        );
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
          searchValue || { value: '' },
          entityType
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
    BulkOperations: async (_source, { entityType }, { dataSources }) => {
      return {
        type: entityType,
        bulkOperationOptions: {},
      } as Entity;
    },
    BulkOperationCsvExportKeys: async (_source, {}, { dataSources }) => {
      return { options: [] };
    },
    GraphData: async (_source, { id, graph }, { dataSources }) => {
      const stats = await dataSources.CollectionAPI.GetStats(id, graph);
      if (!stats) return { labels: [], dataset: { data: [] } };

      stats.labels = stats.labels.map((label: any) => {
        if (graph.timeUnit === TimeUnit.DayOfYear) {
          const date = new Date(new Date().getFullYear(), 0);
          date.setDate(label);
          return date.toLocaleString('nl-BE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });
        }
      });

      for (let i = 0; i < stats.datasets.length; i++) {
        if (stats.datasets[i].label) {
          const label = graph.dataset.labels.filter((label) =>
            new RegExp(`.*${stats.datasets[i].label}.*`).test(label)
          );
          if (label) stats.datasets[i].label = label;
        } else {
          stats.datasets[i].label = graph.dataset.labels[i];
        }
        stats.datasets[i]['borderWidth'] = 1;
      }

      return { labels: stats.labels, datasets: stats.datasets };
    },
    PermissionMappingPerEntityType: async (
      _source,
      { type },
      { dataSources }
    ) => {
      let status = await dataSources.CollectionAPI.postEntitiesFilterSoftCall(
        type
      );
      return status == '200';
    },
    PermissionMappingCreate: async (
      _source,
      { entityType },
      { dataSources }
    ) => {
      const status = await dataSources.CollectionAPI.postEntitySoftCall(
        entityType
      );
      return status == '200';
    },
    PermissionMappingEntityDetail: async (
      _source,
      { id, entityType },
      { dataSources }
    ) => {
      const collection =
        baseTypeCollectionMapping[entityType as Entitytyping] ||
        Collection.Entities;
      const edit = await dataSources.CollectionAPI.patchEntityDetailSoftCall(
        id,
        entityType
      );
      const del = await dataSources.CollectionAPI.delEntityDetailSoftCall(
        id,
        entityType
      );
      return [
        {
          permission: Permission.Canupdate,
          hasPermission: edit == '200',
        },
        {
          permission: Permission.Candelete,
          hasPermission: del == '200',
        },
      ];
    },
    GetDynamicForm: async (_source: any, _args, { dataSources }) => {
      return {} as Form;
    },
    DownloadItemsInZip: async (
      _source,
      { entities, mediafiles, basicCsv, includeAssetCsv, downloadEntity },
      { dataSources }
    ) => {
      if (!dataSources.TranscodeService)
        throw new GraphQLError(
          'Transcode service has not been setup for this Elody GraphQL instance, please add its URL to the appConfig or .env file'
        );
      let createdEntity;
      try {
        let mediafilesCsv: string[] = [];
        let assetsCsv: string[] = [];
        createdEntity = await dataSources.CollectionAPI.createEntity(
          downloadEntity,
          (downloadEntity.metadata as Metadata[]) || [],
          downloadEntity.relations as []
        );
        if (basicCsv) {
          const config = await dataSources.CollectionAPI.getConfig();
          mediafilesCsv = config.mediafile_fields;
          if (includeAssetCsv) assetsCsv = config.asset_fields;
        }
        const result = await dataSources.TranscodeService.downloadItemsInZip({
          entities: entities,
          mediafiles: mediafiles,
          csv_mediafile_columns: mediafilesCsv,
          csv_entity_columns: assetsCsv,
          download_entity: createdEntity.id,
        });
      } catch (e) {
        throw new GraphQLError(`Error whilst making zip for mediafiles: ${e}`);
      }
      return createdEntity as Entity;
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
    mutateEntityValues: async (
      _source,
      { id, formInput, collection },
      { dataSources }
    ) => {
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

      await dataSources.CollectionAPI.patchMetadata(
        id,
        formInput.metadata,
        collection
      );
      await dataSources.CollectionAPI.postRelations(
        id,
        filterEditStatus(EditStatus.New),
        collection
      );
      await dataSources.CollectionAPI.patchRelations(
        id,
        filterEditStatus(EditStatus.Changed),
        collection
      );
      await dataSources.CollectionAPI.deleteRelations(
        id,
        filterEditStatus(EditStatus.Deleted),
        collection
      );

      if (collection !== Collection.Mediafiles) {
        return await dataSources.CollectionAPI.getEntity(
          parseIdToGetMoreData(id),
          'BaseEntity',
          collection
        );
      } else return await dataSources.CollectionAPI.getMediaFile(id);
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
    generateTranscode: async (
      _source,
      { mediafileIds, transcodeType, masterEntityId },
      { dataSources }
    ) => {
      const mediafiles: Promise<MediaFile>[] = [];
      let result = 'no-transcodes';

      try {
        mediafileIds.forEach((mediafileId: string) => {
          mediafiles.push(dataSources.CollectionAPI.getMediaFile(mediafileId));
        });

        Promise.all(mediafiles).then(
          async (resolvedMediafiles: MediaFile[]) => {
            if (!dataSources.TranscodeService)
              throw new GraphQLError(
                'Transcode service has not been setup for this Elody GraphQL instance, please add its URL to the appConfig or .env file'
              );
            result = await dataSources.TranscodeService.generateTranscode(
              resolvedMediafiles,
              transcodeType,
              masterEntityId as string
            );
          }
        );

        return result;
      } catch (e) {
        throw new GraphQLError(
          `Unable to transcode mediafiles to ${transcodeType}`
        );
      }
    },
    setPrimaryMediafile: async (
      _source,
      { entityId, mediafileId },
      { dataSources }
    ) => {
      return await dataSources.CollectionAPI.setMediaPrimaire(
        entityId,
        mediafileId
      );
    },
    setPrimaryThumbnail: async (
      _source,
      { entityId, mediafileId },
      { dataSources }
    ) => {
      return await dataSources.CollectionAPI.setThumbnailPrimaire(
        entityId,
        mediafileId
      );
    },
  },
  BaseEntity: {
    intialValues: async (parent: any, _args) => {
      return parent;
    },
  },
  teaserMetadata: {
    metaData: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelMetaData;
    },
    relationMetaData: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelRelationMetaData;
    },
    thumbnail: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelThumbnail;
    },
    link: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelLink;
    },
    contextMenuActions: async (parent: unknown, {}, { dataSources }) => {
      return parent as ContextMenuActions;
    },
  },
  User: {
    intialValues: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    allowedViewModes: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    relationValues: async (parent: any, _args, { dataSources }) => {
      return resolveRelations(parent);
    },
    entityView: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    teaserMetadata: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
  },
  Tenant: {
    id: async (parent: any, _args, { dataSources }) => {
      return getEntityId(parent);
    },
    uuid: async (parent: any, _args, { dataSources }) => {
      return getEntityId(parent);
    },
    intialValues: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    allowedViewModes: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    relationValues: async (parent: any, _args, { dataSources }) => {
      return resolveRelations(parent);
    },
    entityView: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    teaserMetadata: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
  },
  MediaFileEntity: {
    id: async (parent: any) => {
      return getEntityId(parent);
    },
    uuid: async (parent: any) => {
      return getEntityId(parent);
    },
    type: async (parent: any) => 'MediaFile',
    intialValues: async (parent: any, _args) => {
      return parent;
    },
    allowedViewModes: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    relationValues: async (parent: any, _args, { dataSources }) => {
      return resolveRelations(parent);
    },
    entityView: async (parent: any, _args, { dataSources }) => {
      return parent;
    },
    teaserMetadata: async (parent: any, _args, { dataSources }) => {
      return parent;
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
  IntialValues: {
    id: async (parent: any, {}, { dataSources }) => {
      return parent._id;
    },
    keyValue: async (
      parent: any,
      {
        key,
        source,
        uuid,
        metadataKeyAsLabel,
        rootKeyAsLabel,
        containsRelationProperty,
        relationKey,
        relationEntityType
      },
      { dataSources }
    ) => {
      try {
        if (source === KeyValueSource.Metadata) {
          const preferredLanguage = dataSources.CollectionAPI.preferredLanguage;
          const metadata = await resolveMetadata(parent, [key], undefined);
          if (metadata.length > 1) {
            const hasLanguage = metadata.some((item: Metadata) => item.lang);
            const metadataValues = hasLanguage
              ? resolveMetadataItemOfPreferredLanguage(metadata, preferredLanguage)?.value
              : metadata.map((item: Metadata) => item.value).join(", ");
            return metadataValues;
          }
          return metadata[0]?.value ?? '';
        } else if (source === KeyValueSource.Root) {
          const keyParts = key.split('.');
          let value = parent;
          for (const part of keyParts) value = value?.[part];
          return value ?? '';
        } else if (source === KeyValueSource.Relations) {
          try {
            let relation: any;
            const relations = parent?.relations.filter(
              (relation: any) => relation.type === key
            );
            if (containsRelationProperty)
              relations.forEach((rel: any) => {
                if (rel[containsRelationProperty]) relation = rel;
              });
            else relation = relations?.[0];

            if (relation) {
              let type;
              if (relation.type === 'hasMediafile') {
                type = await dataSources.CollectionAPI.getMediaFile(
                  relation.key
                );
              }
              else {
                if (relationEntityType)
                  type = await dataSources.CollectionAPI.getEntity(
                    relation.key,
                    relationEntityType
                  );
                else
                  type = await dataSources.CollectionAPI.getEntity(
                    relation.key,
                    "",
                    "entities"
                  );
              }

              if (rootKeyAsLabel) return type[rootKeyAsLabel];
              return (
                type?.metadata?.find(
                  (metadata: any) => metadata.key === metadataKeyAsLabel
                )?.value || relation.key
              );
            }
          } catch {
            return parent?.[key] ?? '';
          }
        } else if (source === KeyValueSource.RelationMetadata) {
          return parent?.relations
            .find(
              (relation: any) =>
                relation.type === relationKey && relation.key === uuid
            )
            .metadata.find((metadata: any) => metadata.key === key).value;
        }
        return '';
      } catch (e) {
        return '';
      }
    },
    keyLabel: async (parent: any, { key, source }, { dataSources }) => {
      try {
        if (source === KeyValueSource.Metadata) {
          const preferredLanguage = dataSources.CollectionAPI.preferredLanguage;
          const metadata = await resolveMetadata(parent, [key], undefined);
          if (metadata.length > 1) {
            return resolveMetadataItemOfPreferredLanguage(
              metadata,
              preferredLanguage
            )?.label;
          }
          return metadata[0]?.label ?? '';
        }
      } catch (e) {
        return '';
      }
    },
    relationMetadata: async (parent: any, { type }, { dataSources }) => {
      const relation = parent?.relations.find(
        (relation: any) => relation.type === type
      );
      return (await dataSources.CollectionAPI.getEntityById(
        relation.key
      )) as IntialValues;
    },
  },
  AllowedViewModes: {
    viewModes: async (parent, { input }, { dataSources }) => {
      return input ? input : [ViewModes.ViewModesList];
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
  SingleMediaFileElement: {
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
  GraphElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    type: async (_source, { input }, { dataSources }) => {
      return input;
    },
    datasource: async (_source, { input }, { dataSources }) => {
      return input;
    },
    dataset: async (_source, { input }, { dataSources }) => {
      return {
        labels: input.labels,
        filter: input.filter,
      };
    },
    timeUnit: async (_source, { input }, { dataSources }) => {
      return input;
    },
    datapoints: async (_source, { input }, { dataSources }) => {
      return input;
    },
    convert_to: async (_source, { input }, { dataSources }) => {
      return input;
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
      return input ? input : 'undefined';
    },
    customQuery: async (parent, { input }, { dataSources }) => {
      return input ? input : 'undefined';
    },
    customQueryFilters: async (parent, { input }, { dataSources }) => {
      return input ? input : 'undefined';
    },
    searchInputType: async (parent, { input }, { dataSources }) => {
      return input ? input : 'AdvancedInputType';
    },
    entityTypes: async (parent: any, { input }, { dataSources }) => {
      return input || [];
    },
    viewMode: async (parent: any, { input }, { dataSources }) => {
      return input || EntityListViewMode.Library;
    },
    baseLibraryMode: async (parent: any, { input }, { dataSources }) => {
      return input ? input : BaseLibraryModes.NormalBaseLibrary;
    },
    entityListElement: async (parent: any, {}, { dataSources }) => {
      return parent as EntityListElement;
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
      const value = _source.metadata.find(
        (metadataItem: Metadata) => metadataItem.key === metadataKey
      )?.value;
      return value;
    },
    manifestVersion: async (_source: any, { metadataKey }, { dataSources }) => {
      const value = _source.metadata.find(
        (metadataItem: Metadata) => metadataItem.key === metadataKey
      )?.value;
      return value || 3;
    },
  },
  MarkdownViewerElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    markdownContent: async (_source: any, { metadataKey }, { dataSources }) => {
      const content = _source.metadata.filter(
        (metadataItem: Metadata) => metadataItem.key === metadataKey
      );

      return resolveMetadataItemOfPreferredLanguage(
        content,
        dataSources.CollectionAPI.preferredLanguage
      )?.value;
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
          ? Collection.Entities
          : Collection.Mediafiles;
        const relations = (
          await dataSources.CollectionAPI.getRelations(
            removePrefixFromId(parent.uuid),
            collection
          )
        ).map((rel: Metadata) => {
          return { value: rel.value || rel.key, label: rel.label || '' };
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
    linkText: async (_source, { input }, { dataSources }) => {
      return input;
    },
    inputField: async (parent: any, { type }, { dataSources }) => {
      return baseFields[type];
    },
    showOnlyInEditMode: async (_source, { input }, { dataSources }) => {
      return input != undefined ? input : false;
    },
  },
  UploadContainer: {
    uploadFlow: async (_source, { input }, { dataSources }) => {
      return input;
    },
    uploadMetadata: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelMetaData;
    },
    uploadField: async (parent: unknown, {}, { dataSources }) => {
      return parent as UploadField;
    },
  },
  UploadField: {
    label: async (_source, { input }, { dataSources }) => {
      return input || '';
    },
    uploadFieldSize: async (parent: any, { input }, { dataSources }) => {
      return input || UploadFieldSize.Big;
    },
    inputField: async (parent: any, { type }, { dataSources }) => {
      return baseFields[type];
    },
    dryRunUpload: async (parent: any, { input }, { dataSources }) => {
      return input || false;
    },
    uploadFieldType: async (parent: any, { input }, { dataSources }) => {
      return input || UploadFieldType.Batch;
    },
  },
  FormAction: {
    label: async (_source, { input }, { dataSources }) => {
      return input || '';
    },
    icon: async (_source, { input }, { dataSources }) => {
      return input || DamsIcons.NoIcon;
    },
    actionType: async (_source, { input }, { dataSources }) => {
      return input || ActionType.Submit;
    },
    actionQuery: async (_source, { input }, { dataSources }) => {
      return input || '';
    },
    creationType: async (_source, { input }, { dataSources }) => {
      return input || Entitytyping.BaseEntity;
    },
    showsFormErrors: async (_source, { input }, { dataSources }) => {
      return input || false;
    },
    actionProgressIndicator: async (_source, _args, { dataSources }) => {
      return {} as ActionProgress;
    },
  },
  ActionProgress: {
    type: async (_source, { input }, { dataSources }) => {
      return input || ActionProgressIndicatorType.Spinner;
    },
    step: async (_source, _args, { dataSources }) => {
      return {} as ActionProgressStep;
    },
  },
  ActionProgressStep: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    stepType: async (_source, { input }, { dataSources }) => {
      return input;
    },
    status: async (_source, _args, { dataSources }) => {
      return ProgressStepStatus.Empty;
    },
  },
  PanelRelationMetaData: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    key: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    unit: async (_source, { input }, { dataSources }) => {
      return input;
    },
    linkText: async (_source, { input }, { dataSources }) => {
      return input;
    },
    inputField: async (parent: any, { type }, { dataSources }) => {
      return baseFields[type];
    },
    showOnlyInEditMode: async (_source, { input }, { dataSources }) => {
      return input ? input : false;
    },
  },
  PanelThumbnail: {
    key: async (_source, { input }, { dataSources }) => {
      return input;
    },
    customUrl: async (_source, { input }, { dataSources }) => {
      return input;
    },
    filename: async (
      _source: any,
      { input, fromMediafile },
      { dataSources }
    ) => {
      if (!fromMediafile) return input || '';
      try {
        const mediafileRelations: any[] = _source.relations.filter(
          (relation: any) => relation.type === 'hasMediafile'
        );
        const thumbnailMediafile: any =
          mediafileRelations.find(
            (mediafile: any) => mediafile.is_primary_thumbnail
          ) || mediafileRelations[0];
        const thumbnailId: string = thumbnailMediafile.key;
        const mediafile = await dataSources.CollectionAPI.getMediaFile(
          thumbnailId
        );

        return mediafile.transcode_filename || mediafile.filename;
      } catch {
        return undefined;
      }
    },
    width: async (_source, { input }, { dataSources }) => {
      return input;
    },
    height: async (_source, { input }, { dataSources }) => {
      return input;
    },
  },
  PanelLink: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    key: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    linkText: async (_source, { input }, { dataSources }) => {
      return input;
    },
    linkIcon: async (_source, { input }, { dataSources }) => {
      return input;
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
    singleMediaFileElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as SingleMediaFileElement;
    },
    windowElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as WindowElement;
    },
    actionElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as ActionElement;
    },
    graphElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as GraphElement;
    },
    manifestViewerElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as ManifestViewerElement;
    },
    markdownViewerElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as MarkdownViewerElement;
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
      { label, entityType, icon, isLoggedIn, typeLink, requiresAuth },
      { dataSources }
    ) => {
      return {
        label,
        entityType,
        icon,
        isLoggedIn,
        typeLink,
        requiresAuth,
      };
    },
  },
  MenuItem: {
    label: async (parent, {}, { dataSources }) => {
      return parent.label;
    },
    entityType: async (parent, {}, { dataSources }) => {
      return parent.entityType as Entitytyping;
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
    requiresAuth: async (parent, {}, { dataSources }) => {
      return parent.requiresAuth as boolean;
    },
  },
  DropzoneEntityToCreate: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  SortOptions: {
    options: async (parent, { input }, { dataSources }) => {
      const baseSortOptions: DropdownOption[] = [
        {
          icon: DamsIcons.NoIcon,
          label: 'metadata.labels.date-updated',
          value: 'date_updated',
        },
        {
          icon: DamsIcons.NoIcon,
          label: 'metadata.labels.last-editor',
          value: 'last_editor',
        },
      ];
      return [...input, ...baseSortOptions];
    },
    isAsc: async (parent, { input }, { dataSources }) => {
      return input ? input : SortingDirection.Asc;
    },
  },
  BulkOperationOptions: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  PaginationLimitOptions: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  BulkOperationCsvExportKeys: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  FormTab: {
    formFields: async (parent: any, {}, { dataSources }) => {
      return parent as FormFields;
    },
  },
  Form: {
    label: async (parent: any, { input }, { dataSources }) => {
      return input || '';
    },
    formFields: async (parent: any, {}, { dataSources }) => {
      return parent as FormFields;
    },
    formTab: async (parent: any, {}, { dataSources }) => {
      return parent as FormTab;
    },
  },
  FormFields: {
    metaData: async (parent: any, {}, { dataSources }) => {
      return parent as PanelMetaData;
    },
    uploadContainer: async (parent: any, {}, { dataSources }) => {
      return parent as UploadContainer;
    },
    action: async (parent: any, {}, { dataSources }) => {
      return parent as FormAction;
    },
  },
  InputField: {
    fieldName: async (parent, { input }, { dataSources }) => {
      return input || '';
    },
    acceptedEntityTypes: async (parent, _args, { dataSources }) => {
      return parent.acceptedEntityTypes || [];
    },
    type: async (parent, _args, { dataSources }) => {
      return parent.type;
    },
    validation: async (parent, { input }, { dataSources }) => {
      return input as Validation;
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
    relationType: async (parent, _args, { dataSources }) => {
      const entityType: Entitytyping[] = parseItemTypesFromInputField(
        parent
      ) as Entitytyping[];
      if (!entityType) return '';
      return parseRelationTypesForEntityType(entityType[0]).relationType;
    },
    fromRelationType: async (parent, _args, { dataSources }) => {
      const entityType: Entitytyping[] = parseItemTypesFromInputField(
        parent
      ) as Entitytyping[];
      if (!entityType) return '';
      return parseRelationTypesForEntityType(entityType[0]).fromRelationType;
    },
    advancedFilterInputForSearchingOptions: async (
      parent,
      _args,
      { dataSources }
    ) => {
      const emptyFilterInput = { type: AdvancedFilterTypes.Text, value: '*' };
      return parent.advancedFilterInputForSearchingOptions || emptyFilterInput;
    },
    autoSelectable: async (parent, _args, { dataSources }) => {
      return parent.autoSelectable || false;
    },
    disabled: async (parent, _args, { dataSources }) => {
      return parent.disabled || false;
    },
    canCreateEntityFromOption: async (parent, _args, { dataSources }) => {
      return parent.canCreateEntityFromOption || false;
    },
    metadataKeyToCreateEntityFromOption: async (
      parent,
      _args,
      { dataSources }
    ) => {
      return parent.metadataKeyToCreateEntityFromOption || '';
    },
    fieldKeyToSave: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
  },
  Validation: {
    value: async (parent, _args, { dataSources }) => {
      return parent.value as ValidationRules[];
    },
    required_if: async (parent, _args, { dataSources }) => {
      return parent.required_if as Conditional;
    },
    available_if: async (parent, _args, { dataSources }) => {
      return parent.available_if as Conditional;
    },
  },
  Conditional: {
    value: async (parent, _args, { dataSources }) => {
      return parent.value as string;
    },
    field: async (parent, _args, { dataSources }) => {
      return parent.field;
    },
    ifAnyValue: async (parent, _args, { dataSources }) => {
      return parent.ifAnyValue || false;
    },
  },
  ContextMenuActions: {
    doLinkAction: async (parent: unknown, {}, { dataSources }) => {
      return parent as ContextMenuLinkAction;
    },
    doGeneralAction: async (parent: unknown, {}, { dataSources }) => {
      return parent as ContextMenuGeneralAction;
    },
    doElodyAction: async (parent: unknown, {}, { dataSources }) => {
      return parent as ContextMenuElodyAction;
    },
  },
  ContextMenuLinkAction: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    icon: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
  },
  ContextMenuElodyAction: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    action: async (_source, { input }, { dataSources }) => {
      return input as ContextMenuElodyActionEnum;
    },
    icon: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
  },
  ContextMenuGeneralAction: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    action: async (_source, { input }, { dataSources }) => {
      return input as ContextMenuGeneralActionEnum;
    },
    icon: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
  },
};
