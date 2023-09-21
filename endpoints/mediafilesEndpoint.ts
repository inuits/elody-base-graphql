import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';
import fetch from 'node-fetch';

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
    })
  );

  app.use('/api/iiif*.json', async (req, res) => {
    fetch(`${iiifUrlFrontend}${req.originalUrl.replace('/api', '')}`, {
      method: 'Get',
    }).then((resFetch) => {
      resFetch.json().then((json) => {
        res.send(
          JSON.parse(
            JSON.stringify(json).replace(
              iiifUrlFrontend,
              `//${req.headers.host}/api`
            )
          )
        );
      });
    });
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
