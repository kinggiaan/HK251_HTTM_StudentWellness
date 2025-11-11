import pino from 'pino';

import env, { isProduction } from './env';

const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:HH:MM:ss'
        }
      },
  base: {
    env: env.NODE_ENV
  }
});

export default logger;

