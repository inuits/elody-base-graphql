import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { ViteDevServer } from 'vite';
import {
  getEntityIdFromPath,
  negotiatedMimetype,
  proxyEntityInFormat,
} from './linkedOpenDataEndpoint';

export const renderPageForEnvironment = async (
  req: Request,
  res: Response,
  vite?: ViteDevServer
): Promise<void> => {
  const __dirname: string = path.resolve();
  const frontendPath: string = path.join(__dirname, 'dashboard/dist');

  try {
    if (vite) {
      const template = await fs.promises.readFile(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } else {
      res.sendFile(path.resolve(frontendPath, 'index.html'));
    }
  } catch (e: any) {
    vite?.ssrFixStacktrace(e);
    console.error(e);
    res.status(500).json({
      error: e?.message ?? 'Internal Server Error',
    });
  }
};

export const configureFrontendForEnvironment = (
  app: any,
  vite?: ViteDevServer
) => {
  const __dirname: string = path.resolve();
  const frontendPath: string = path.join(__dirname, 'dashboard/dist');

  app.get('*', async (req: Request, res: Response, next: NextFunction) => {
    const mimetype = negotiatedMimetype(req);
    const entityId = getEntityIdFromPath(req.path);
    if (!mimetype || !entityId) return next();

    await proxyEntityInFormat(entityId, mimetype, req, res);
  });

  if (vite) {
    app.use(vite.middlewares);
  } else {
    app.use(express.static(frontendPath));
  }

  app.get('*', (req: Request, res: Response) => {
    renderPageForEnvironment(req, res, vite);
  });
};
