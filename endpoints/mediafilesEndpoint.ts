import { Express, Response, Request } from 'express';
import { getCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { Collection } from '../../../generated-types/type-defs';
import { extractErrorCode } from '../helpers/helpers';
import {
  createProxyMiddleware,
  responseInterceptor,
} from 'http-proxy-middleware';
import { fetchWithTokenRefresh } from './fetchWithToken';

function extractIdFromMediafilePath(path: string): string | null {
  const regex = /\/api\/mediafile\/([a-f\d-]+)-[^\/]+$/;
  const match = path.match(regex);

  return match ? match[1] : null;
}

export const addHeaders = (proxyReq: any, req: Request, res: Response) => {
  const env: Environment = getCurrentEnvironment();
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

const getDownloadUrlForMediafile = async (
  mediafileId: string,
  req: Request,
  environment: Environment,
  kind: 'transcode' | 'original' = 'transcode'
): Promise<string> => {
  try {
    const downloadUrls = await fetchWithTokenRefresh(
      `${environment.api.collectionApiUrl}mediafiles/${mediafileId}/download-urls`,
      { method: 'GET' },
      req
    );
    const response: any = await downloadUrls.json();
    if (kind === 'transcode') return response['transcode_file_location'];
    else return response['original_file_location'];
  } catch (e) {
    console.error(e);
    return JSON.stringify(e);
  }
};

const applyMediaFileEndpoint = (app: Express, environment: Environment) => {
  app.use(
    ['/api/mediafile/*', '/api/mediafile/download-with-ticket'],
    createProxyMiddleware({
      target: environment.api.storageApiUrl,
      changeOrigin: true,
      pathRewrite: async (path: string, req: Request) => {
        const filename = path.split('/').at(-1);
        if (!filename)
          throw Error('Unable to request download url for mediafile');
        const full = await getDownloadUrlForMediafile(
          filename,
          req,
          environment
        );
        return full.replace(environment.api.storageApiUrl, '');
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
      target: environment.api.iiifUrl,
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
        `${environment.api.iiifUrl}${req.originalUrl.replace('/api', '')}`,
        { method: 'GET' },
        req
      );

      if (!response.ok) {
        throw response;
      }

      const blob = await response.blob();
      res.setHeader('Content-Type', blob.type);
      // @ts-ignore
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
};

export default applyMediaFileEndpoint;
