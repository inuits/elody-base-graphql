import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';
import { AuthRESTDataSource } from '../auth';
import { environment as env } from '../main';
import { Collection } from '../../../generated-types/type-defs';

let staticToken: string | undefined | null = undefined;

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

export const addHeader = (proxyReq: any, req: any, res: any) => {
  const mediafileId = extractIdFromMediafilePath(req.originalUrl);
  res.setHeader(
    'Link',
    `${env?.api.collectionApiUrl}${Collection.Mediafiles}/${mediafileId} ; rel="describedby" type="application/json"`
  );
};

const applyMediaFileEndpoint = (
  app: Express,
  storageApiUrl: string,
  iiifUrlFrontend: string,
  staticTokenInput: string | undefined | null
) => {
  staticToken = staticTokenInput;
  app.use(
    '/api/mediafile',
    createProxyMiddleware({
      target: storageApiUrl + '/download/',
      changeOrigin: true,
      pathRewrite: {
        '^/api/mediafile': '/',
      },
      onProxyReq: addJwt,
      onProxyRes: addHeader,
    })
  );

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
    } catch (error) {
      // Handle the error here. For example, send a 500 Internal Server Error response.
      res
        .status(500)
        .send({ error: 'An error occurred while processing your request.' });
    }
  });

  app.use(
    '/api/iiif',
    createProxyMiddleware({
      target: iiifUrlFrontend,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/',
      },
      onProxyReq: addJwt,
    })
  );
};

export default applyMediaFileEndpoint;
