import { AuthManager } from './auth-manager';
import { AuthSessionResponse, EnvConfig } from './types';
import { Environment } from '../types/environmentTypes';
declare module 'express-session' {
    interface SessionData {
        auth: AuthSessionResponse | undefined;
    }
}
export declare function applyAuthSession(app: any, mongoUrl: string, appConfig: Environment): Promise<void>;
export declare let manager: AuthManager | null;
export declare function applyAuthEndpoints(app: any, oauthBaseUrl: string, clientSecret: string): void;
export declare function getMe(accessToken: string): any;
export declare function applyEnvironmentConfig(_config: EnvConfig): void;
