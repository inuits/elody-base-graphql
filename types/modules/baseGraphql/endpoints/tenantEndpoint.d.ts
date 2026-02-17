import { Express } from 'express';
declare module 'express-session' {
    interface SessionData {
        tenant: string | undefined;
    }
}
export declare const applyTenantEndpoint: (app: Express) => void;
