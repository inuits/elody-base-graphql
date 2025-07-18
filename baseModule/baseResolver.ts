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
  resolveAdvancedEntities,
  resolveSimpleEntities,
} from '../resolvers/entitiesResolver';
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
  BreadCrumbRoute,
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
  DeepRelationsFetchStrategy,
  DropdownOption,
  EditMetadataButton,
  EditStatus,
  EndpointInformation,
  EntitiesResults,
  Entity,
  EntityListElement,
  EntityListViewMode,
  Entitytyping,
  EntityViewElements,
  EntityViewerElement,
  ExpandButtonOptions,
  FetchDeepRelations,
  Form,
  FormAction,
  FormFields,
  FormTab,
  GraphElement,
  HiddenField,
  IntialValues,
  KeyValueSource,
  ListItemCoverageTypes,
  ManifestViewerElement,
  MapElement,
  HierarchyListElement,
  MapMetadata,
  GeoJsonFeature,
  MapTypes,
  MarkdownViewerElement,
  Maybe,
  MediaFile,
  MediaFileElement,
  MediaFileElementTypes,
  MediaFileEntity,
  MenuIcons,
  MenuTypeLink,
  Metadata,
  Orientations,
  PanelInfo,
  PanelLink,
  PanelMetaData,
  PanelMetadataValueTooltipInput,
  PanelRelation,
  PanelRelationMetaData,
  PanelRelationRootData,
  PanelThumbnail,
  Permission,
  PermissionRequestInfo,
  PreviewTypes,
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
  WindowElementLayout,
  WysiwygElement,
  type TaggingExtensionConfiguration,
  ConfigItem,
  ColumnList,
  AdvancedFilters,
} from '../../../generated-types/type-defs';
import { ContextValue } from '../types';
import { baseFields } from '../sources/forms';
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import {
  normalizeCoordinatesForHeatmap,
  normalizeWeightForHeatmap,
  getEntityId,
  getRelationsByType,
  setPreferredLanguageForDataSources,
} from '../helpers/helpers';
import { parseItemTypesFromInputField } from '../parsers/inputField';
import {
  resolveIntialValueDerivatives,
  resolveIntialValueLocation,
  resolveIntialValueMetadata,
  resolveIntialValueMetadataOrRelation,
  resolveIntialValueRelationMetadata,
  resolveIntialValueRelationRootdata,
  resolveIntialValueRelations,
  resolveIntialValueRoot,
  resolveIntialValueTechnicalMetadata,
} from '../resolvers/intialValueResolver';
import {
  prepareLocationFieldForMapData,
  prepareMetadataFieldForMapData,
  prepareRelationFieldForMapData,
} from '../resolvers/mapComponentResolver';

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
        preferredLanguage,
      },
      { dataSources }
    ): Promise<Maybe<EntitiesResults>> => {
      if (preferredLanguage)
        setPreferredLanguageForDataSources(dataSources, preferredLanguage);

      const entitiesResolverMapping: Partial<
        Record<SearchInputType, () => Promise<EntitiesResults>>
      > = {
        [SearchInputType.AdvancedInputType]: async () =>
          await resolveAdvancedEntities(
            dataSources,
            type as Entitytyping | undefined,
            advancedFilterInputs,
            limit as number | undefined,
            skip as number | undefined,
            searchValue
          ),
        [SearchInputType.SimpleInputtype]: async () =>
          await resolveSimpleEntities(dataSources),
      };

      return entitiesResolverMapping[searchInputType!!]!!();

      // const typeFilters = advancedFilterInputs.filter(
      //   (advancedFilter) => advancedFilter.type === AdvancedFilterTypes.Type
      // );
      // let entityTypes =
      //   typeFilters.length <= 0 ? [type!!] : typeFilters.map((filter: any) => filter.value);
      // if (!Array.isArray(entityTypes)) entityTypes = [entityTypes];
      // for (const entityType of entityTypes as Entitytyping[]) {
      //   let entitiesIteration: EntitiesResults = {
      //     results: [],
      //     sortKeys: [],
      //     count: 0,
      //     limit: 0,
      //   };
      //   const filtersIteration =
      //     entityTypes.length <= 1
      //       ? advancedFilterInputs
      //       : determineAdvancedFiltersForIteration(
      //           entityType,
      //           advancedFilterInputs
      //         );
      //   if (
      //     advancedFilterInputs?.length >= 0 &&
      //     (searchInputType === SearchInputType.AdvancedInputMediaFilesType ||
      //       entityType === Entitytyping.Mediafile)
      //   ) {
      //     entitiesIteration =
      //       await dataSources.CollectionAPI.GetAdvancedEntities(
      //         Entitytyping.Mediafile,
      //         limit || 20,
      //         skip || 0,
      //         filtersIteration,
      //         searchValue || { value: '' }
      //       );
      //   } else if (
      //     searchInputType === SearchInputType.AdvancedInputType &&
      //     advancedFilterInputs?.length
      //   ) {
      //     entitiesIteration =
      //       await dataSources.CollectionAPI.GetAdvancedEntities(
      //         entityType,
      //         limit || 20,
      //         skip || 0,
      //         filtersIteration,
      //         searchValue || { value: '' }
      //       );
      //   } else if (searchInputType === SearchInputType.AdvancedInputType) {
      //     entitiesIteration = await dataSources.CollectionAPI.getEntities(
      //       limit || 20,
      //       skip || 0,
      //       searchValue || { value: '' },
      //       entityType
      //     );
      //   }
      //   if (entities && entitiesIteration) {
      //     entities.results!!.push(...entitiesIteration.results!!);
      //     entities.sortKeys!!.push(...(entitiesIteration.sortKeys || []));
      //     entities.count!! += entitiesIteration.count!!;
      //     entities.limit!! += entitiesIteration.limit!!;
      //   }
      // }
      // return entities!!;
    },
    EntitiesByAdvancedSearch: async (
      _source,
      {
        q = '*',
        query_by = '',
        filter_by = '',
        query_by_weights = '',
        sort_by = '',
        limit = 25,
        per_page = 25,
        facet_by = '',
      },
      { dataSources }
    ): Promise<EntitiesResults> => {
      return dataSources.CollectionAPI.getEntitiesByAdvancedSearch(
        q as string,
        query_by as string,
        filter_by as string,
        query_by_weights as string,
        sort_by as string,
        limit as number,
        per_page as number,
        facet_by as string
      );
    },
    EntitiesByAiSearch: async (
      _source,
      { input = '' },
      { dataSources }
    ): Promise<EntitiesResults> => {
      return dataSources.CollectionAPI.getEntitiesByAiSearch(input as string);
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
    PreviewComponents: async (_source, { entityType }, { dataSources }) => {
      return {
        type: entityType,
        previewComponent: {},
      } as Entity;
    },
    PreviewElement: async (_source: any, _args, { dataSources }) => {
      return {} as ColumnList;
    },
    BulkOperations: async (_source, { entityType }, { dataSources }) => {
      return {
        type: entityType,
        bulkOperationOptions: {},
      } as Entity;
    },
    CustomBulkOperations: async (_source, {}, { dataSources }) => {
      return {
        bulkOperationOptions: {},
      } as Entity;
    },
    BulkOperationCsvExportKeys: async (
      _source,
      { entityType },
      { dataSources }
    ) => {
      return await dataSources.CollectionAPI.GetCsvExportKeysPerEntityType(
        entityType
      );
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
    PermissionMapping: async (
      _source,
      { entities = [] },
      { dataSources, customPermissions = [] }
    ) => {
      let permissionsMappings: {
        [key: string]: { [permission: string]: boolean };
      } = {};
      let promises: Promise<void>[] = [];

      for (const entity of entities as Entitytyping[]) {
        const permissions: { [permission: string]: boolean } = {
          [Permission.Canread]: false,
          [Permission.Cancreate]: false,
        };
        permissionsMappings[entity] = permissions;

        const canReadPermission: any =
          dataSources.CollectionAPI.postEntitiesFilterSoftCall(entity).then(
            (result) => {
              permissionsMappings[entity][Permission.Canread] = result == '200';
            }
          );

        const canCreatePermission: any =
          dataSources.CollectionAPI.postEntitySoftCall(entity).then(
            (result) => {
              permissionsMappings[entity][Permission.Cancreate] =
                result == '200';
            }
          );

        promises.push(canReadPermission);
        promises.push(canCreatePermission);
      }

      await Promise.all(promises);
      return permissionsMappings;
    },
    AdvancedPermission: async (
      _source,
      { permission, parentEntityId, childEntityId },
      { dataSources, customPermissions }
    ) => {
      const permissionConfig: PermissionRequestInfo =
        customPermissions[permission];
      if (!permissionConfig) return false;

      let response: any;
      if (permissionConfig.datasource === 'CollectionAPI')
        response = await dataSources.CollectionAPI.checkAdvancedPermission(
          permissionConfig,
          parentEntityId,
          childEntityId
        );
      if (permissionConfig.datasource === 'GraphqlAPI')
        response =
          await dataSources.GraphqlAPI.checkAdvancedPermission(
            permissionConfig
          );
      return response;
    },
    PermissionMappingPerEntityType: async (
      _source,
      { type },
      { dataSources }
    ) => {
      let status =
        await dataSources.CollectionAPI.postEntitiesFilterSoftCall(type);
      return status == '200';
    },
    PermissionMappingCreate: async (
      _source,
      { entityType },
      { dataSources }
    ) => {
      const status =
        await dataSources.CollectionAPI.postEntitySoftCall(entityType);
      return status == '200';
    },
    CustomFormattersSettings: async (_source, _, { customFormatters }) => {
      return customFormatters;
    },
    PermissionMappingEntityDetail: async (
      _source,
      { id, entityType },
      { dataSources }
    ) => {
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
    BulkOperationsRelationForm: async (
      _source: any,
      _args,
      { dataSources }
    ) => {
      return {} as WindowElement;
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
          download_entity_id: createdEntity.id,
          download_entity_title: createdEntity.metadata.filter(
            (metadata: Metadata) => metadata.key === 'title'
          )[0].value,
        });
      } catch (e) {
        throw new GraphQLError(
          `Error while making a downloadable zip for mediafiles: ${e}`
        );
      }
      return createdEntity as Entity;
    },
    GenerateOcrWithAsset: async (
      _source,
      { assetId, operation, language },
      { dataSources }
    ) => {
      if (!dataSources.OcrService)
        throw new GraphQLError(
          'OCR service has not been setup for this Elody GraphQL instance, please add its URL to the appConfig or .env file'
        );
      try {
        operation.push('txt');
        const response = await dataSources.OcrService.generateOcrWithAsset(
          assetId,
          operation,
          language
        );
        return {
          status: 200,
          message: response,
        };
      } catch (e) {
        throw new GraphQLError(`Error whilst making OCR of mediafiles: ${e}`);
      }
    },
    FetchMediafilesOfEntity: async (
      _source,
      { entityIds },
      { dataSources }
    ) => {
      const mediafiles: MediaFileEntity[] = [];
      for (const index in entityIds) {
        const response = await dataSources.CollectionAPI.getMediafiles(
          entityIds[index]
        );
        mediafiles.push(...response.results);
      }
      return mediafiles;
    },
    GetEntityDetailContextMenuActions: async (
      _source,
      _args,
      { dataSources }
    ) => {
      return {} as ContextMenuActions;
    },
    GeoFilterForMap: async (
      _source,
      _args,
      { dataSources }
    ) => {
      return {} as AdvancedFilters;
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
      { id, formInput, collection, preferredLanguage },
      { dataSources }
    ) => {
      if (preferredLanguage)
        setPreferredLanguageForDataSources(dataSources, preferredLanguage);
      const filterEditStatus = (
        excludeEditStatus: EditStatus
      ): BaseRelationValuesInput[] => {
        return formInput.relations
          .filter(
            (relationInput) => relationInput.editStatus !== excludeEditStatus
          )
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

      const mutateRelations = async () => {
        if (formInput.relations.length <= 0) return;
        await dataSources.CollectionAPI.putRelations(
          id,
          filterEditStatus(EditStatus.Deleted),
          collection
        );
      };

      const mutateMetadata = async () => {
        for (const metadata of formInput.metadata)
          if (Array.isArray(metadata.value) && metadata.value.length === 0)
            metadata.value = '';

        await dataSources.CollectionAPI.patchMetadata(
          id,
          formInput.metadata,
          collection
        );
      };

      if (formInput.updateOnlyRelations) {
        await mutateRelations();
      } else {
        await mutateMetadata();
        await mutateRelations();
      }

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
    bulkDeleteEntities: async (
      _source,
      { ids, path, deleteEntities, skipItemsWithRelationDuringBulkDelete },
      { dataSources }
    ) => {
      return dataSources.CollectionAPI.bulkDeleteEntities(
        ids,
        path,
        deleteEntities ?? {},
        (skipItemsWithRelationDuringBulkDelete as string[]) ?? []
      );
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
    updateMetadataWithCsv: async (
      _source,
      { entityType, csv },
      { dataSources }
    ) => {
      return await dataSources.CollectionAPI.updateMetadataWithCsv(
        entityType,
        csv
      );
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
    relationRootData: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelRelationRootData;
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
  Job: {
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
        containsRelationPropertyKey,
        containsRelationPropertyValue,
        relationKey,
        relationEntityType,
        keyOnMetadata,
        formatter = '',
        technicalOrigin,
      },
      { dataSources, customFormatters }
    ) => {
      try {
        const resolveObject: { [key: string]: Function } = {
          metadata: () =>
            resolveIntialValueMetadata(
              dataSources,
              parent,
              key,
              keyOnMetadata,
              formatter
            ),
          root: () =>
            resolveIntialValueRoot(
              dataSources,
              parent,
              key,
              formatter,
              customFormatters
            ),
          relations: () =>
            resolveIntialValueRelations(
              dataSources,
              parent,
              key,
              metadataKeyAsLabel as string,
              rootKeyAsLabel as string,
              containsRelationPropertyKey as string,
              containsRelationPropertyValue as string,
              relationEntityType as string,
              formatter as string,
              customFormatters
            ),
          relationMetadata: () =>
            resolveIntialValueRelationMetadata(
              parent,
              key,
              uuid as string,
              relationKey as string,
              formatter as string
            ),
          relationRootdata: () =>
            resolveIntialValueRelationRootdata(
              parent,
              key,
              uuid as string,
              relationKey as string,
              formatter as string
            ),
          technicalMetadata: () =>
            resolveIntialValueTechnicalMetadata(parent, key),
          metadataOrRelation: () =>
            resolveIntialValueMetadataOrRelation(
              dataSources,
              parent,
              key,
              relationKey as string,
              formatter as string,
              customFormatters
            ),
          derivatives: () =>
            resolveIntialValueDerivatives(
              parent,
              key,
              technicalOrigin as string,
              dataSources
            ),
          location: () =>
            resolveIntialValueLocation(
              dataSources,
              parent,
              key,
              keyOnMetadata,
              formatter
            ),
        };

        const returnObject = await resolveObject[source]();
        return returnObject !== undefined ? returnObject : '';
      } catch (e) {
        console.log(e);
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
      return input ? input : [{ viewMode: ViewModes.ViewModesList }];
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
  MapElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    center: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? (input as string) : '';
    },
    type: async (_source, { input }, { dataSources }) => {
      return input as string;
    },
    metaData: async (parent: unknown, {}, { dataSources }) => {
      return parent as PanelMetaData;
    },
    mapMetadata: async (parent: unknown, {}, { dataSources }) => {
      return parent as MapMetadata;
    },
    geoJsonFeature: async (parent: unknown, {}, { dataSources }) => {
      return parent as GeoJsonFeature;
    },
    config: async (_source, { input }, { dataSources }) => {
      return input as ConfigItem[];
    },
  },
  HierarchyListElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    isCollapsed: async (_source, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    hierarchyRelationList: async (_source, { input }, { dataSources }) => {
      return input || [];
    },
    customQuery: async (_source, { input }, { dataSources }) => {
      return input || '';
    },
    can: async (_source, { input }, { dataSources }) => {
      return input as string[];
    },
    entityTypeAsCenterPoint: async (_source, { input }, { dataSources }) => {
      return input as Entitytyping;
    },
    centerCoordinatesKey: async (_source, { input }, { dataSources }) => {
      return input || '';
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
    enableAdvancedFilters: async (_source, { input }, { dataSources }) => {
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
    filtersNeedContext: async (parent, { input }, { dataSources }) => {
      return input ? input : [];
    },
    customQueryEntityPickerList: async (parent, { input }, { dataSources }) => {
      return input ? input : 'undefined';
    },
    customQueryEntityPickerListFilters: async (
      parent,
      { input },
      { dataSources }
    ) => {
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
    enableNavigation: async (parent: any, { input }, { dataSources }) => {
      return input !== undefined ? input : true;
    },
    baseLibraryMode: async (parent: any, { input }, { dataSources }) => {
      return input ? input : BaseLibraryModes.NormalBaseLibrary;
    },
    entityListElement: async (parent: any, {}, { dataSources }) => {
      return parent as EntityListElement;
    },
    customBulkOperations: async (parent, { input }, { dataSources }) => {
      return input ? input : 'undefined';
    },
    fetchDeepRelations: async (parent: unknown, {}, { dataSources }) => {
      return parent as FetchDeepRelations;
    },
    can: async (parent, { input }, { dataSources }) => {
      return input || [];
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
  EntityViewerElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
    },
    entityId: async (
      _source: any,
      { relationType, metadataKey },
      { dataSources }
    ) => {
      try {
        if (relationType)
          return getRelationsByType(relationType, _source.relations)[0].key;
        return '';
      } catch {
        return '';
      }
    },
  },
  WysiwygElement: {
    label: async (_source, { input }, { dataSources }) => {
      return input;
    },
    metadataKey: async (_source, { input }, { dataSources }) => {
      return input;
    },
    extensions: async (_source, { input }, { dataSources }) => {
      return input;
    },
    taggingConfiguration: async (_source, {}, { dataSources }) => {
      return {} as TaggingExtensionConfiguration;
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
    layout: async (_source, { input }, { dataSources }) => {
      return input ? input : WindowElementLayout.Vertical;
    },
    expandButtonOptions: async (parent: unknown, {}, { dataSources }) => {
      return parent as ExpandButtonOptions;
    },
    editMetadataButton: async (_source, { input }, { dataSources }) => {
      return input as EditMetadataButton;
    },
    lineClamp: async (_source, { input }, { dataSources }) => {
      return input ? input : 'no-input';
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
    canBeMultipleColumns: async (_source, { input }, { dataSources }) => {
      return input;
    },
    panelType: async (_source, { input }, { dataSources }) => {
      return input;
    },
    bulkData: async (
      _source: { [key: string]: any },
      { bulkDataSource },
      { dataSources }
    ) => {
      return _source[bulkDataSource];
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
    wysiwygElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as WysiwygElement;
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
    hiddenField: async (_source, { input }, { dataSources }) => {
      return input as HiddenField;
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
    tooltip: async (_source, { input }, { dataSources }) => {
      return input ?? '';
    },
    valueTooltip: async (_source, { input }, { dataSources }) => {
      return (input ?? {}) as PanelMetadataValueTooltipInput;
    },
    lineClamp: async (_source, { input }, { dataSources }) => {
      return input ?? '';
    },
    copyToClipboard: async (_source, { input }, { dataSources }) => {
      return input ?? false;
    },
    customValue: async (_source, { input }, { dataSources }) => {
      return input ?? '';
    },
    can: async (_source, { input }, { dataSources }) => {
      return input ?? [];
    },
    isMultilingual: async (_source, { input }, { dataSources }) => {
      return input ?? false;
    },
    valueTranslationKey: async (_source, { input }, { dataSources }) => {
      return input ?? '';
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
    extraMediafileType: async (parent: any, { input }, { dataSources }) => {
      return input as string;
    },
    uploadFieldType: async (parent: any, { input }, { dataSources }) => {
      return input || UploadFieldType.Batch;
    },
    templateCsvs: async (parent: any, { input }, { dataSources }) => {
      return input as string[];
    },
    infoLabelUrl: async (parent: any, { input }, { dataSources }) => {
      return input as string;
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
    endpointInformation: async (_source, { input }, { dataSources }) => {
      return input as EndpointInformation;
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
  PanelRelationRootData: {
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
        const mediafile =
          await dataSources.CollectionAPI.getMediaFile(thumbnailId);

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
    entityViewerElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as EntityViewerElement;
    },
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
    mapElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as MapElement;
    },
    wysiwygElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as WysiwygElement;
    },
    hierarchyListElement: async (parent: unknown, {}, { dataSources }) => {
      return parent as HierarchyListElement;
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
      { label, entityType, icon, isLoggedIn, typeLink, requiresAuth, can },
      { dataSources }
    ) => {
      return {
        label,
        entityType,
        icon,
        isLoggedIn,
        typeLink,
        requiresAuth,
        can,
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
    can: async (parent, {}, { dataSources }) => {
      return parent.can as string[];
    },
  },
  DropzoneEntityToCreate: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  SortOptions: {
    options: async (
      parent,
      { input, excludeBaseSortOptions },
      { dataSources }
    ) => {
      let baseSortOptions: DropdownOption[] = [];
      if (!excludeBaseSortOptions)
        baseSortOptions = [
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
      const default_sorting = input.filter((option) => option.primary);
      return [
        ...default_sorting,
        ...baseSortOptions,
        ...input.filter((option) => !option.primary),
      ];
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
  DeleteQueryOptions: {
    deleteEntityLabel: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
    customQueryDeleteRelations: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
    customQueryDeleteRelationsFilters: async (
      parent,
      { input },
      { dataSources }
    ) => {
      return input as string;
    },
    customQueryEntityTypes: async (parent, { input }, { dataSources }) => {
      return input as Entitytyping[];
    },
    deleteRelationsLabel: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
    customQueryBlockingRelations: async (
      parent,
      { input },
      { dataSources }
    ) => {
      return input as string;
    },
    customQueryBlockingRelationsFilters: async (
      parent,
      { input },
      { dataSources }
    ) => {
      return input as string;
    },
    customQueryBlockingEntityTypes: async (
      parent,
      { input },
      { dataSources }
    ) => {
      return input as Entitytyping[];
    },
    blockingRelationsLabel: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
  },
  MapMetadata: {
    value: async (
      parent: any,
      { key, source, defaultValue, relationKey },
      { dataSources }
    ) => {
      const resolveObject: { [key: string]: Function } = {
        metadata: () =>
          prepareMetadataFieldForMapData(
            parent.metadata,
            key,
            defaultValue
          ),
        location: () =>
          prepareLocationFieldForMapData(
            parent.location,
            key,
            defaultValue,
          ),
        relations: () =>
          prepareRelationFieldForMapData(
            dataSources,
            parent.relations,
            key,
            relationKey
          ),
      };
      return (await resolveObject[source]()) || '';
    },
  },
  GeoJsonFeature: {
    value: async (
      parent: any,
      { id, weight, coordinates },
      { dataSources }
    ) => {
      const resolveObject: { [key: string]: Function } = {
        root: (currentKey: string, currentDefaultValue: any) =>
            resolveIntialValueRoot(
                dataSources,
                parent,
                currentKey,
                null,
                undefined
            ),
        metadata: (currentKey: string, currentDefaultValue: any) =>
            prepareMetadataFieldForMapData(
                parent.metadata,
                currentKey,
                currentDefaultValue
            ),
        location: (currentKey: string, currentDefaultValue: any) =>
            prepareLocationFieldForMapData(
                parent.location,
                currentKey,
                currentDefaultValue
            ),
      };

      const coordinatesValue =  (await resolveObject[coordinates.source](coordinates.key, coordinates.defaultValue)) || '';
      const idValue =  (await resolveObject[id.source](id.key, id.defaultValue)) || '';
      const weightValue =  (await resolveObject[weight.source](weight.key, weight.defaultValue)) || '';

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: normalizeCoordinatesForHeatmap(coordinatesValue),
        },
        properties: {
          id: idValue,
          weight: normalizeWeightForHeatmap(weightValue), // value between 0 and 1
        },
      };
    },
  },
  FetchDeepRelations: {
    deepRelationsFetchStrategy: async (parent, { input }, { dataSources }) => {
      return input as DeepRelationsFetchStrategy;
    },
    entityType: async (parent, { input }, { dataSources }) => {
      return input as Entitytyping;
    },
    routeConfig: async (parent, { input }, { dataSources }) => {
      return input as BreadCrumbRoute[];
    },
    amountOfRecursions: async (parent, { input }, { dataSources }) => {
      return input as number;
    },
  },
  PaginationLimitOptions: {
    options: async (parent, { input }, { dataSources }) => {
      return input;
    },
  },
  PreviewComponent: {
    type: async (parent, { input }, { dataSources }) => {
      return input as PreviewTypes;
    },
    title: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
    listItemsCoverage: async (parent, { input }, { dataSources }) => {
      return input as ListItemCoverageTypes;
    },
    previewQuery: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
    openByDefault: async (parent, { input }, { dataSources }) => {
      return input !== undefined ? input : false;
    },
    metadataPreviewQuery: async (parent, { input }, { dataSources }) => {
      return input as string;
    },
    showCurrentPreviewFlow: async (parent, { input }, { dataSources }) => {
      return input !== undefined ? input : true;
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
    infoLabel: async (parent: any, { input }, { dataSources }) => {
      return input || '';
    },
    modalStyle: async (parent: any, { input }, { dataSources }) => {
      return input;
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
    type: async (parent, _args, { dataSources }) => {
      return parent.type;
    },
    validation: async (parent, { input }, { dataSources }) => {
      return input as Validation;
    },
    options: async (parent, _args, { dataSources }) => {
      return parent['options'] || [];
    },
    relationType: async (parent, _args, { dataSources }) => {
      if (parent.relationType) return parent.relationType;
      const entityType: Entitytyping[] = parseItemTypesFromInputField(
        parent
      ) as Entitytyping[];
      if (!entityType) return '';
      return parseRelationTypesForEntityType(entityType[0]).relationType;
    },
    fromRelationType: async (parent, _args, { dataSources }) => {
      if (parent.fromRelationType) return parent.fromRelationType;
      const entityType: Entitytyping[] = parseItemTypesFromInputField(
        parent
      ) as Entitytyping[];
      if (!entityType) return '';
      return parseRelationTypesForEntityType(entityType[0]).fromRelationType;
    },
    advancedFilterInputForRetrievingOptions: async (
      parent,
      _args,
      { dataSources }
    ) => {
      return parent.advancedFilterInputForRetrievingOptions || [];
    },
    advancedFilterInputForRetrievingRelatedOptions: async (
      parent,
      _args,
      { dataSources }
    ) => {
      return parent.advancedFilterInputForRetrievingRelatedOptions || [];
    },
    advancedFilterInputForRetrievingAllOptions: async (
      parent,
      _args,
      { dataSources }
    ) => {
      return parent.advancedFilterInputForRetrievingAllOptions || [];
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
    dependsOn: async (parent, _args, { dataSources }) => {
      return parent.dependsOn || '';
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
    isMetadataField: async (parent, { input }, { dataSources }) => {
      return parent.isMetadataField || false;
    },
    multiple: async (parent, _args, { dataSources }) => {
      return parent.multiple || false;
    },
    entityType: async (parent, _args, { dataSources }) => {
      return parent.entityType || '';
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
    can: async (_source, { input }, { dataSources }) => {
      return input || [];
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
    can: async (_source, { input }, { dataSources }) => {
      return input || [];
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
    can: async (_source, { input }, { dataSources }) => {
      return input || [];
    },
  },
  TaggingExtensionConfiguration: {
    customQuery: async (_source, { input }, { dataSources }) => {
      return input;
    },
    taggableEntityConfiguration: async (
      _source,
      { configuration },
      { dataSources }
    ) => {
      return configuration;
    },
  },
};
