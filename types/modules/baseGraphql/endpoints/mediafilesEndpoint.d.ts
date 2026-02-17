import { Express, Response, Request } from 'express';
import { Environment } from '../types/environmentTypes';
export declare const addHeaders: (proxyReq: any, req: Request, res: Response) => void;
declare const applyMediaFileEndpoint: (app: Express, environment: Environment) => void;
export default applyMediaFileEndpoint;
