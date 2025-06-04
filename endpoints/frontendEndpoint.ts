import express, { Request, Response } from 'express';
import path from 'path';

export const serveFrontend = (req: Request, res: Response): void => {
  const __dirname: string = path.resolve();
  const frontendPath: string = path.join(__dirname, 'dashboard/dist');
  res.sendFile(path.resolve(frontendPath, 'index.html'));
};

export const serveFrontendThroughExpress = (app: any) => {
  const __dirname: string = path.resolve();
  const frontendPath: string = path.join(__dirname, 'dashboard/dist');

  app.use(express.static(frontendPath));

  app.get('*', (req: Request, res: Response) => {
    serveFrontend(req, res);
  });
};
