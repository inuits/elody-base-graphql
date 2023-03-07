import { Express, Request, Response } from 'express';
import { environment as env } from 'base-graphql';
import { addJwt } from './sources/mediafiles';
import {
  EntityInput,
  Metadata,
  Entitytyping,
  MediaFileInput,
} from '../../generated-types/type-defs';
import fetch, { Response as FetchResponse } from 'node-fetch';

const collectionBaseURL = `${env.api.collectionApiUrl}`;

export const applyUploadEndpoint = (app: Express) => {
  app.post(`/api/upload`, async (request: Request, response: Response) => {
    try {
      const uploadUrl = await getUploadUrl(request)
        .then(async (getUrlResponse: FetchResponse) => {
          if (!getUrlResponse.ok) throw getUrlResponse;
          return await getUrlResponse.text();
        }).catch(async (getUrlResponse: FetchResponse) =>
          response.status(getUrlResponse.status).end(await getUrlResponse.text())
        );

      response.status(200).setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ url: uploadUrl }));
    } catch (exception) {
      response.status(500).end(String(exception));
    }
  });
};

const getUploadUrl = async (request: Request): Promise<FetchResponse> => {
  const entityTypeToCreate = request.query.entityTypeToCreate as string;
  const filename = request.query.filename as string;

  if (!entityTypeToCreate)
    return await createMediafile(filename, request);

  return await createNewEntity(true, filename, request)
};

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

const createMediafile = (mediafileName: string, request: Request): Promise<FetchResponse> => {
  const body: MediaFileInput = {
    filename: mediafileName,
    metadata: [
      {
        key: 'title',
        value: mediafileName,
      },
    ] as Metadata[],
  };

  return fetch(collectionBaseURL + "mediafiles", {
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
