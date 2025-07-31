import {
    PermissionRequestInfo
} from "../../../generated-types/type-defs";
import { AuthRESTDataSource } from "../auth/AuthRESTDataSource";
import {environment as env} from "../main";
import {Config} from "../types";

export class GraphqlAPI extends AuthRESTDataSource {
    public baseURL = `${env?.graphqlEndpoint}/`;
    public config: Config | 'no-config' = 'no-config';
    public preferredLanguage: string =
        env?.customization?.applicationLocale || 'en';

    async checkAdvancedPermission(
        permissionRequestInfo: PermissionRequestInfo,
    ): Promise<boolean> {
        try {
            let parsedRequestInfo = JSON.stringify(permissionRequestInfo);
            const config = JSON.parse(parsedRequestInfo);

            const method = `${config.crud}${config.uri}`;
            if (method === "getUserIsAnonymousUser") return !this.getUserIsAnonymousUser();
            return false;
        } catch (e) {
            return false;
        }
    }

    getUserIsAnonymousUser(): boolean {
        return this.session.auth?.accessToken ? false : true;
    }
}
