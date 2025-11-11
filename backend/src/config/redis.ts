import Redis from 'ioredis';

import env from './env';
import logger from './logger';

const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

redis.on('error', (error) => {
  logger.error({ error }, 'Redis error');
});

export default redis;

