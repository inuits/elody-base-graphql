import {
  Entity,
  Metadata,
  MediaFile,
  PaginationInfo,
  JobsResults,
  Filters,
  Job,
  MetadataFieldInput,
  Maybe,
  Collection,
  EntityInput,
  MediaFileInput,
  MediaFileMetadataInput,
  OrderArrayInput,
  MetadataInput,
  SavedSearchesResults,
  SavedSearchInput,
  SavedSearchedEntity,
  SearchFilter,
  EntitiesResults,
  FilterInput,
  AdvancedFilter,
  RelationType,
  Entitytyping,
} from '../../../generated-types/type-defs';
import { AuthRESTDataSource } from 'inuits-apollo-server-auth';

import { Config } from '../types';
import { setId, setType } from '../parsers/entity';
import { environment as env } from '../environment';
import { addCustomMetadataToEntity } from '../resolvers/entityResolver';
import { parsedInput } from 'advanced-filter-module';
export type relationInput = {
  label: string;
  key: string;
  type: string;
  [key: string]: string;
};
type updateNode = { id: String; order: number };
export type InputRelationsDelete = Array<{ key: string; type: string }>;
let sixthCollectionId: string | 'no-id' = 'no-id';

export class CollectionAPI extends AuthRESTDataSource {
  public baseURL = `${env.api.collectionApiUrl}/`;
  public config: Config | 'no-config' = 'no-config';

  async getUserPermissions(): Promise<{ payload: string[] }> {
    let data: string[] = await this.get<string[]>('user/permissions');
    return { payload: data };
  }

  async getEntities(
    limit: number,
    skip: number,
    searchValue: SearchFilter
  ): Promise<EntitiesResults> {
    let data;
    try {
      let search = searchValue;
      data = await this.get(
        `${Collection.Entities}?limit=${limit}&skip=${this.getSkip(
          skip,
          limit
        )}&asc=${search.isAsc}&order_by=${search.order_by}`
      );
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }

  async getEntity(id: string): Promise<any> {
    let data = await this.get<any>(id);
    setId(data);
    // try {
    //   const ldesResource = data.data['foaf:page'];
    //   const iiifPresentation =
    //     data.data['Entiteit.isHetOnderwerpVan'][0]['@id'];
    //   addCustomMetadataToEntity(data, [
    //     { key: 'ldesResource', value: ldesResource, label: 'Bron' },
    //     {
    //       key: 'iiifPresentation',
    //       value: iiifPresentation,
    //       label: 'Presentatie',
    //     },
    //   ]);
    // } catch (e) {
    //   console.log(e);
    // }
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
      `entities/${entity_id}/set_primary_mediafile/${mediafile_id}`
    );
    return data;
  }

  async setThumbnailPrimaire(
    entity_id: string,
    mediafile_id: string
  ): Promise<any> {
    const data = await this.put<any>(
      `entities/${entity_id}/set_primary_thumbnail/${mediafile_id}`
    );
    return data;
  }

  async getMediafiles(id: string): Promise<MediaFile[]> {
    if (id !== 'noid') {
      return await this.get(`entities/${id}/mediafiles?non_public=1`);
    } else {
      return [];
    }
  }

  async addRelations(id: string, relations: any[]): Promise<any[]> {
    relations.map((relation) => (relation.key = 'entities/' + relation.key));
    return await this.post(`entities/${id}/relations`, { body: relations });
  }

  async getRelations(
    entityId: string,
    collection: Collection = Collection.Entities
  ): Promise<Metadata[]> {
    return await this.get(`${collection}/${entityId}/relations`);
  }

  async getMediaFile(mediaFileId: String): Promise<any> {
    const res = await this.get(`/mediafiles/${mediaFileId}`);
    setId(res);
    setType(res, Entitytyping.Mediafile);
    return res;
  }

  async getAssetsRelationedWithMediafFile(mediaFileId: String): Promise<any> {
    const assets = await this.get(`/mediafiles/${mediaFileId}/assets`);
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
    const res = await this.post(`/mediafiles`, { body: mediaFileInput });
    return res;
  }

  async linkMediafileToEntity(
    entityId: String,
    mediaFileInput: MediaFileInput
  ): Promise<any> {
    const res = await this.post(`/entities/${entityId}/mediafiles`, {
      body: mediaFileInput,
    });
    return res;
  }

  async patchMetaDataMediaFile(
    mediafileId: String,
    mediaFileMetadata: Maybe<MediaFileMetadataInput>[]
  ): Promise<any> {
    return await this.patch(`/mediafiles/${mediafileId}`, {
      body: {
        metadata: mediaFileMetadata,
      },
    });
  }

  async patchRelations(id: string, relations: relationInput[]): Promise<any[]> {
    return await this.patch(`entities/${id}/relations`, { body: relations });
  }

  async replaceMetadata(
    id: String,
    metadata: Maybe<MetadataFieldInput>[]
  ): Promise<Metadata[]> {
    return await this.put(`entities/${id}/metadata`, { metadata });
  }

  async patchMetadata(
    id: String,
    metadata: Maybe<MetadataInput>[]
  ): Promise<Metadata[]> {
    return await this.patch(`entities/${id}/metadata`, { body: metadata });
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

  async deleteData(id: string, path: Collection): Promise<any> {
    if (id == null) {
      return 'no id was specified';
    } else {
      await this.delete(`${path}/${id}`);
      return 'data has been successfully deleted';
    }
  }

  async createEntity(entity: EntityInput, objectId: string): Promise<any> {
    const body = entity as Entity;
    const newEntity = await this.post(`entities`, {
      body: {
        type: body.type,
        id: objectId,
        metadata: [
          {
            key: 'title',
            value: entity.title,
          },
        ] as Metadata[],
        object_id: objectId,
      },
    });
    return setId(newEntity);
  }

  async updateMediafilesOrder(orderArray: OrderArrayInput): Promise<string> {
    let mfs: updateNode[] = Object.values(orderArray['value']);

    console.log(Object.values(orderArray['value']));
    for (let i = 0; i < mfs.length; i++) {
      let mf: updateNode = mfs[i];
      console.log(mf.id, mf.order);
      await this.patch(`/${mf.id}`, { body: { order: mf.order } });
    }
    return 'Successfuly changed mediafile order';
  }

  async getPermission(id: string, collection: Collection): Promise<string[]> {
    return this.get(`${collection}/${id}/permissions`);
  }

  async getSixthCollectionId(): Promise<string> {
    if (sixthCollectionId == 'no-id') {
      sixthCollectionId = await this.get(`entities/sixthcollection/entity_id`);
    }
    return sixthCollectionId;
  }

  async deleteRelations(
    id: string,
    relations: InputRelationsDelete
  ): Promise<string> {
    const body = relations;
    await this.delete(`entities/${id}/relations`, { body });
    return 'Delete success.';
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

  async getAdvancedMediaFiles(
    limit: number,
    skip: number,
    advancedSearchValue: parsedInput[]
  ): Promise<EntitiesResults> {
    let result = { results: [], count: 0, limit };
    try {
      //Remove asset filter - first initial filter
      advancedSearchValue.shift();

      //mediaFileFilters - publication status
      if (advancedSearchValue) {
        advancedSearchValue.forEach((filter: parsedInput) => {
          if (
            filter &&
            filter.item_types?.includes('publication_status_media_file')
          ) {
            filter.item_types = ['publication_status'];
          }
        });
      }

      let body = advancedSearchValue;

      const data = await this.post(
        `mediafiles/filter?limit=${limit}&skip=${this.getSkip(skip, limit)}`,
        { body }
      );
      if (data.results) {
        data.results?.forEach((element: any) => {
          setId(element);
          setType(element, Entitytyping.Mediafile);
        });
        result = data;
      } else {
        data.forEach((element: any) => {
          setId(element);
          setType(element, Entitytyping.Mediafile);
        });
        result = { results: data, count: data.length, limit: limit };
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async GetAdvancedEntities(
    limit: number,
    skip: number,
    advancedSearchValue: parsedInput[]
  ): Promise<EntitiesResults> {
    let body = advancedSearchValue;
    const data = await this.post(
      `entities/filter?limit=${limit}&skip=${this.getSkip(skip, limit)}`,
      { body }
    );

    if (data.results) {
      data.results?.forEach((element: any) => setId(element));
      return data;
    } else {
      data.forEach((element: any) => setId(element));
      return { results: data, count: data.length, limit: limit };
    }
  }
}
