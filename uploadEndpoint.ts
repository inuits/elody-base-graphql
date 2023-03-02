import { Express, Request, Response } from 'express';
import { environment as env, environment } from 'base-graphql';
import { addJwt } from './sources/mediafiles';
import {
  EntityInput,
  Metadata,
  Entitytyping,
} from '../../generated-types/type-defs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const collectionBaseURL = `${env.api.collectionApiUrl}`;

const createNewEntity = async (
  createMediafile: Boolean,
  mediafileName: string,
  req: Request
): Promise<string> => {
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

  const url = await fetch(
    collectionBaseURL +
      `entities?create_mediafile=${
        createMediafile ? 1 : 0
      }&mediafile_filename=${mediafileName}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: addJwt(undefined, req, undefined),
        Accept: 'text/uri-list',
      },
    }
  ).then(async (res) => {
    return await res.text();
  });
  return url;
};

const uploadMediafile = async (
  uploadUrl: URL,
  mediafile: FormData,
  req: Request
) => {
  const upload = await fetch(uploadUrl, {
    headers: {
      Authorization: addJwt(undefined, req, undefined),
    },
    method: 'POST',
    body: mediafile,
  });
  return upload;
};

export const applyUploadEndpoint = (app: Express) => {
  app.post(`/api/upload`, async (req: Request, res: Response) => {
    try {
      const uploadUrl = await createNewEntity(
        true,
        req.query.filename as string,
        req
      );
      // const upload = await uploadMediafile(new URL(uploadUrl), req.body, req);
      res.status(200).setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ url: uploadUrl }));
    } catch (e) {
      res.status(500).end(e);
    }
  });
};
