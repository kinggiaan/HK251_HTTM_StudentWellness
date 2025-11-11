import type { Request, Response } from 'express';

import type {
  ChangePasswordInput,
  LoginInput,
  RefreshInput
} from './auth.schema';
import {
  changePassword,
  login,
  logout,
  refreshTokens
} from './auth.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: LoginInput };
  const result = await login(body, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      user: result.user,
      token: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn
      }
    }
  });
});

export const refreshHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: RefreshInput };
  const result = await refreshTokens(body, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      user: result.user,
      token: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn
      }
    }
  });
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: RefreshInput };
  await logout(body, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const changePasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: ChangePasswordInput };

  await changePassword(req.user!.id, body, buildContext(req));

  res.status(HTTP_STATUS.NO_CONTENT).end();
});

