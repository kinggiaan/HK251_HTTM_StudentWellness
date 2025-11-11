import type { Request, Response } from 'express';

import type { CreateNotificationInput, ListNotificationsQuery } from './notifications.schema';
import {
  createNotification,
  dismissNotification,
  getNotificationById,
  getUnreadCount,
  listNotifications,
  markAllAsRead,
  markAsRead
} from './notifications.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listNotificationsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: ListNotificationsQuery };
  const result = await listNotifications(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

export const getNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await getNotificationById(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: notification
  });
});

export const createNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: CreateNotificationInput };
  const notification = await createNotification(body, buildContext(req));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: notification
  });
});

export const markAsReadHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await markAsRead(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: notification
  });
});

export const dismissNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await dismissNotification(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: notification
  });
});

export const markAllAsReadHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: { category?: string } };
  const category = body.category as any;
  const result = await markAllAsRead(category, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

export const getUnreadCountHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await getUnreadCount(buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

