import { Express } from 'express';

export const applyCodegenEndpoints = (
  app: Express,
  queries: any,
  schema: any
) => {
  const queryObject = JSON.stringify(queries);
  app.get('/api/codegen/queries', async (req, res) => {
    res.end(queryObject);
  });

  const schemaObject = JSON.stringify(schema);
  app.get('/api/codegen/schema', async (req, res) => {
    res.end(schemaObject);
  });
};
