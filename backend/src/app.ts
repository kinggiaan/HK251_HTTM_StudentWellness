import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import env, { isProduction } from './config/env';
import {
  errorHandler,
  notFound,
  rateLimiter,
  requestLogger
} from './middleware';
import router from './routes';

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()) ?? true,
    credentials: true
  })
);
app.use(helmet());
app.use(requestLogger);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use('/api', rateLimiter, router);

if (!isProduction) {
  app.get('/', (_req, res) => {
    res.send('Student Mental Health Dashboard API');
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;

