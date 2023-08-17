import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';
import fetch from 'node-fetch';

const logReq = (proxyReq: any, req: any, res: any) => {
  console.log(proxyReq);
};

const applyPromEndpoint = (app: Express, promUrl: string) => {
  app.use(
    '/api/prom',
    createProxyMiddleware({
      target: promUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/prom': '/',
      },
      onProxyReq: logReq,
    })
  );
};

export default applyPromEndpoint;
