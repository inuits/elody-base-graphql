import fetch from 'node-fetch';
import { addJwt } from './mediafilesEndpoint';
import { AuthRESTDataSource, environment as env } from '../main';
import { Express, Request, Response } from 'express';

export const applyUploadEndpoint = (app: Express) => {
  app.post('/api/upload/batch', async (request: Request, response: Response) => {
    try {
      let csv = '';
      request.on('data', (chunk) => (csv += chunk.toString()));
      request.on('end', async () => {
        const uploadUrls = (await __batchEntities(request, csv)).filter(uploadUrl => uploadUrl !== "");
        response.end(JSON.stringify(uploadUrls));
      });
    } catch (exception) {
      response.status(500).end(String(exception));
    }
  });

  app.post('/api/upload/single', async (request: Request, response: Response) => {
    try {
      const uploadUrl = await __createMediafileForEntity(request);
      response.end(JSON.stringify(uploadUrl));
    } catch (exception) {
      response.status(500).end(String(exception));
    }
  });
};

const __batchEntities = async (request: Request, csv: string): Promise<string[]> => {
  const response = await fetch(
    `${env?.api.collectionApiUrl}/batch`,
    {
      headers: {
        'Content-Type': 'text/csv',
        Accept: 'text/uri-list',
        Authorization: addJwt(undefined, request, undefined),
      },
      method: 'POST',
      body: csv,
    }
  );

  let responseBody = '';
  response.body.on('data', (chunk) => (responseBody += chunk.toString()));
  return new Promise((resolve) => {
    response.body.on('end', async () => {
      const jsonParsableResult = `["${responseBody.split('\n').join('","')}"]`;
      resolve(JSON.parse(jsonParsableResult));
    });
  });
};

const __createMediafileForEntity = async (request: Request): Promise<string> => {
  const datasource = new AuthRESTDataSource({ session: request.session });
  const body = {
    filename: `${ request.query.filename }`,
    metadata: [
        {
          key: 'title',
          value: `${request.query.filename}`,
        },
    ],
  }
  return await datasource.post(`${env?.api.collectionApiUrl}/entities/${request.query.entityId}/mediafiles`, {
    body,
    headers: {
      Accept: 'text/uri-list',
      'Content-Type': 'application/json',
    }
  });
};
