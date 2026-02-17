import { PermissionRequestInfo } from '../../../generated-types/type-defs';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { Environment } from '../types/environmentTypes';
import { Config } from '../types';
export declare class GraphqlAPI extends AuthRESTDataSource {
    env: Environment;
    baseURL: string;
    config: Config | 'no-config';
    preferredLanguage: string;
    checkAdvancedPermission(permissionRequestInfo: PermissionRequestInfo): Promise<boolean>;
    getUserIsAnonymousUser(): boolean;
}
