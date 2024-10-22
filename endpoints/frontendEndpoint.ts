import express, { Request, Response } from 'express';
import path from 'path';

export const serveFrontendThroughExpress = (app: any) => {
  const __dirname: string = path.resolve();
  const frontendPath: string = path.join(__dirname, 'dashboard/dist');

  app.use(express.static(frontendPath));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
};
