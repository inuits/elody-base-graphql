import { Express, Request, Response } from 'express';
import { readFileSync, existsSync } from 'fs';

const DOCUMENTS_PATH = '/app/documents.json';

export const applyDocumentsEndpoint = (app: Express) => {
  app.get('/api/documents', (req: Request, res: Response) => {
    if (!existsSync(DOCUMENTS_PATH)) {
      res.status(404).json({ error: `${DOCUMENTS_PATH} not found. Run the generate task first.` });
      return;
    }
    const documents = readFileSync(DOCUMENTS_PATH, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.end(documents);
  });
};
