import { Express, Request, Response } from 'express';
import { object, string } from 'yup';

const baseValidationSchema = object({
  id: string().required(),
  name: string().required(),
  description: string().notRequired(),
  email: string().email(),
});

export const applyValidationEndpoint = (app: Express) => {
  app.get('/api/validation', async (request: Request, response: Response) => {
    if (!baseValidationSchema)
      response.status(404).end('No validation schema found');
    response.status(200).end(JSON.stringify(baseValidationSchema));
  });
};
