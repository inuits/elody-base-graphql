import { Express, Response, Request } from 'express';
import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { manager } from '../auth/index';
import { environment as env } from '../main';
import { Collection } from '../../../generated-types/type-defs';
import { GraphQLError } from 'graphql/index';
import jwt_decode from 'jwt-decode';
import { extractErrorCode } from '../helpers/helpers';
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware';

let staticToken: string | undefined | null = undefined;

const fetchWithTokenRefresh = async (
  url: string,
  options: any = { headers: {} },
  req: any,
  checkToken: boolean = false
) => {
  try {
    const token = req.session?.auth?.accessToken;
    if (token && token !== 'undefined') {
      Object.assign(options, { headers: { Authorization: `Bearer ${token}` } });
    }
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

export const addHeaders = (proxyReq: any, req: Request, res: Response) => {
  const mediafileId = extractIdFromMediafilePath(req.originalUrl);
  if (mediafileId)
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

  app.use(
    ['/api/mediafile', '/api/mediafile/download-with-ticket'],
    createProxyMiddleware({
      target: storageApiUrl,
      changeOrigin: true,
      pathRewrite: (path: string, req: Request) => {
        const newUrl: string = `${req.originalUrl.replace(
          '/api/mediafile',
          ''
        )}`;
        return newUrl;
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
      },
    })
  );

  app.use(
    '/api/iiif*.json',
    createProxyMiddleware({
      target: iiifUrlFrontend,
      changeOrigin: true,
      selfHandleResponse: true,
      pathRewrite: (path: string, req: Request) => {
        return `${req.originalUrl.replace('/api', '')}`;
      },
      onProxyReq: (proxyReq, req, res) => {
        addHeaders(proxyReq, req, res);
      },
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          try {
            const response = JSON.parse(responseBuffer.toString('utf8'));

            const idUrl = new URL(response.id);

            // Replace /iiif/ with /api/iiif/ in the pathname
            const updatedPath = idUrl.pathname.replace(
              /^\/iiif\/(?:image\/iiif\/|((\d+)\/))/,
              (_match, p1) => `/api/iiif/${p1 || ''}`
            );

            response.id = `${idUrl.origin}${updatedPath}`;

            return JSON.stringify(response);
          } catch (err) {
            console.error('Failed to rewrite IIIF id:', err);
            return responseBuffer;
          }
        }
      ),

      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send(err);
      },
    })
  );

  app.use('/api/iiif/*', async (req, res) => {
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
      res
        .status(extractErrorCode(error))
        .set({
          'Cache-Control': 'no-store',
          Pragma: 'no-cache',
        })
        .end(JSON.stringify(error));
    }
  });

  app.use('/api/mediafiles/*/download', async (req, res) => {
    try {
      const clientIp: string = req.headers['x-forwarded-for'] as string;
      const datasource = new AuthRESTDataSource({
        session: req.session,
        clientIp,
      });
      const url: string = `${
        env?.api.collectionApiUrl
      }${req.originalUrl.replace('/api/', '')}`;
      const response = await datasource.get(url);
      res.status(200).end(response);
    } catch (error: any) {
      res.status(extractErrorCode(error)).end(JSON.stringify(error));
    }
  });
};

export default applyMediaFileEndpoint;
