import { Express } from 'express';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { manager } from '../auth/index';
import { environment as env } from '../main';
import { Collection } from '../../../generated-types/type-defs';
import { GraphQLError } from 'graphql/index';
import jwt_decode from 'jwt-decode';

let staticToken: string | undefined | null = undefined;

const fetchWithTokenRefresh = async (
  url: string,
  options: any = {},
  req: any,
  checkToken: boolean = false
) => {
  try {
    const token = req.session?.auth?.accessToken;
    options.headers = { Authorization: `Bearer ${token}` };
    let response: any;
    const isExpired = checkToken && token && isTokenExpired(token);
    if (!checkToken || (checkToken && !isExpired)) {
      response = await fetch(url, options);
    }

    if (response?.status === 401 || (checkToken && isExpired)) {
      const refreshTokenResponse = await manager?.refresh(
        req?.session?.auth?.accessToken,
        req?.session?.auth?.refreshToken
      );
      if (!refreshTokenResponse) {
        return Promise.reject(
          new GraphQLError(`AUTH | REFRESH FAILED`, {
            extensions: {
              statusCode: 401,
            },
          })
        );
      }
      req.session.auth = refreshTokenResponse;

      options.headers.Authorization = `Bearer ${refreshTokenResponse.accessToken}`;
      const retryResponse = await fetch(url, options);

      return retryResponse;
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Proxy for storage API
export const addJwt = (proxyReq: any, req: any, res: any) => {
  const auth =
    req.session && req.session.auth && req.session.auth.accessToken
      ? req.session.auth.accessToken
      : staticToken;

  if (proxyReq) {
    proxyReq.setHeader('Authorization', 'Bearer ' + auth);
  }

  return ('Bearer ' + auth) as string;
};

function extractIdFromMediafilePath(path: string): string | null {
  const regex = /\/api\/mediafile\/([a-f\d-]+)-[^\/]+$/;
  const match = path.match(regex);

  return match ? match[1] : null;
}

function isTokenExpired(token: string) {
  try {
    const decodedToken: any = jwt_decode(token);
    return Date.now() >= decodedToken.exp * 1000 ? true : false;
  } catch (error: any) {
    console.error(`message: ${error?.message}, token: ${token}`);
    throw new GraphQLError(`TOKEN IS NOT SPECIFIED`, {
      extensions: {
        statusCode: 401,
      },
    });
  }
}

export const addHeader = (proxyReq: any, req: any, res: any) => {
  const mediafileId = extractIdFromMediafilePath(req.originalUrl);
  res.setHeader(
    'Link',
    `${env?.api.collectionApiUrl}${Collection.Mediafiles}/${mediafileId} ; rel="describedby" type="application/json"`
  );
};

// pump the stream data
const pump = (reader: any, res: any) => {
  reader
    .read()
    .then(({ done, value }: { done: any; value: any }) => {
      if (done) {
        reader.releaseLock();
        res.end();
        return;
      }
      res.write(value);
      pump(reader, res);
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).end(JSON.stringify({ error: 'Internal Server Error' }));
    });
};

const applyMediaFileEndpoint = (
  app: Express,
  storageApiUrl: string,
  iiifUrlFrontend: string,
  staticTokenInput: string | undefined | null
) => {
  staticToken = staticTokenInput;

  app.use('/api/mediafile/download-with-ticket', async (req: any, res: any) => {
    res.redirect(
      302,
      `${env?.api.storageApiUrlExt}${req.originalUrl.replace(
        '/api/mediafile/',
        ''
      )}`
    );
  });

  app.use('/api/mediafile', async (req: any, res: any) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${storageApiUrl}${req.originalUrl.replace('/api/mediafile', '')}`,
        { method: 'GET' },
        req
      );

      if (!response.ok) {
        throw response;
      }

      addHeader(null, req, res);
      const blob = await response.blob();
      res.setHeader('Content-Type', blob.type);
      const reader = blob.stream().getReader();

      pump(reader, res);
    } catch (error: any) {
      const errorStatus = error.extensions?.statusCode || 500;
      res.status(errorStatus).end(JSON.stringify(error));
    }
  });

  app.use('/api/iiif*.json', async (req, res) => {
    try {
      const datasource = new AuthRESTDataSource({ session: req.session });
      const response = await datasource.get(
        `${iiifUrlFrontend}${req.originalUrl.replace('/api', '')}`
      );
      res.send(
        JSON.parse(
          JSON.stringify(response).replace(
            iiifUrlFrontend,
            `//${req.headers.host}/api`
          )
        )
      );
    } catch (error: any) {
      const errorStatus = error.extensions?.statusCode || 500;
      res.status(errorStatus).end(JSON.stringify(error));
    }
  });

  app.use('/api/iiif', async (req, res) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${iiifUrlFrontend}${req.originalUrl.replace('/api', '')}`,
        { method: 'GET' },
        req,
        true
      );

      if (!response.ok) {
        throw response;
      }

      const blob = await response.blob();
      res.setHeader('Content-Type', blob.type);
      const reader = blob.stream().getReader();

      pump(reader, res);
    } catch (error: any) {
      const errorStatus = error.extensions?.statusCode || 500;
      res.status(errorStatus).end(JSON.stringify(error));
    }
  });
};

export default applyMediaFileEndpoint;
