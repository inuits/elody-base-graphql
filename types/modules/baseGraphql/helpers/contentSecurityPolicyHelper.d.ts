import type { Environment } from '../types/environmentTypes';
import { Express } from 'express';
export declare const createCspMiddleware: (overrides: any) => (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: Error) => void) => void;
export declare const enableContentSecurityPolicy: (app: Express, environment: Environment) => void;
