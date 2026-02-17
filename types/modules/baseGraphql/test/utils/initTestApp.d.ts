import { Express } from 'express';
import { Environment } from '../../types/environmentTypes';
export type RouteHandler = (app: Express, env: Environment) => void;
export declare const createTestApp: (routeHandler: RouteHandler, environment: Environment) => Express;
export declare const getMockEnvironment: (overrides?: Partial<Environment>) => Environment;
