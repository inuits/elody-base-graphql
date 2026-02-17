import { Request, Response } from 'express';
import { ViteDevServer } from 'vite';
export declare const renderPageForEnvironment: (req: Request, res: Response, vite?: ViteDevServer) => Promise<void>;
export declare const configureFrontendForEnvironment: (app: any, vite?: ViteDevServer) => void;
