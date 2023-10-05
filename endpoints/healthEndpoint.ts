import { Express } from 'express';
export const applyHealthEndpoint = (app: Express) => {
  app.get('/api/health', async (req, res) => {
    res.status(200).end();
  });
};
