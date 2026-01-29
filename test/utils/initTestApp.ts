import express, { Express } from 'express';
import { Environment } from '../../types/environmentTypes';

export type RouteHandler = (app: Express, env: Environment) => void;

export const createTestApp = (
  routeHandler: RouteHandler,
  environment: Environment
): Express => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  routeHandler(app, environment);

  app.use((err: any, req: any, res: any, next: any) => {
    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json({ error: err.message });
  });

  return app;
};

export const getMockEnvironment = (overrides: Partial<Environment> = {}): Environment => {
  return {
    ...overrides,
  } as any;
};
