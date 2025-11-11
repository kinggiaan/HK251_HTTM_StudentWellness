import type { Request, Response } from 'express';

import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from './user.schema';
import {
  canManageUsers,
  createUser,
  deleteUser,
  getCurrentUser,
  getUserById,
  listUsers,
  updateUser
} from './user.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  actorId: req.user!.id,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listUsersHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!canManageUsers(req.user!.role)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Forbidden'
    });
  }

  const { query } = req as Request & { query: ListUsersQuery };
  const result = await listUsers(query);

  res.json({
    success: true,
    data: result
  });
});

export const getUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!canManageUsers(req.user!.role) && req.user!.id !== id) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Forbidden'
    });
  }

  const user = await getUserById(id);

  res.json({
    success: true,
    data: user
  });
});

export const createUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!canManageUsers(req.user!.role)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Forbidden'
    });
  }

  const { body } = req as Request & { body: CreateUserInput };
  const user = await createUser(body, buildContext(req));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: user
  });
});

export const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!canManageUsers(req.user!.role) && req.user!.id !== id) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Forbidden'
    });
  }

  const { body } = req as Request & { body: UpdateUserInput };
  const user = await updateUser(id, body, buildContext(req));

  res.json({
    success: true,
    data: user
  });
});

export const deleteUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!canManageUsers(req.user!.role)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      message: 'Forbidden'
    });
  }

  await deleteUser(req.params.id, buildContext(req));

  res.status(HTTP_STATUS.NO_CONTENT).end();
});

export const getMeHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!.id);
  res.json({
    success: true,
    data: user
  });
});

