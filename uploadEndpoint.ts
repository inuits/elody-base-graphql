import { Express, Request, Response } from 'express';
import { environment as env } from 'base-graphql';
import { addJwt } from './sources/mediafiles';
import {
  EntityInput,
  Metadata,
  MediaFileInput,
  Entitytyping,
} from '../../generated-types/type-defs';
import fetch, { Response as FetchResponse } from 'node-fetch';

type UploadRequestData = {
  body: any;
  uri: string;
};

const csvImportServiceUrl = `${env.api.csvImportServiceUrl}`;
const collectionBaseURL = `${env.api.collectionApiUrl}`;

const filenamePlaceholder = "filename_placeholder";
const createEntityUri = `${collectionBaseURL}entities?create_mediafile=1&mediafile_filename=${filenamePlaceholder}`;

export const applyUploadEndpoint = (app: Express) => {
  app.post(`/api/upload/request-data`, async (request: Request, response: Response) => {
    try {
      const uploadRequestData = await getUploadRequestData(request);
      response.end(JSON.stringify(uploadRequestData));
    } catch (exception) {
      response.status(500).end(String(exception));
    }
  });

  app.post(`/api/upload`, async (request: Request, response: Response) => {
    try {
      verifyUploadRequest(request);
      const uploadUrl = await getUploadUrl(request)
        .then(async (urlResponse: FetchResponse) => {
          if (!urlResponse.ok) throw urlResponse;
          return await urlResponse.text();
        })
        .catch(async (UrlResponse: FetchResponse) =>
          response
            .status(UrlResponse.status)
            .end(await UrlResponse.text())
        );

      response.status(200).setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ url: uploadUrl }));
    } catch (exception) {
      response.status(500).end(String(exception));
    }
  });
};

const getUploadRequestData = async (request: Request): Promise<UploadRequestData> => {
  const filetype = (request.query.filetype as string).trim();
  const entityToCreate = request.query.entityToCreate as Entitytyping;

  if (filetype === 'text/csv' && entityToCreate) {
    const response = await fetch(`${csvImportServiceUrl}/parser/entities`, {
        method: 'POST',
        body: request.body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: addJwt(undefined, request, undefined),
        },
      }
    );

    return {
      body: JSON.parse(response.body.read().toString()),
      uri: createEntityUri
    };
  }

  let uploadRequestData = defaultMediafileData();
  if (entityToCreate === "asset")
    uploadRequestData = defaultEntityData(entityToCreate);

  return uploadRequestData;
};

const defaultEntityData = (entityToCreate: Entitytyping): UploadRequestData => {
  const entityBody: EntityInput = {
    id: `${filenamePlaceholder}`,
    type: entityToCreate,
    metadata: [
      {
        key: 'title',
        value: `${filenamePlaceholder}`,
      },
    ] as Metadata[],
  };

  return {
    body: entityBody as string,
    uri: createEntityUri
  };
};

const defaultMediafileData = (): UploadRequestData => {
  const mediafileBody: MediaFileInput = {
    filename: `${filenamePlaceholder}`,
    metadata: [
      {
        key: 'title',
        value:`${filenamePlaceholder}`,
      },
    ] as Metadata[],
  };

  return {
    body: mediafileBody as string,
    uri: collectionBaseURL + 'mediafiles'
  };
};

const verifyUploadRequest = (request: Request) => {
  const replacePlaceholders = (obj: any, newValue: string) => {
    for (const key in obj) {
      const value = obj[key];
      if (value === filenamePlaceholder)
        obj[key] = newValue;
      else if (typeof value === 'object')
        replacePlaceholders(value, newValue);
    }
  };

  const uploadRequestData = request.body as UploadRequestData;
  const filename = request.query.filename as string;
  replacePlaceholders(uploadRequestData.body, filename);
  uploadRequestData.uri = uploadRequestData.uri.replace(filenamePlaceholder, filename);
};

const getUploadUrl = async (request: Request): Promise<FetchResponse> => {
  const uploadRequestData = request.body as UploadRequestData;
  return fetch(uploadRequestData.uri, {
    method: 'POST',
    body: JSON.stringify(uploadRequestData.body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: addJwt(undefined, request, undefined),
      Accept: 'text/uri-list'
    }
  });
};
