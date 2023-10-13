import {
  EntitiesResults,
  SearchFilter,
} from '../../../generated-types/type-defs';
import { setId, setType } from '../parsers/entity';
import { environment as env } from '../main';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';

export class SearchAPI extends AuthRESTDataSource {
  public baseURL = `${env?.api.searchApiUrl}/`;

  getSkip(skip: number, limit: number) {
    return skip - 1 === 0 ? 0 : limit * (skip - 1);
  }

  async getEntities(
    limit: number,
    skip: number,
    searchValue: SearchFilter
  ): Promise<EntitiesResults> {
    let data;
    try {
      let search = searchValue;
      data = await this.post(
        `search/collection?limit=${limit}&skip=${this.getSkip(
          skip,
          limit
        )}&asc=${search.isAsc}&order_by=${search.order_by}`,
        { body: { relation_filter: [], skip_relations: true } }
      );
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data as EntitiesResults;
  }
}
