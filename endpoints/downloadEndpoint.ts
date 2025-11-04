import { AuthRESTDataSource } from '../main';
import { Express, Request, Response } from 'express';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export const applyDownloadEndpoint = (app: Express) => {
  app.post(
    `/api/download/csv`,
    async (request: Request, response: Response) => {
      try {
        const environment: Environment = getCurrentEnvironment();
        const returnType = request.query['return_type'];
        const clientIp: string = request.headers['x-forwarded-for'] as string;
        const datasource = new AuthRESTDataSource({
          environment,
          session: request.session,
          clientIp,
        });
        const result = await datasource.post(
          `${environment.api.collectionApiUrl}/entities/${
            request.body.parentId
          }/order?order_by=order${
            returnType ? `&return_type=${returnType}` : ''
          }`,
          {
            method: 'GET',
          }
        );
        response.status(200).setHeader('Content-Type', 'text/csv');
        response.end(result);
      } catch (exception: any) {
        const status = exception.extensions.response.status || 500;
        const statusText =
          exception.extensions.response.statusText || String(exception);
        response.status(status).end(statusText);
        response.end(JSON.stringify(exception));
      }
    }
  );
};
