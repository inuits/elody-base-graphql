import { Express, Request, Response } from 'express';
import { TypeUrlMapping } from '../types';

export const applyUrlMappingEndpoint = (
  app: Express,
  urlMapping: TypeUrlMapping
): void => {
  app.get('/api/url-mapping', (req: Request, res: Response) => {
    res.status(200).send(urlMapping);
  });
};
