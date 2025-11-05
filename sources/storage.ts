import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export class StorageAPI extends AuthRESTDataSource {
  env: Environment = getCurrentEnvironment();
  public baseURL = `${this.env.api.storageApiUrl}`;
}
