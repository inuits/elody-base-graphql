import fetch, { Response as FetchResponse } from 'node-fetch';
import { addJwt } from './mediafilesEndpoint';
import { Express, Request, Response } from 'express';
import { getCollectionValueForEntityType } from '../helpers/helpers';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';

export const applyExportEndpoint = (app: Express) => {
  const env: Environment = getCurrentEnvironment();
  app.get(`/api/export/csv`, async (request: Request, response: Response) => {
    try {
      let fieldQueryParameter = '';
      (request.query.field as string[]).forEach(
        (field) => (fieldQueryParameter += `&field=${field}`)
      );

      await fetch(
        `${env.api.collectionApiUrl}/${getCollectionValueForEntityType(
          request.query.type as string
        )}?order_by=${request.query.order_by}&asc=${request.query.asc}&type=${
          request.query.type
        }&ids=${request.query.ids}${fieldQueryParameter}`,
        {
          method: 'GET',
          headers: {
            Accept: 'text/csv',
            Authorization: addJwt(undefined, request, undefined),
          },
        }
      )
        .then(async (urlResponse: FetchResponse) => {
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
