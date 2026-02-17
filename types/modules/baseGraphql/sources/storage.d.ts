import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { Environment } from '../types/environmentTypes';
export declare class StorageAPI extends AuthRESTDataSource {
    env: Environment;
    baseURL: string;
}
