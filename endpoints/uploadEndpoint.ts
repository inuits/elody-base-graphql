import { AuthRESTDataSource, environment, environment as env } from '../main';
import { Express, Request, Response } from 'express';
import { EntityInput, Entitytyping } from '../../../generated-types/type-defs';
import {addJwt} from "./mediafilesEndpoint";
import { extractErrorCode } from '../helpers/helpers';

export const applyUploadEndpoint = (app: Express) => {
  app.post(
    '/api/upload/batch',
    async (request: Request, response: Response) => {
      try {
        const isDryRun: boolean = !!request.query['dry_run'];
        const extraMediafileType: string | undefined = request.query['extra_mediafile_type'] as string;
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
              const res = await __batchDryRun(request, response, csv, extraMediafileType);
              response.end(JSON.stringify(res));
            } else {
              const uploadUrls = (
                await __batchEntities(request, response, csv, extraMediafileType)
              ).filter((uploadUrl) => uploadUrl !== '');
              response.end(JSON.stringify(uploadUrls));
            }
          } catch (e) {
            console.log('Error while parsing response:', e);
            response.status(500).end(JSON.stringify(e));
          }
        });
      } catch (exception: any) {
        response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
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
        response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
      }
    }
  );

  app.post(
    `/api/upload/csv`,
    async (request: Request, response: Response) => {
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
          const datasource = new AuthRESTDataSource({session: request.session});
          const result = await datasource.post(
              `${env?.api.collectionApiUrl}/entities/${request.query.parentId}/order`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/csv',
                },
                body: csv,
              }
          );
          response.status(200).setHeader('Content-Type', 'text/csv');
          response.end();
        } catch (exception: any) {
          response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
          response.end(JSON.stringify(exception));
        }
      });
  });
};

const __batchDryRun = async (
  request: Request,
  response: Response,
  csv: string,
  extraMediafileType: string | undefined,
): Promise<any> => {
  let result = undefined;
  try {
    const datasource = new AuthRESTDataSource({ session: request.session });
    result = await datasource.post(
      `${env?.api.collectionApiUrl}/batch?dry_run=1${!!extraMediafileType ? `&extra_mediafile_type=${extraMediafileType}` : ""}`,
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
    response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
  }
};

const __batchEntities = async (
  request: Request,
  response: Response,
  csv: string,
  extraMediafileType: string | undefined,
): Promise<string[]> => {
  const datasource = new AuthRESTDataSource({ session: request.session });
  let result: any;
  try {
    result = await datasource.post(`${env?.api.collectionApiUrl}/batch${!!extraMediafileType ? `?extra_mediafile_type=${extraMediafileType}` : ""}`, {
      headers: {
        'Content-Type': 'text/csv',
        Accept: 'text/uri-list',
      },
      body: csv,
    });
  } catch (exception: any) {
    response.status(extractErrorCode(exception)).end(JSON.stringify(exception));
  }
  const jsonParsableResult = `["${result
    .split('\n')
    .join('","')}"]`;
  return JSON.parse(jsonParsableResult);
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
      (request.query.type as string) ||
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
