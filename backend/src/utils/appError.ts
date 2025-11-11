import { HTTP_STATUS, type HttpStatusCode } from './httpStatus';

export default class AppError extends Error {
  statusCode: HttpStatusCode;

  isOperational: boolean;

  details?: unknown;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    options?: { details?: unknown; isOperational?: boolean }
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.details = options?.details;

    Error.captureStackTrace(this, this.constructor);
  }
}

