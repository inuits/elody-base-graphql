import { Express } from 'express';
import cors from 'cors';
import { type Environment } from 'base-graphql';

export const enableCors = (app: Express, environment: Environment) => {
  const allowedOrigins = [];

  if (environment.corsAllowedOrigins)
    allowedOrigins.push(...environment.corsAllowedOrigins.split(','));

  if (!allowedOrigins.includes(environment.damsFrontend))
    allowedOrigins.push(environment.damsFrontend);

  app.use(
    cors({
      credentials: false,
      origin: allowedOrigins,
    })
  );
};
