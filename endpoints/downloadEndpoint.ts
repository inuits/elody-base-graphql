import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { Express, Request, Response } from 'express';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { extractErrorCode, getClientOrigin } from '../helpers/helpers';
import { orderEndpointUrl } from './orderEndpointUrl';

export const applyDownloadEndpoint = (app: Express) => {
  app.post(
    `/api/download/csv`,
    async (request: Request, response: Response) => {
      try {
        const environment: Environment = getCurrentEnvironment();
        const clientIp: string = request.headers['x-forwarded-for'] as string;
        const clientOrigin: string | undefined = getClientOrigin(
          request.headers
        );
        const datasource = new AuthRESTDataSource({
          environment,
          session: request.session,
          clientIp,
          clientOrigin,
        });
        const result = await datasource.post(
          orderEndpointUrl(
            environment.api.collectionApiUrl,
            request.body.parentId,
            {
              order_by: 'order',
              return_type: request.query['return_type'] as string | undefined,
              relation_type: request.query['relation_type'] as
                | string
                | undefined,
            }
          ),
          {
            method: 'GET',
          }
        );
        response.status(200).setHeader('Content-Type', 'text/csv');
        response.end(result);
      } catch (exception: any) {
        response
          .status(extractErrorCode(exception))
          .end(
            exception?.extensions?.response?.statusText || String(exception)
          );
      }
    }
  );
};
