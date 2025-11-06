import { Response as FetchResponse } from 'node-fetch';
import { Express, Request, Response } from 'express';
import { getCollectionValueForEntityType } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { fetchWithTokenRefresh } from './fetchWithToken';

export const applyExportEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();
  app.get(`/api/export/csv`, async (request: Request, response: Response) => {
    try {
      let fieldQueryParameter = '';
      (request.query.field as string[]).forEach(
        (field) => (fieldQueryParameter += `&field=${field}`)
      );

      await fetchWithTokenRefresh(
        `${env.api.collectionApiUrl}/${getCollectionValueForEntityType(
          request.query.type as string
        )}?order_by=${request.query.order_by}&asc=${request.query.asc}&type=${
          request.query.type
        }&ids=${request.query.ids}${fieldQueryParameter}`,
        {
          method: 'GET',
          headers: {
            Accept: 'text/csv',
          },
        },
        request
      )
        .then(async (urlResponse) => {
          if (!urlResponse.ok) throw urlResponse;
          response.status(200).setHeader('Content-Type', 'text/csv');
          response.end(await urlResponse.text());
        })
        .catch(async (UrlResponse: FetchResponse) =>
          response.status(UrlResponse.status).end(await UrlResponse.text())
        );
    } catch (exception) {
      response.status(500).end(String(exception));
    }
  });
};
