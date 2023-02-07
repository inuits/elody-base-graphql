import { Express } from 'express';

export const applyCodegenEndpoints = (app: Express, queries: any) => {
  const queryObject = JSON.stringify(queries);
  app.get('/api/codegen/queries', async (req, res) => {
    res.end(queryObject);
  });
};
