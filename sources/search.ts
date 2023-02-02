import {
  EntitiesResults,
  SearchFilter,
} from '../../../generated-types/type-defs';
import { setId, setType } from 'base-module/parsers/entity';
import { environment as env } from '../environment';
import { AuthRESTDataSource } from 'inuits-apollo-server-auth';

export class SearchAPI extends AuthRESTDataSource {
  public baseURL = `${env.api.searchApiUrl}/`;

  getSkip(skip: number, limit: number) {
    return skip - 1 === 0 ? 0 : limit * (skip - 1);
  }

  async getEntities(
    limit: number,
    skip: number,
    searchValue: SearchFilter
  ): Promise<EntitiesResults> {
    let data = [];
    try {
      let search = searchValue;
      data = await this.post(
        `search/collection?limit=${limit}&skip=${this.getSkip(skip, limit)}`,
        { body: { ...search, relation_filter: [], skip_relations: true } }
      );
      data.results.forEach((element: any) => setId(element));
    } catch (e) {
      console.log(e);
    }
    return data;
  }
}
