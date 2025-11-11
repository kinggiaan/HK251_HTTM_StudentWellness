import { randomUUID } from 'crypto';
import type { Request } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import type { LevelWithSilent } from 'pino';
import pinoHttp, { type Options } from 'pino-http';

import logger from '../config/logger';

const options: Options<IncomingMessage, ServerResponse> = {
  logger,
  genReqId: (req: IncomingMessage, res: ServerResponse) => {
    const incoming = req.headers['x-request-id'];
    const id = typeof incoming === 'string' && incoming.length > 0 ? incoming : randomUUID();
    (req as unknown as Request).correlationId = id;
    res.setHeader('x-request-id', id);
    return id;
  },
  customLogLevel: (
    _req: IncomingMessage,
    res: ServerResponse,
    err?: Error
  ): LevelWithSilent => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  }
};

const requestLogger = pinoHttp(options);

export default requestLogger;

