import { Express } from 'express';
import cors from 'cors';
import { currentEnvironment } from '../environment';

export const enableCors = (app: Express) => {
  const allowedOrigins = [];

  if (currentEnvironment.corsAllowedOrigins)
    allowedOrigins.push(...currentEnvironment.corsAllowedOrigins.split(','));

  if (!allowedOrigins.includes(currentEnvironment.damsFrontend))
    allowedOrigins.push(currentEnvironment.damsFrontend);

  app.use(
    cors({
      credentials: false,
      origin: allowedOrigins,
    })
  );
};
