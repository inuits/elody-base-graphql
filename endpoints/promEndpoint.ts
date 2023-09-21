import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';

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
      })
    );
  }
};

export default applyPromEndpoint;
