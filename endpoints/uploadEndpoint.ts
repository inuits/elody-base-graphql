import { AuthRESTDataSource } from '../main';
import { Express, Request, Response } from 'express';
import { extractErrorCode, getClientOrigin } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export const applyUploadEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();

  app.post('/api/upload/xml', async (request: Request, response: Response) => {
    const env: Environment = getCurrentEnvironment();
    try {
      const datasource = new AuthRESTDataSource({
        environment: env,
        session: request.session,
      });
      let xml = '';
      request.on('data', (chunk: any) => {
        try {
          xml += chunk.toString();
        } catch (e) {
          console.log('Error while getting xml file:', e);
          response.status(500).end(JSON.stringify(e));
        }
      });

      request.on('end', async () => {
        try {
          const result = await datasource.post(
            `${env.api.collectionApiUrl}/marc21/v1/batch?xml_type=${request.query.upload_type}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'text/xml',
              },
              body: xml,
            }
          );

          response.status(200).setHeader('Content-Type', 'text/xml');
          response.end(JSON.stringify('success'));
        } catch (exception: any) {
          response
            .status(extractErrorCode(exception))
            .end(JSON.stringify(exception));
          response.end(JSON.stringify(exception));
        }
      });
    } catch (exception) {
      response
        .status(extractErrorCode(exception))
        .end(JSON.stringify(exception));
    }
  });

  app.post(`/api/upload/csv`, async (request: Request, response: Response) => {
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
      const env: Environment = getCurrentEnvironment();
      try {
        const clientIp: string = request.headers['x-forwarded-for'] as string;
        const clientOrigin: string | undefined = getClientOrigin(
          request.headers
        );
        const datasource = new AuthRESTDataSource({
          environment: env,
          session: request.session,
          clientIp,
          clientOrigin,
        });
        const result = await datasource.post(
          `${env.api.collectionApiUrl}/entities/${request.query.parentId}/order`,
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
        response
          .status(extractErrorCode(exception))
          .end(JSON.stringify(exception));
        response.end(JSON.stringify(exception));
      }
    });
  });
};
