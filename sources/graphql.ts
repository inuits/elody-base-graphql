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
    ): Promise<boolean | undefined> {
        try {
            let parsedRequestInfo = JSON.stringify(permissionRequestInfo);
            const config = JSON.parse(parsedRequestInfo);

            const method = `${config.crud}${config.uri}`;
            if (method === "getUserLoggedIn") return this.getUserLoggedIn();
        } catch (e) {
            return false;
        }
    }

    async getUserLoggedIn(): Promise<boolean> {
        return this.session.auth?.accessToken ? true : false;
    }
}
