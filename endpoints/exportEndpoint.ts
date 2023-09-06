import fetch, { Response as FetchResponse } from 'node-fetch';
import { addJwt } from '../sources/mediafiles';
import { environment as env } from '../main';
import { Express, Request, Response } from 'express';

export const applyExportEndpoint = (app: Express) => {
  app.get(`/api/export/csv`, async (request: Request, response: Response) => {
    try {
      let fieldQueryParameter = '';
      (request.query.field as string[]).forEach(
        (field) => (fieldQueryParameter += `&field[]=${field}`)
      );

      await fetch(
        `${env?.api.collectionApiUrl}/entities?ids=${request.query.ids}${fieldQueryParameter}`,
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
