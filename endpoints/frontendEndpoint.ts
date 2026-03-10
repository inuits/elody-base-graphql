import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { ViteDevServer } from 'vite';

const getFrontendPath = (): string => {
  const __dirname: string = path.resolve();
  const variant = process.env.USE_LEGACY_FRONTEND === 'false' ? 'dist' : 'dist-legacy';
  return path.join(__dirname, `dashboard/${variant}`);
};

export const renderPageForEnvironment = async (
  req: Request,
  res: Response,
  vite?: ViteDevServer
): Promise<void> => {
  const __dirname: string = path.resolve();
  const frontendPath: string = getFrontendPath();

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
  const frontendPath: string = getFrontendPath();

  if (vite) {
    app.use(vite.middlewares);
  } else {
    app.use(express.static(frontendPath));
  }

  app.get('*', (req: Request, res: Response) => {
    renderPageForEnvironment(req, res, vite);
  });
};
