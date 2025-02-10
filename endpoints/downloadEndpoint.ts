import { AuthRESTDataSource, environment as env } from '../main';
import { Express, Request, Response } from 'express';

export const applyDownloadEndpoint = (app: Express) => {
  app.post(
    `/api/download/csv`,
    async (request: Request, response: Response) => {
      try {
        const returnType = request.query['return_type'];
        const clientIp: string = request.headers['x-forwarded-for'] as string;
        const datasource = new AuthRESTDataSource({
          session: request.session,
          clientIp,
        });
        const result = await datasource.post(
          `${env?.api.collectionApiUrl}/entities/${
            request.body.parentId
          }/order?${returnType ? `return_type=${returnType}` : ''}`,
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
