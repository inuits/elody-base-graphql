import { Express, Request, Response as ExResponse } from 'express';
import { getCollectionValueForEntityType } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { fetchWithTokenRefresh } from './fetchWithToken';

const XLSX_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const applyExportXlsxEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();
  app.post(
    `/api/export/xlsx`,
    async (request: Request, response: ExResponse) => {
      // export can take some time, so we set a longer timeout for this endpoint
      const tenMinutes = 10 * 60 * 1000;
      request.setTimeout(tenMinutes);
      response.setTimeout(tenMinutes);

      try {
        const { type, order_by, asc, ids, limit } = request.body as {
          type: string;
          order_by?: string;
          asc?: string;
          ids?: string[];
          limit?: number;
        };

        const collectionPath = getCollectionValueForEntityType(type);
        const params = new URLSearchParams({
          type,
          order_by: order_by || 'date_created',
          asc: asc !== undefined && asc !== null ? String(asc) : '1',
        });

        if (ids && ids.length > 0) {
          params.append('ids', ids.join(','));
          params.set('limit', String(ids.length));
        } else {
          params.set('limit', String(limit ?? 20));
        }

        const upstreamResponse = await fetchWithTokenRefresh(
          `${env.api.collectionApiUrl}/${collectionPath}?${params.toString()}`,
          {
            method: 'GET',
            headers: { Accept: XLSX_MIME_TYPE },
          },
          request
        );

        if (!upstreamResponse.ok) {
          const errorText = await upstreamResponse.text();
          return response.status(upstreamResponse.status).send(errorText);
        }

        const xlsxBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
        response
          .status(200)
          .setHeader('Content-Type', XLSX_MIME_TYPE)
          .send(xlsxBuffer);
      } catch (exception) {
        const errorMessage =
          exception instanceof Error ? exception.message : String(exception);
        response.status(500).send(errorMessage);
      }
    }
  );
};
