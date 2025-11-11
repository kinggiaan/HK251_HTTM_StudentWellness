import type { UserRole } from '@prisma/client';
import type { RequestHandler } from 'express';

import AppError from '../utils/appError';
import { HTTP_STATUS } from '../utils/httpStatus';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken<{ sub: string; role: UserRole; email: string }>(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };

    next();
  } catch {
    throw new AppError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED);
  }
};

export const requireRole = (roles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
    }

    next();
  };
};

