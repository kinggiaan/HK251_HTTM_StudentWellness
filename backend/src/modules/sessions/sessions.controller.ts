import type { Request, Response } from 'express';

import type { CreateSessionInput, ListSessionsQuery, UpdateSessionInput } from './sessions.schema';
import {
  createSession,
  deleteSession,
  getSessionById,
  listSessions,
  updateSession
} from './sessions.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listSessionsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: ListSessionsQuery };
  const result = await listSessions(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

export const getSessionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await getSessionById(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: session
  });
});

export const createSessionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: CreateSessionInput };
  const session = await createSession(body, buildContext(req));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: session
  });
});

export const updateSessionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req as Request & { body: UpdateSessionInput };
  const session = await updateSession(id, body, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: session
  });
});

export const deleteSessionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteSession(id, buildContext(req));

  res.status(HTTP_STATUS.NO_CONTENT).end();
});

