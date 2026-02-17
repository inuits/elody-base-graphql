import { Environment } from '../types/environmentTypes';
export declare class AuthTokenManager {
    private environment;
    private session;
    private clientIp?;
    constructor(environment: Environment, session: any, clientIp?: string);
    private get accessToken();
    private get refreshToken();
    getValidToken(): Promise<string>;
    private isExpired;
    private isIpWhitelisted;
}
