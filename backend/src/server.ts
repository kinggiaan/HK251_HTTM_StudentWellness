import http from 'http';
import { Server } from 'socket.io';

import app from './app';
import { env, logger, redis } from './config';
import registerWebsocket from './websocket';

async function bootstrap() {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()) ?? '*',
      credentials: true
    }
  });

  app.set('io', io);
  registerWebsocket(io);

  try {
    await redis.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to Redis');
  }

  server.listen(env.PORT, env.HOST, () => {
    logger.info(`Server listening on http://${env.HOST}:${env.PORT}`);
  });

  const handleShutdown = (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');
    server.close(() => {
      logger.info('HTTP server closed');
      redis.quit().finally(() => {
        process.exit(0);
      });
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

bootstrap().catch((error) => {
  logger.error({ error }, 'Failed to bootstrap server');
  process.exit(1);
});

