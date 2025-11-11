import { NotificationCategory, NotificationPriority, NotificationType } from '@prisma/client';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listNotificationsSchema = z.object({
  query: z.object({
    type: z.nativeEnum(NotificationType).optional(),
    category: z.nativeEnum(NotificationCategory).optional(),
    priority: z.nativeEnum(NotificationPriority).optional(),
    read: z.coerce.boolean().optional(),
    dismissed: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  })
});

export const getNotificationSchema = idParamSchema;

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.string().uuid().optional(),
    type: z.nativeEnum(NotificationType),
    category: z.nativeEnum(NotificationCategory),
    title: z.string().min(1),
    message: z.string().min(1),
    priority: z.nativeEnum(NotificationPriority),
    relatedStudentId: z.string().uuid().optional(),
    relatedSessionId: z.string().uuid().optional()
  })
});

export const markAsReadSchema = idParamSchema;

export const dismissNotificationSchema = idParamSchema;

export const markAllAsReadSchema = z.object({
  body: z.object({
    category: z.nativeEnum(NotificationCategory).optional()
  })
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>['query'];
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];

