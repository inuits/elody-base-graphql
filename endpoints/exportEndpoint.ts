import { Response as FetchResponse } from 'node-fetch';
import { Express, Request, Response } from 'express';
import { getCollectionValueForEntityType } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { fetchWithTokenRefresh } from './fetchWithToken';

export const applyExportEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();
  app.post(`/api/export/csv`, async (request: Request, response: Response) => {
    try {
      const { type, order_by, asc, ids, field } = request.body as {
        type: string;
        order_by: string;
        asc: string;
        ids: string[];
        field: string[];
      };

      const collectionPath = getCollectionValueForEntityType(type);
      const baseUrl = `${env.api.collectionApiUrl}/${collectionPath}`;

      const params = new URLSearchParams({
        order_by,
        asc,
        type,
        ids: ids.join(','),
        limit: String(ids.length),
      });

      if (Array.isArray(field)) {
        field.forEach((f) => params.append('field', f));
      }

      const upstreamResponse = await fetchWithTokenRefresh(
        `${baseUrl}?${params.toString()}`,
        {
          method: 'GET',
          headers: { Accept: 'text/csv' },
        },
        request
      );

      if (!upstreamResponse.ok) {
        const errorText = await upstreamResponse.text();
        return response.status(upstreamResponse.status).send(errorText);
      }

      const csvContent = await upstreamResponse.text();
      
      response
        .status(200)
        .setHeader('Content-Type', 'text/csv')
        .send(csvContent);

    } catch (exception) {
      const errorMessage = exception instanceof Error ? exception.message : String(exception);
      response.status(500).send(errorMessage);
    }
  });
};
