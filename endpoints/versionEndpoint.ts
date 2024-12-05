import { Express, Request, Response } from 'express';
import { Environment } from '../environment';

export const applyVersionEndpoint = (
  app: Express,
  config: Environment
): void => {
  app.get('/api/version', (req: Request, res: Response) => {
    res.status(200).send({ 'apollo-graphql-version': config.version });
  });
};
