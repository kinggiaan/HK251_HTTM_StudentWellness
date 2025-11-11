import rateLimit from 'express-rate-limit';

import env from '../config/env';

const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

export default rateLimiter;

