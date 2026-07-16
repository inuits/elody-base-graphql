import { Express, Request, Response as ExResponse} from 'express';
import { getCollectionValueForEntityType } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { fetchWithTokenRefresh } from './fetchWithToken';

export const applyExportEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();
  app.post(`/api/export/csv`, async (request: Request, response: ExResponse) => {
    try {
      const { type, order_by, asc, ids: rawIds, field, parentId, relation } = request.body as {
        type: string;
        order_by: string;
        asc: string;
        ids: string[];
        field: string[];
        parentId?: string;
        relation?: string;
      };

      let ids = rawIds;
      if (parentId && relation && (!rawIds || rawIds.length === 0)) {
        const entityUrl = `${env.api.collectionApiUrl}/entities/${parentId}`;
        const entityResponse = await fetchWithTokenRefresh(entityUrl, { method: 'GET' }, request);
        if (!entityResponse.ok) {
          const errorText = await entityResponse.text();
          return response.status(entityResponse.status).send(errorText);
        }
        const entity = await entityResponse.json() as { relations?: { type: string; key: string }[] };
        ids = (entity.relations ?? [])
          .filter((r) => r.type === relation)
          .map((r) => r.key);
      }

      const collectionPath = getCollectionValueForEntityType(type);
      let upstreamResponse: Response;

      const params = new URLSearchParams({
        type,
        limit: String(ids.length),
        order_by: order_by || 'date_created',
        asc: asc !== undefined && asc !== null ? String(asc) : '1',
      });

      if (env.api.csvExportService?.csvExportServiceEnabled) {
        const baseUrl = `${env.api.csvExportService.csvExportServiceUrl}/${collectionPath}`;

        upstreamResponse = await fetchWithTokenRefresh(
          `${baseUrl}?${params.toString()}`,
          {
            method: 'POST',
            headers: { Accept: 'text/csv', 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ids: ids,
              fields: field,
            }),
          },
          request
        );
      } else {
        const baseUrl = `${env.api.collectionApiUrl}/${collectionPath}`;

        params.append('ids', ids.join(','));

        upstreamResponse = await fetchWithTokenRefresh(
          `${baseUrl}?${params.toString()}`,
          {
            method: 'GET',
            headers: { Accept: 'text/csv' },
          },
          request
        );
      }

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
