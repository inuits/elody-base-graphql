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
        request.on('data', (chunk: any) => {
          try {
            csv += chunk.toString();
          } catch (e) {
            console.log('Error while getting csv file:', e);
            response.status(500).end(JSON.stringify(e));
          }
        });
        request.on('end', async () => {
          try {
            if (isDryRun) {
                const res = await __batchDryRun(request, response, csv);
                response.end(JSON.stringify(res));
            } else {
                const uploadUrls = (await __batchEntities(request, response, csv)).filter(
                  (uploadUrl) => uploadUrl !== ''
                );
                response.end(JSON.stringify(uploadUrls));
            }
          } catch (e) {
            console.log('Error while parsing response:', e);
            response.status(500).end(JSON.stringify(e));
          }
        });
      } catch (exception: any) {
        const errorStatus = exception.extensions?.statusCode || 500;
        response.status(errorStatus).end(JSON.stringify(exception));
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
      } catch (exception: any) {
        const errorStatus = exception.extensions?.statusCode || 500;
        response.status(errorStatus).end(JSON.stringify(exception));
      }
    }
  );
};

const __batchDryRun = async (
  request: Request,
  response: Response,
  csv: string
): Promise<any> => {
  let result = undefined;
  try {
    const datasource = new AuthRESTDataSource({ session: request.session });
    result = await datasource.post(
      `${env?.api.collectionApiUrl}/batch?dry_run=1`,
      {
        headers: {
          'Content-Type': 'text/csv',
          Accept: 'application/json',
        },
        body: csv,
      }
    );
    return result;
  } catch (exception: any) {
    const errorStatus = exception.extensions?.statusCode || 500;
    response.status(errorStatus).end(JSON.stringify(exception));
  }
};

const __batchEntities = async (
  request: Request,
  response: Response,
  csv: string
): Promise<string[]> => {
  const datasource = new AuthRESTDataSource({ session: request.session });
  let result: any;
  try {
    result = await datasource.post(`${env?.api.collectionApiUrl}/batch`, {
      headers: {
        'Content-Type': 'text/csv',
        Accept: 'text/uri-list',
      },
      body: csv,
    });
  } catch (exception: any) {
    const errorStatus = exception.extensions?.statusCode || 500;
    response.status(errorStatus).end(JSON.stringify(exception));
  }

  let responseBody = '';
  if (result.body) {
    result.body.on(
      'data',
      (chunk: any) => (responseBody += chunk.toString())
    );
    return new Promise((resolve) => {
      result.body.on('end', async () => {
        const jsonParsableResult = `["${responseBody
          .split('\n')
          .join('","')}"]`;
        resolve(JSON.parse(jsonParsableResult));
      });
    });
  } else {
    // Handle the case where response.body is not available
    throw new Error('Response body not available');
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
