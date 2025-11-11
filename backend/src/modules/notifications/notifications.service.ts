import { NotificationCategory, NotificationPriority, NotificationType, UserRole } from '@prisma/client';
import type { Prisma } from '@prisma/client';

import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { createAuditLog, toNotificationResponse } from '../common';
import type { CreateNotificationInput, ListNotificationsQuery } from './notifications.schema';

interface RequestContext {
  userId: string;
  role: UserRole;
  ip?: string;
  userAgent?: string;
}

export async function listNotifications(query: ListNotificationsQuery, context: RequestContext) {
  const where: Prisma.NotificationWhereInput = {
    userId: context.userId
  };

  if (query.type) {
    where.type = query.type as NotificationType;
  }
  if (query.category) {
    where.category = query.category;
  }
  if (query.priority) {
    where.priority = query.priority as NotificationPriority;
  }
  if (query.read !== undefined) {
    where.read = query.read;
  }
  if (query.dismissed !== undefined) {
    where.dismissed = query.dismissed;
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        relatedStudent: {
          select: {
            id: true,
            studentId: true,
            name: true
          }
        },
        relatedSession: {
          select: {
            id: true,
            sessionDate: true,
            topic: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.notification.count({ where })
  ]);

  return {
    data: notifications.map((notification) => {
      const response = toNotificationResponse(notification);
      return {
        ...response,
        relatedStudent: notification.relatedStudent || undefined,
        relatedSession: notification.relatedSession || undefined
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getNotificationById(id: string, context: RequestContext) {
  const notification = await prisma.notification.findUnique({
    where: { id },
    include: {
      relatedStudent: true,
      relatedSession: true
    }
  });

  if (!notification) {
    throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
  }

  // Users chỉ có thể xem notifications của chính họ
  if (notification.userId !== context.userId && context.role !== 'admin') {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  return {
    ...toNotificationResponse(notification),
    relatedStudent: notification.relatedStudent,
    relatedSession: notification.relatedSession
  };
}

export async function createNotification(input: CreateNotificationInput, context: RequestContext) {
  // Chỉ admin có thể tạo notifications cho users khác
  const userId = input.userId ?? context.userId;
  if (userId !== context.userId && context.role !== 'admin') {
    throw new AppError('Forbidden: Cannot create notification for other users', HTTP_STATUS.FORBIDDEN);
  }

  // Validate related entities exist
  if (input.relatedStudentId) {
    const student = await prisma.student.findUnique({
      where: { id: input.relatedStudentId }
    });
    if (!student) {
      throw new AppError('Student not found', HTTP_STATUS.BAD_REQUEST);
    }
  }

  if (input.relatedSessionId) {
    const session = await prisma.counselingSession.findUnique({
      where: { id: input.relatedSessionId }
    });
    if (!session) {
      throw new AppError('Session not found', HTTP_STATUS.BAD_REQUEST);
    }
  }

  const notification = await prisma.notification.create({
    data: {
      userId,
      type: input.type,
      category: input.category,
      title: input.title,
      message: input.message,
      priority: input.priority,
      relatedStudentId: input.relatedStudentId,
      relatedSessionId: input.relatedSessionId
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'notification.create',
    resource: notification.id,
    metadata: { userId, category: input.category },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return toNotificationResponse(notification);
}

export async function markAsRead(id: string, context: RequestContext) {
  const notification = await prisma.notification.findUnique({
    where: { id }
  });

  if (!notification) {
    throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
  }

  // Users chỉ có thể mark notifications của chính họ
  if (notification.userId !== context.userId && context.role !== 'admin') {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: {
      read: true,
      readAt: new Date()
    }
  });

  return toNotificationResponse(updated);
}

export async function dismissNotification(id: string, context: RequestContext) {
  const notification = await prisma.notification.findUnique({
    where: { id }
  });

  if (!notification) {
    throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
  }

  // Users chỉ có thể dismiss notifications của chính họ
  if (notification.userId !== context.userId && context.role !== 'admin') {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: {
      dismissed: true
    }
  });

  return toNotificationResponse(updated);
}

export async function markAllAsRead(category: NotificationCategory | undefined, context: RequestContext) {
  const where: {
    userId: string;
    read: boolean;
    category?: NotificationCategory;
  } = {
    userId: context.userId,
    read: false
  };

  if (category) {
    where.category = category;
  }

  const result = await prisma.notification.updateMany({
    where,
    data: {
      read: true,
      readAt: new Date()
    }
  });

  return {
    count: result.count
  };
}

export async function getUnreadCount(context: RequestContext) {
  const count = await prisma.notification.count({
    where: {
      userId: context.userId,
      read: false,
      dismissed: false
    }
  });

  return { count };
}

