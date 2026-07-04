import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import authRouter from './modules/auth/auth.routes.js';
import healthRouter from './modules/health/health.routes.js';
import pilotsRouter from './modules/pilots/pilots.routes.js';
import profileRouter from './modules/profile/profile.routes.js';
import usersRouter from './modules/users/users.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/pilots', pilotsRouter);
  app.use('/profile', profileRouter);
  app.use('/users', usersRouter);
  app.use('/health', healthRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
