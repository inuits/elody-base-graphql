import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';
import fetch from 'node-fetch';


const applyPromEndpoint = (
  app: Express,
  promUrl: string,
) => {
  app.use(
    '/api/prom',
    createProxyMiddleware({
      target: promUrl,
      changeOrigin: true,
    })
  )
};

export default applyPromEndpoint;
