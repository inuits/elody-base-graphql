import { Express, Request, Response } from 'express';
import { environment as env } from 'base-graphql';
import { addJwt } from './sources/mediafiles';
import {
  EntityInput,
  Metadata,
  Entitytyping,
} from '../../generated-types/type-defs';
import fetch, { Response as FetchResponse } from 'node-fetch';

const collectionBaseURL = `${env.api.collectionApiUrl}`;

const createNewEntity = (
  createMediafile: Boolean, mediafileName: string, request: Request
): Promise<FetchResponse> => {
  const body: EntityInput = {
    id: mediafileName,
    type: Entitytyping.Asset,
    metadata: [
      {
        key: 'title',
        value: mediafileName,
      },
    ] as Metadata[],
  };

  return fetch(
    collectionBaseURL +
      `entities?create_mediafile=${
        createMediafile ? 1 : 0
      }&mediafile_filename=${mediafileName}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: addJwt(undefined, request, undefined),
        Accept: 'text/uri-list',
      },
    }
  );
};

export const applyUploadEndpoint = (app: Express) => {
  app.post(`/api/upload`, async (request: Request, response: Response) => {
    try {
      const uploadUrl = await createNewEntity(
        true, request.query.filename as string, request
      ).then(async (newEntityResponse: FetchResponse) => {
        if (!newEntityResponse.ok) throw newEntityResponse;
        return await newEntityResponse.text();
      }).catch(async (newEntityResponse: FetchResponse) =>
        response.status(newEntityResponse.status).end(await newEntityResponse.text())
      );

      response.status(200).setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ url: uploadUrl }));
    } catch (exception) {
      response.status(500).end(exception);
    }
  });
};
