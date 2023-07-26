import { Express, Request, Response } from 'express';

export const applyTranslationEndpoint = (
  app: Express,
  appTranslations: Object
) => {
  app.get('/api/translation', async (request: Request, response: Response) => {
    if (!appTranslations) response.status(404).end('No translations found');
    response.status(200).end(JSON.stringify(appTranslations));
  });
};
