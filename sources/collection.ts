import {
  AdvancedFilterInput,
  BaseRelationValuesInput,
  BulkOperationCsvExportKeys,
  Collection,
  DamsIcons,
  DropdownOption,
  EntitiesResults,
  Entity,
  EntityInput,
  Entitytyping,
  FilterMatcherMap,
  GraphElementInput,
  Maybe,
  MediaFileInput,
  MediaFileMetadataInput,
  Metadata,
  MetadataFieldInput,
  MetadataValuesInput,
  SearchFilter,
  PermissionRequestInfo,
  DeleteEntitiesInput,
} from '../../../generated-types/type-defs';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import jwtDecode from 'jwt-decode';

import { baseTypeCollectionMapping as collection } from './typeCollectionMapping';
import { Config } from '../types';
import { environment as env } from '../main';
import { GraphQLError } from 'graphql/index';
import { setId, setType } from '../parsers/entity';
import { getCollectionValueForEntityType } from '../helpers/helpers';

type EntetiesCallReturn =
  | { count: number; results: Array<unknown> }
  | Array<unknown>
  | 'no-call-is-triggerd';
let sixthCollectionId: string | 'no-id' = 'no-id';
type CRUDMethod = 'get' | 'post' | 'put' | 'delete';

export class CollectionAPI extends AuthRESTDataSource {
  public baseURL = `${env?.api.collectionApiUrl}/`;
  public config: Config | 'no-config' = 'no-config';
  public preferredLanguage: string =
    env?.customization?.applicationLocale || 'en';

  async getSessionInfo(key: string): Promise<string> {
    const user = jwtDecode(this.session.auth.accessToken!) as {
      [key: string]: string;
    };
    return user[key];
  }

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
        `${getCollectionValueForEntityType(
          type
        )}?limit=${limit}&skip=${this.getSkip(skip, limit)}&asc=${
          search.isAsc ? 1 : 0
        }&order_by=${search.order_by}`
      );
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }

  async getEntitiesByAdvancedSearch(
    q: string,
    query_by: string,
    filter_by: string,
    query_by_weights?: string,
    sort_by?: string,
    limit?: number,
    per_page?: number,
    facet_by?: string
  ): Promise<EntitiesResults> {
    let data;
    const filters = {
      q,
      filter_by,
      query_by,
      sort_by,
      per_page,
      limit,
      query_by_weights,
      facet_by,
    };
    try {
      data = await this.post('filter_typesense', {
        body: filters,
      });
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }

  async getEntitiesByAiSearch(input: string): Promise<EntitiesResults> {
    let data;
    const filters = { input };
    try {
      data = await this.post('ai_search', {
        body: filters,
      });
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }
  async getTenants(): Promise<EntitiesResults> {
    let data: any;
    data = await this.get('tenants?limit=100&order_by=label');
    if (!data?.results)
      throw new GraphQLError('Failed to fetch data. Please try again later.');
    return data as EntitiesResults;
  }

  async getEntitiesByType(entityType: string): Promise<Entity[]> {
    let data;
    try {
      data = await this.get(
        `${getCollectionValueForEntityType(entityType)}?type=${entityType}`
      );
      if (data.results) data.results.forEach((element: any) => setId(element));
    } catch (e) {
      return [];
    }
    return data?.results;
  }

  async checkAdvancedPermission(
    permissionRequestInfo: PermissionRequestInfo,
    parentEntityId: Maybe<string> | undefined,
    childEntityId: Maybe<string> | undefined
  ): Promise<boolean> {
    try {
      let parsedRequestInfo = JSON.stringify(permissionRequestInfo);
      if (parentEntityId)
        parsedRequestInfo = parsedRequestInfo.replace(
          /\$parentEntityId/g,
          parentEntityId
        );
      if (childEntityId)
        parsedRequestInfo = parsedRequestInfo.replace(
          /\$childEntityId/g,
          childEntityId
        );
      const config = JSON.parse(parsedRequestInfo);

      const hasNoSoftParam = !config.uri.includes('soft=1');
      if (hasNoSoftParam) {
        config.uri += config.uri.includes('?') ? '&soft=1' : '?soft=1';
      }
      if (config.uri.startsWith('/')) config.uri = config.uri.slice(1);

      let data;
      if ((config.crud as CRUDMethod) == 'get') {
        data = await this[config.crud as CRUDMethod](config.uri);
      } else {
        data = await this[config.crud as CRUDMethod](config.uri, {
          body: config.body,
        });
      }
      return data === 'good';
    } catch (e) {
      return false;
    }
  }

  async postEntitiesFilterSoftCall(entityType: string): Promise<string> {
    let data;
    const body = [
      {
        type: 'type',
        value: entityType,
      },
    ];
    try {
      data = await this.post(
        `${getCollectionValueForEntityType(entityType)}/filter?soft=1`,
        { body }
      );
    } catch (e) {
      return '401';
    }
    if (data) return '200';
    return data;
  }

  async postEntitySoftCall(entityType: string): Promise<string> {
    let data;
    try {
      data = await this.post(
        `${getCollectionValueForEntityType(entityType)}?soft=1`,
        {
          body: { type: entityType },
        }
      );
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async patchEntityDetailSoftCall(
    id: String,
    entityType: string,
    collection: Collection = Collection.Entities
  ): Promise<string> {
    let data;
    try {
      const idSplit = id.split('/');
      if (idSplit.length > 1) id = idSplit[1];
      data = await this.patch(
        `${getCollectionValueForEntityType(entityType)}/${id}?soft=1`,
        {
          body: {},
        }
      );
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async delEntityDetailSoftCall(
    id: String,
    entityType: string,
    collection: Collection = Collection.Entities
  ): Promise<string> {
    let data;
    try {
      const idSplit = id.split('/');
      if (idSplit.length > 1) id = idSplit[1];
      data = await this.delete(
        `${getCollectionValueForEntityType(entityType)}/${id}?soft=1`
      );
    } catch (e) {
      return '401';
    }
    if (data === 'good') return '200';
    return data;
  }

  async getEntity(
    id: string,
    type: string,
    _collection: string | undefined = undefined,
    returnIdIfFails: boolean = false
  ): Promise<any> {
    let data;
    try {
      const idSplit = id.split('/');
      if (idSplit.length > 1) id = idSplit[1];
      data = await this.get<any>(
        `${
          _collection ? _collection : getCollectionValueForEntityType(type)
        }/${id}`
      );
    } catch (error: any) {
      if (returnIdIfFails) return id;
      throw error;
    }
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

  async getMediafiles(id: string): Promise<any> {
    try {
      return await this.get(
        `${Collection.Entities}/${id}/mediafiles?non_public=1`
      );
    } catch (error) {
      throw error;
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

  async putRelations(
    id: string,
    relations: BaseRelationValuesInput[],
    collection: Collection = Collection.Entities
  ): Promise<any> {
    return await this.put(`${collection}/${id}/relations`, {
      body: relations,
    });
  }

  async deleteData(
    id: string,
    path: Collection,
    deleteMediafiles: boolean
  ): Promise<any> {
    if (id == null) {
      return 'no id was specified';
    } else {
      const idSplit = id.split('/');
      if (idSplit.length > 1) id = idSplit[1];
      await this.delete(
        `${path}/${id}?delete_mediafiles=${deleteMediafiles ? 1 : 0}`
      );
      return 'data has been successfully deleted';
    }
  }

  async bulkDeleteEntities(
    ids: string[] = [],
    path: Collection,
    deleteEntities: DeleteEntitiesInput,
    skipItemsWithRelationDuringBulkDelete: string[]
  ): Promise<string> {
    if (ids.length === 0) return 'no ids were specified';

    try {
      const queryParams = new URLSearchParams({
        delete_mediafiles: deleteEntities.deleteMediafiles ? '1' : '0',
        skip_items_with_relation:
          skipItemsWithRelationDuringBulkDelete[0] ?? '',
      }).toString();

      const result = await this.delete(`${path}?${queryParams}`, {
        body: { identifiers: ids },
      });
      return result.parent_job_id;
    } catch (error) {
      return '';
    }
  }

  async createEntity(
    entity: EntityInput,
    metadata: Metadata[] = [],
    relations: any[] = []
  ): Promise<any> {
    const body: any = {
      type: entity.type,
      metadata,
      relations,
    };
    const newEntity = await this.post(
      `${getCollectionValueForEntityType(entity.type as Entitytyping)}`,
      {
        body,
      }
    );
    return setId(newEntity);
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
      this.config = await this.get('config');
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
        type,
        limit,
        skip,
        advancedFilterInputs,
        advancedSearchValue
      );
    } else if (Entitytyping.History === type) {
      data = await this.doAdvancedHistoryEntitiesCall(
        type,
        1000,
        skip,
        [],
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
      data?.results?.forEach((element: unknown): unknown => setId(element));
      //Todo write typescheker for EntitieResults
      return data as EntitiesResults;
    }
    if (Array.isArray(data)) {
      let count;
      // @ts-ignore
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
      `${getCollectionValueForEntityType(
        type
      )}/filter?limit=${limit}&skip=${this.getSkip(skip, limit)}&order_by=${
        advancedSearchValue.order_by
      }&asc=${advancedSearchValue.isAsc ? 1 : 0}`,
      { body }
    );
  }

  // TODO: redo or remove after the demo #139636
  private async doAdvancedHistoryEntitiesCall(
    type: Entitytyping,
    limit: number,
    skip: number,
    advancedFilterInputs: AdvancedFilterInput[],
    advancedSearchValue: SearchFilter
  ): Promise<EntetiesCallReturn> {
    const body = advancedFilterInputs;
    const data = await this.post(
      `history/filter?limit=${limit}&skip=${this.getSkip(
        skip,
        limit
      )}&order_by=${advancedSearchValue.order_by}&asc=${
        advancedSearchValue.isAsc ? 1 : 0
      }`,
      { body }
    );

    return {
      ...data,
      results: data.results.map((item: any) => item.object),
      limit,
    };
  }

  private async doAdvancedMediaCall(
    type: Entitytyping,
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
      const finalResult = result.results?.map(
        (item: unknown): Record<string, unknown> => {
          //Todo write typescheker for EntitieResults
          return { ...(item as Object), type: 'mediafile' } as Record<
            string,
            unknown
          >;
        }
      );
      finalResult?.unshift({
        count: result.count ? result.count : result.results.length,
      });
      return finalResult;
    }

    return 'no-call-is-triggerd';
  }

  async updateMetadataWithCsv(entityType: string, csv: any): Promise<any> {
    await this.put(`${getCollectionValueForEntityType(entityType)}`, {
      headers: {
        'Content-Type': 'text/csv',
      },
      body: csv,
    });
  }

  async GetCsvExportKeysPerEntityType(
    entityType: string
  ): Promise<BulkOperationCsvExportKeys> {
    const options = {
      headers: {
        Accept: 'text/csv',
      },
    };
    const csvData = await this.get(
      `${getCollectionValueForEntityType(
        entityType
      )}?type=${entityType}&exclude_non_editable_fields=1`,
      options
    );
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const dropdownOptions: BulkOperationCsvExportKeys = {
      options: [],
    };
    headers.forEach((item: string) => {
      dropdownOptions.options.push({
        icon: DamsIcons.NoIcon,
        label: item,
        value: item,
        required: item === 'identifiers',
      });
    });
    return dropdownOptions;
  }

  async GetFilterOptions(
    input: AdvancedFilterInput[],
    limit: number,
    entityType: string,
    preferredLanguage?: string | null
  ): Promise<DropdownOption[]> {
    const data = await this.post(
      `${getCollectionValueForEntityType(
        entityType
      )}/filter?limit=${limit}&skip=0`,
      {
        body: input,
      }
    );

    if (data.results && data.results.length > 0) return data.results;
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

  async getDerivatives(mediafileId: string): Promise<any> {
    return this.get(`mediafiles/${mediafileId}/derivatives`);
  }
}
