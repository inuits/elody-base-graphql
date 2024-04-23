import {
  AdvancedFilterInput,
  BaseRelationValuesInput,
  Collection,
  DropdownOption,
  EntitiesResults,
  Entity,
  EntityInput,
  Entitytyping,
  FilterInput,
  FilterMatcherMap,
  Filters,
  GraphElementInput,
  Job,
  JobsResults,
  Maybe,
  MediaFile,
  MediaFileInput,
  MediaFileMetadataInput,
  Metadata,
  MetadataFieldInput,
  MetadataValuesInput,
  PaginationInfo,
  SavedSearchedEntity,
  SavedSearchInput,
  SearchFilter,
} from '../../../generated-types/type-defs';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';

import { baseTypeCollectionMapping as collection } from './typeCollectionMapping';
import { Config } from '../types';
import { environment as env } from '../main';
import { setId, setType } from '../parsers/entity';

type EntetiesCallReturn =
  | { count: number; results: Array<unknown> }
  | Array<unknown>
  | 'no-call-is-triggerd';
let sixthCollectionId: string | 'no-id' = 'no-id';

export class CollectionAPI extends AuthRESTDataSource {
  public baseURL = `${env?.api.collectionApiUrl}/`;
  public config: Config | 'no-config' = 'no-config';
  public preferredLanguage: string =
    env?.customization?.applicationLocale || 'en';

  async getFilterMatcherMapping(): Promise<FilterMatcherMap> {
    return await this.get(`filter/matchers`);
  }

  async getUserPermissions(): Promise<{ payload: string[] }> {
    let data: string[] = await this.get<string[]>('user/permissions');
    return { payload: data };
  }

  async getEntities(
    limit: number,
    skip: number,
    searchValue: SearchFilter,
    type: Entitytyping
  ): Promise<EntitiesResults> {
    let data;
    try {
      let search = searchValue;
      data = await this.get(
        `${collection[type]}?limit=${limit}&skip=${this.getSkip(
          skip,
          limit
        )}&asc=${search.isAsc ? 1 : 0}&order_by=${search.order_by}`
      );
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }

  async getTenants(): Promise<EntitiesResults> {
    let data: any;
    try {
      data = await this.get('tenants');
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }

  getCollectionValueForEntityType(entityType: string): string {
    if (!collection.hasOwnProperty(entityType)) {
      throw new Error(
        `Type "${entityType}" does not exist inside the collection dictionary. Please add it or check if the type is written incorrectly.`
      );
    }
    return collection[entityType];
  }

  async getEntitiesByType(entityType: string): Promise<Entity[]> {
    let data;
    try {
      data = await this.get(
        `${this.getCollectionValueForEntityType(entityType)}?type=${entityType}`
      );
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data?.results;
  }

  async postEntitiesFilterSoftCall(entityType: string): Promise<string> {
    let data;
    const body = [
      {
        type: 'type',
        value: entityType !== "IotDeviceTracker" ? entityType : "IotDevice",
      },
    ];
    try {
      data = await this.post(`entities/${env?.features?.useFiltersV2 ? "filter_v2" : "filter"}?soft=1`, { body });
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async postEntitySoftCall(entityType: string): Promise<string> {
    let data;
    try {
      data = await this.post(`entities?soft=1`, {
        body: { type: entityType !== "IotDeviceTracker" ? entityType : "IotDevice" },
      });
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async patchEntityDetailSoftCall(id: String): Promise<string> {
    let data;
    try {
      data = await this.patch(`${Collection.Entities}/${id}?soft=1`, {
        body: {},
      });
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async delEntityDetailSoftCall(id: String): Promise<string> {
    let data;
    try {
      data = await this.delete(`${Collection.Entities}/${id}?soft=1`);
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async getEntity(id: string, type: string, _collection: string | undefined = undefined): Promise<any> {
    const idSplit = id.split('/');
    if (idSplit.length > 1) id = idSplit[1];
    let data = await this.get<any>(`${_collection ? _collection : collection[type]}/${id}`);
    setId(data);
    return data;
  }

  async getEntityById(id: string): Promise<any> {
    let data: any;
    try {
      data = await this.get<any>(`${Collection.Entities}/${id}`);
    } catch {
      return undefined;
    }
    setId(data);
    return data;
  }

  async getNewObjectId(): Promise<string> {
    const data = await this.get(`${Collection.Entities}/sixthcollection/id`);
    return data;
  }

  async setMediaPrimaire(
    entity_id: string,
    mediafile_id: string
  ): Promise<any> {
    const data = await this.put<any>(
      `${Collection.Entities}/${entity_id}/set_primary_mediafile/${mediafile_id}`
    );
    return data;
  }

  async setThumbnailPrimaire(
    entity_id: string,
    mediafile_id: string
  ): Promise<any> {
    const data = await this.put<any>(
      `${Collection.Entities}/${entity_id}/set_primary_thumbnail/${mediafile_id}`
    );
    return data;
  }

  async getMediafiles(id: string): Promise<MediaFile[]> {
    if (id !== 'noid') {
      return await this.get(
        `${Collection.Entities}/${id}/mediafiles?non_public=1`
      );
    } else {
      return [];
    }
  }

  async addRelations(id: string, relations: any[]): Promise<any[]> {
    relations.map((relation) => (relation.key = 'entities/' + relation.key));
    return await this.post(`${Collection.Entities}/${id}/relations`, {
      body: relations,
    });
  }

  async getRelations(
    entityId: string,
    collection: Collection = Collection.Entities
  ): Promise<Metadata[]> {
    return await this.get(`${collection}/${entityId}/relations`);
  }

  async getMediaFile(mediaFileId: String): Promise<any> {
    const res = await this.get(`${Collection.Mediafiles}/${mediaFileId}`);
    setId(res);
    setType(res, Entitytyping.Mediafile);
    return res;
  }

  async getAssetsRelationedWithMediafFile(mediaFileId: String): Promise<any> {
    const assets = await this.get(
      `${Collection.Mediafiles}/${mediaFileId}/assets`
    );
    assets.forEach((asset: any) => {
      setId(asset);
    });
    return assets;
  }

  async postMediaFile(mediaFileInput: MediaFileInput): Promise<any> {
    mediaFileInput.metadata = [
      { key: 'rights', value: 'niets-geselecteerd' },
      { key: 'source', value: 'niets-geselecteerd' },
      { key: 'publication_status', value: 'niet-publiek' },
    ];
    const res = await this.post(`${Collection.Mediafiles}`, {
      body: mediaFileInput,
    });
    return res;
  }

  async linkMediafileToEntity(
    entityId: String,
    mediaFileInput: MediaFileInput
  ): Promise<any> {
    const res = await this.post(
      `${Collection.Entities}/${entityId}/mediafiles`,
      {
        body: mediaFileInput,
      }
    );
    return res;
  }

  async patchMetaDataMediaFile(
    mediafileId: String,
    mediaFileMetadata: Maybe<MediaFileMetadataInput>[]
  ): Promise<any> {
    return await this.patch(`${Collection.Mediafiles}/${mediafileId}`, {
      body: {
        metadata: mediaFileMetadata,
      },
    });
  }

  async replaceMetadata(
    id: String,
    metadata: Maybe<MetadataFieldInput>[]
  ): Promise<Metadata[]> {
    return await this.put(`${Collection.Entities}/${id}/metadata`, {
      metadata,
    });
  }

  async patchMetadata(
    id: String,
    metadata: MetadataValuesInput[],
    collection: Collection = Collection.Entities
  ): Promise<Metadata[]> {
    if (metadata.length <= 0) return [];
    return await this.patch(`${collection}/${id}/metadata`, { body: metadata });
  }

  async postRelations(
    id: string,
    relations: BaseRelationValuesInput[],
    collection: Collection = Collection.Entities
  ): Promise<any[]> {
    if (relations.length <= 0) return [];
    return await this.post(`${collection}/${id}/relations`, {
      body: relations,
    });
  }

  async patchRelations(
    id: string,
    relations: BaseRelationValuesInput[],
    collection: Collection = Collection.Entities
  ): Promise<any[]> {
    if (relations.length <= 0) return [];
    return await this.patch(`${collection}/${id}/relations`, {
      body: relations,
    });
  }

  async deleteRelations(
    id: string,
    relations: BaseRelationValuesInput[],
    collection: Collection = Collection.Entities
  ): Promise<any> {
    if (relations.length <= 0) return [];
    return await this.delete(`${collection}/${id}/relations`, {
      body: relations,
    });
  }

  async getJobs(
    paginationInfo: PaginationInfo,
    filters: Filters,
    failed: Boolean
  ): Promise<JobsResults> {
    let url: string = `jobs?limit=${paginationInfo.limit}&skip=${
      paginationInfo.skip
    }${failed ? '&status=failed' : ''}`;
    if (filters.type) {
      url = `${url}&type=dams.${filters.type}`;
    }
    const data = await this.get(url);
    return data;
  }

  async getJob(id: String, failed: Boolean): Promise<Job> {
    const data = await this.get(`jobs/${id}?${failed ? '?status=failed' : ''}`);
    return data;
  }

  async deleteData(
    id: string,
    path: Collection,
    deleteMediafiles: boolean
  ): Promise<any> {
    if (id == null) {
      return 'no id was specified';
    } else {
      await this.delete(
        `${path}/${id}?delete_mediafiles=${deleteMediafiles ? 1 : 0}`
      );
      return 'data has been successfully deleted';
    }
  }

  async createEntity(
    entity: EntityInput,
    metadata: Metadata[] = [],
    relations: any[] = []
  ): Promise<any> {
    const body: any = {
      type: entity.type !== "IotDeviceTracker" ? entity.type : "IotDevice",
      metadata,
      relations,
    };
    const newEntity = await this.post(
      `${collection[entity.type as Entitytyping]}`,
      {
        body,
      }
    );
    return setId(newEntity);
  }

  async getPermission(id: string, collection: Collection): Promise<string[]> {
    return this.get(`${collection}/${id}/permissions`);
  }

  async getSixthCollectionId(): Promise<string> {
    if (sixthCollectionId == 'no-id') {
      sixthCollectionId = await this.get(
        `${Collection.Entities}/sixthcollection/entity_id`
      );
    }
    return sixthCollectionId;
  }

  async getConfig(): Promise<Config> {
    if (this.config === 'no-config') {
      this.config = await this.get('/config');
    }
    return this.config as Config;
  }

  getSkip(skip: number, limit: number) {
    return skip - 1 === 0 ? 0 : limit * (skip - 1);
  }

  setLabels = (response: any) => {
    response.metadata.forEach((md: Maybe<Metadata>) => {
      if (md) {
        md.label = md.key;
      }
    });
  };

  async getSavedSearches(
    limit: number = 5,
    skip: number = 0,
    searchValue: Maybe<SearchFilter> | undefined
  ): Promise<EntitiesResults> {
    if (!searchValue) {
      searchValue = { value: '', isAsc: false, key: '' };
    }
    var response = await this.get(
      `saved_searches?title=${
        searchValue.value
      }&limit=${limit}&skip=${this.getSkip(skip, limit)}`
    );
    response.results.forEach((res: SavedSearchedEntity) => {
      setId(res);
      this.setLabels(res);
    });
    return response;
  }

  async createSavedSearch(
    savedSearchInput: SavedSearchInput
  ): Promise<SavedSearchedEntity> {
    const response = await this.post(`saved_searches`, {
      body: savedSearchInput,
    });
    this.setLabels(response);
    return response;
  }

  async deleteSavedSearch(uuid: String): Promise<string> {
    await this.delete(`saved_searches/${uuid}`);
    return `saved search with uuid ${uuid} has been deleted.`;
  }

  async patchSavedSearchTitle(
    uuid: String,
    title: String
  ): Promise<SavedSearchedEntity> {
    const patchedTitle = {
      metadata: [
        {
          lang: 'nl',
          value: title,
          key: 'title',
        },
      ],
    };

    const response = await this.patch(`saved_searches/${uuid}`, {
      body: patchedTitle,
    });
    this.setLabels(response);
    return response;
  }

  async patchSavedSearchDefinition(
    uuid: String,
    definition: FilterInput[]
  ): Promise<SavedSearchedEntity> {
    const patchedDefinition = {
      definition: definition,
    };
    const response = await this.patch(`saved_searches/${uuid}`, {
      body: patchedDefinition,
    });
    this.setLabels(response);
    return response;
  }

  async getSavedSearchById(uuid: String): Promise<SavedSearchedEntity> {
    const response = await this.get(`saved_searches/${uuid}`);
    this.setLabels(response);
    return response;
  }

  async GetAdvancedEntities(
    type: Entitytyping,
    limit: number,
    skip: number,
    advancedFilterInputs: AdvancedFilterInput[],
    advancedSearchValue: SearchFilter
  ): Promise<EntitiesResults> {
    let data: EntetiesCallReturn = 'no-call-is-triggerd';

    if (Entitytyping.Mediafile === type) {
      data = await this.doAdvancedMediaCall(
        limit,
        skip,
        advancedFilterInputs,
        advancedSearchValue
      );
    } else {
      data = await this.doAdvancedEntitiesCall(
        type,
        limit,
        skip,
        advancedFilterInputs,
        advancedSearchValue
      );
    }

    if (data === 'no-call-is-triggerd') {
      throw Error('No call triggerd wen trying to search for entities');
    }

    if (!Array.isArray(data)) {
      data.results?.forEach((element: unknown): unknown => setId(element));
      //Todo write typescheker for EntitieResults
      return data as EntitiesResults;
    }
    if (Array.isArray(data)) {
      let count;
      if (data[0].count !== undefined) count = data.shift().count;
      else count = data.length;
      data.forEach(
        (element: Record<string, unknown>): Record<string, unknown> =>
          setId(element)
      );
      return { results: data as Entity[], count: count, limit: limit };
    }

    return { results: [], count: 0, limit };
  }

  private async doAdvancedEntitiesCall(
    type: Entitytyping,
    limit: number,
    skip: number,
    advancedFilterInputs: AdvancedFilterInput[],
    advancedSearchValue: SearchFilter
  ): Promise<EntetiesCallReturn> {
    const body = advancedFilterInputs;
    return await this.post(
      `${collection[type]}/${env?.features?.useFiltersV2 ? "filter_v2" : "filter"}?limit=${limit}&skip=${this.getSkip(
        skip,
        limit
      )}&order_by=${advancedSearchValue.order_by}&asc=${
        advancedSearchValue.isAsc ? 1 : 0
      }`,
      { body }
    );
  }

  private async doAdvancedMediaCall(
    limit: number,
    skip: number,
    advancedFilterInputs: AdvancedFilterInput[],
    advancedSearchValue: SearchFilter
  ): Promise<EntetiesCallReturn> {
    const itemWithParentId = advancedFilterInputs.find(
      (currentValue: AdvancedFilterInput) => {
        if (currentValue.parent_key === 'relations') {
          return currentValue;
        }
      }
    );
    const isFilterCall = advancedFilterInputs.some(
      (currentValue: AdvancedFilterInput) => {
        return ['metadata_on_relation'].includes(currentValue.type);
      }
    );
    if (
      itemWithParentId &&
      itemWithParentId.parent_key === 'relations' &&
      !isFilterCall
    ) {
      return this.get(
        `${Collection.Entities}/${
          itemWithParentId.value[0]
        }/mediafiles?limit=${limit}&skip=${this.getSkip(
          skip,
          limit
        )}&order_by=${advancedSearchValue.order_by}&asc=${
          advancedSearchValue.isAsc ? 1 : 0
        }`
      ).then(
        (
          result: Exclude<EntetiesCallReturn, 'no-call-is-triggerd'>
        ): EntetiesCallReturn => this.handleAdvancedMediaResult(result)
      );
    } else {
      const body = advancedFilterInputs;
      console.log(body);
      return await this.post(
        `${Collection.Mediafiles}/filter?limit=${limit}&skip=${this.getSkip(
          skip,
          limit
        )}&order_by=${advancedSearchValue.order_by}&asc=${
          advancedSearchValue.isAsc ? 1 : 0
        }`,
        { body }
      ).then(
        (
          result: Exclude<EntetiesCallReturn, 'no-call-is-triggerd'>
        ): EntetiesCallReturn => this.handleAdvancedMediaResult(result)
      );
    }
  }

  private handleAdvancedMediaResult(
    result: Exclude<EntetiesCallReturn, 'no-call-is-triggerd'>
  ): EntetiesCallReturn {
    //Add mediafile type to the result, is missing from the mediafile endpoint
    if (!Array.isArray(result)) {
      const finalResult = result.results.map(
        (item: unknown): Record<string, unknown> => {
          //Todo write typescheker for EntitieResults
          return { ...(item as Object), type: 'mediafile' } as Record<
            string,
            unknown
          >;
        }
      );
      finalResult.unshift({
        count: result.count ? result.count : result.results.length,
      });
      return finalResult;
    }

    return 'no-call-is-triggerd';
  }

  async GetFilterOptions(
    input: AdvancedFilterInput,
    limit: number
  ): Promise<DropdownOption[]> {
    const body = [input];
    const data = await this.post(
      `${Collection.Entities}/${env?.features?.useFiltersV2 ? "filter_v2" : "filter"}?limit=${limit}&skip=0`,
      {
        body,
      }
    );
    if (data?.results && data.results?.length > 0 && data.results.options?.length > 0) return data.results;
    return [];
  }

  async GetStats(id: string, graph: GraphElementInput): Promise<any> {
    let filterValuesQueryString = '';
    for (const value of graph.dataset?.filter?.values || [])
      filterValuesQueryString += `&filter_values=${value}`;

    const data = await this.get(
      `stats/${graph.datasource}/${id}?time_unit=${graph.timeUnit}&datapoints=${
        graph.datapoints
      }&convert_to=${graph.convert_to || ''}&filter_key=${
        graph.dataset?.filter?.key || ''
      }${filterValuesQueryString}`
    );
    if (data.results && data.results.length > 0) return data.results[0];
    return undefined;
  }
}
