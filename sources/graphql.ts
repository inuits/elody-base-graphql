import { PermissionRequestInfo } from '../../../generated-types/type-defs';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { Config } from '../types';

export class GraphqlAPI extends AuthRESTDataSource {
  env: Environment = getCurrentEnvironment();
  public baseURL = `${this.env.graphqlEndpoint}/`;
  public config: Config | 'no-config' = 'no-config';
  public preferredLanguage: string =
    this.env.customization?.applicationLocale || 'en';

  async checkAdvancedPermission(
    permissionRequestInfo: PermissionRequestInfo
  ): Promise<boolean> {
    try {
      let parsedRequestInfo = JSON.stringify(permissionRequestInfo);
      const config = JSON.parse(parsedRequestInfo);

      const method = `${config.crud}${config.uri}`;
      if (method === 'getUserIsAnonymousUser')
        return !this.getUserIsAnonymousUser();
      return false;
    } catch (e) {
      return false;
    }
  }

  getUserIsAnonymousUser(): boolean {
    return this.session.auth?.accessToken ? false : true;
  }
}
