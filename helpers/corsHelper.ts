import { Express } from 'express';
import cors from 'cors';
import { type Environment } from '../types/environmentTypes';

export const enableCors = (app: Express, environment: Environment) => {
  if (environment.corsAllowedOrigins === '*') {
    app.use(
      cors({
        origin: '*',
        credentials: false,
      })
    );
    return;
  }

  const allowedOrigins = environment.corsAllowedOrigins
    ? environment.corsAllowedOrigins.split(',')
    : [];

  if (!allowedOrigins.includes(environment.damsFrontend)) {
    allowedOrigins.push(environment.damsFrontend);
  }

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: false,
    })
  );
};

