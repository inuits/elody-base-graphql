import { Express, Request, Response } from 'express';
export const applyHealthEndpoint = (app: Express) => {
  app.get('/api/health', async (req: Request, res: Response) => {
    res.status(200).end();
  });
};
