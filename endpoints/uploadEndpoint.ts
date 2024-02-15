import fetch from 'node-fetch';
import { addJwt } from './mediafilesEndpoint';
import { AuthRESTDataSource, environment, environment as env } from '../main';
import { Express, Request, Response } from 'express';
import { EntityInput, Entitytyping } from '../../../generated-types/type-defs';

export const applyUploadEndpoint = (app: Express) => {
  app.post(
    '/api/upload/batch',
    async (request: Request, response: Response) => {
      try {
        const isDryRun: boolean = !!request.query['dry_run'];
        let csv = '';
        request.on('data', (chunk) => {
          try {
            csv += chunk.toString();
          } catch (e) {
            console.log('Error while getting csv file:', e);
            response.status(500).end(e);
          }
        });
        request.on('end', async () => {
          try {
            if (isDryRun) {
              const res = await __batchDryRun(request, csv);
              const message = await res.json();
              response.status(res.status).end(JSON.stringify(message));
            } else {
              const uploadUrls = (await __batchEntities(request, csv)).filter(
                (uploadUrl) => uploadUrl !== ''
              );
              response.end(JSON.stringify(uploadUrls));
            }
          } catch (e) {
            console.log('Error while parsing response:', e);
            response.status(500).end(e);
          }
        });
      } catch (exception) {
        response.status(500).end(String(exception));
      }
    }
  );

  app.post(
    '/api/upload/single',
    async (request: Request, response: Response) => {
      try {
        if (request.query?.hasRelation) {
          const uploadUrl = await __createMediafileForEntity(request);
          response.end(JSON.stringify(uploadUrl));
        } else {
          const uploadUrl = await __createStandaloneMediafile(request);
          response.end(JSON.stringify(uploadUrl));
        }
      } catch (exception) {
        response.status(500).end(String(exception));
      }
    }
  );
};

const __batchDryRun = async (request: Request, csv: string): Promise<any> => {
  try {
    return await fetch(`${env?.api.collectionApiUrl}/batch?dry_run=1`, {
      headers: {
        'Content-Type': 'text/csv',
        Accept: 'application/json',
        Authorization: addJwt(undefined, request, undefined),
      },
      method: 'POST',
      body: csv,
    });
  } catch (e) {
    console.log(e);
    throw Error('Something went wrong during dry run');
  }
};

const __batchEntities = async (
  request: Request,
  csv: string
): Promise<string[]> => {
  try {
    const response = await fetch(`${env?.api.collectionApiUrl}/batch`, {
      headers: {
        'Content-Type': 'text/csv',
        Accept: 'text/uri-list',
        Authorization: addJwt(undefined, request, undefined),
      },
      method: 'POST',
      body: csv,
    });

    let responseBody = '';
    response.body.on('data', (chunk) => (responseBody += chunk.toString()));
    return new Promise((resolve) => {
      response.body.on('end', async () => {
        const jsonParsableResult = `["${responseBody.split('\n').join('","')}"]`;
        resolve(JSON.parse(jsonParsableResult));
      });
    });
  } catch (e) {
    console.log(e);
    throw Error('Something went wrong during batchEntities call');
  }
};

const __createMediafileForEntity = async (
  request: Request
): Promise<string> => {
  const datasource = new AuthRESTDataSource({ session: request.session });
  const body = {
    filename: `${request.query.filename}`,
    metadata: [
      {
        key: 'title',
        value: `${request.query.filename}`,
      },
    ],
  };
  return await datasource.post(
    `${env?.api.collectionApiUrl}/entities/${request.query.entityId}/mediafiles`,
    {
      body,
      headers: {
        Accept: 'text/uri-list',
        'Content-Type': 'application/json',
      },
    }
  );
};

const __createStandaloneMediafile = async (request: Request) => {
  const datasource = new AuthRESTDataSource({ session: request.session });
  const body: EntityInput = {
    metadata: [{ key: 'title', value: request.query.filename as string }],
    type:
      environment?.customization?.uploadEntityTypeToCreate ||
      Entitytyping.Asset,
  };
  return await datasource.post(
    `${env?.api.collectionApiUrl}/entities?create_mediafile=1&mediafile_filename=${request.query.filename}`,
    {
      body,
      headers: {
        Accept: 'text/uri-list',
        'Content-Type': 'application/json',
      },
    }
  );
};
