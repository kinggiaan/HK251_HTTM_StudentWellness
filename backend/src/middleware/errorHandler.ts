import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { logger } from '../config';
import AppError from '../utils/appError';
import { HTTP_STATUS } from '../utils/httpStatus';

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  void _next;
  let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    status = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
    details = err.format();
  } else if (err instanceof PrismaClientKnownRequestError) {
    status = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err instanceof PrismaClientValidationError) {
    status = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  if (status >= 500) {
    logger.error(
      {
        err,
        path: req.path,
        method: req.method,
        correlationId: req.headers['x-request-id']
      },
      'Unhandled error'
    );
  } else {
    logger.warn(
      {
        err,
        path: req.path,
        method: req.method,
        correlationId: req.headers['x-request-id']
      },
      'Operational error'
    );
  }

  res.status(status).json({
    success: false,
    message,
    details
  });
};

export default errorHandler;

