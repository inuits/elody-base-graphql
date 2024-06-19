import fetch, { Response as FetchResponse } from 'node-fetch';
import { addJwt } from './mediafilesEndpoint';
import { environment as env } from '../main';
import { Express, Request, Response } from 'express';

export const applyDownloadEndpoint = (app: Express) => {
    app.post(
      `/api/download/csv`,
      async (request: Request, response: Response) => {
        try {
            await fetch(
                `${env?.api.collectionApiUrl}/entities${request.query.parentId}`,
                {
                    method: 'POST',
                    body: JSON.stringify(request.query.relationType),
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