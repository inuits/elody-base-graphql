import { AuthSessionResponse } from './types';
export declare class AuthManager {
    private oauthBaseUrl;
    private clientId;
    private clientSecret;
    private tokenEndpoint;
    private logoutEndpoint;
    constructor(oauthBaseUrl: string, clientId: string, clientSecret: string, tokenEndpoint: string, logoutEndpoint: string);
    authenticate(authCode: string, redirectUri: string): Promise<AuthSessionResponse>;
    refresh(_accessToken: string | undefined, _refreshToken: string | undefined): Promise<AuthSessionResponse | undefined>;
    logout(_accessToken: string | undefined, _refreshToken: string | undefined): Promise<void>;
}
