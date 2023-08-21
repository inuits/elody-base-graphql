import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';

const logReq = (proxyReq: any, req: any, res: any) => {
  console.log('proxyReq', proxyReq);
  console.log('req', req);
  console.log('res', res);
};

const applyPromEndpoint = (app: Express, promUrl: string) => {
  if (promUrl) {
    app.use(
      '/api/prom',
      createProxyMiddleware({
        target: promUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/api/prom': '/api/v1',
        },
        onProxyReq: logReq,
      })
    );
  }
};

export default applyPromEndpoint;
