import { SessionStatus, SessionType } from '@prisma/client';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listSessionsSchema = z.object({
  query: z.object({
    studentId: z.string().uuid().optional(),
    consultantId: z.string().uuid().optional(),
    status: z.nativeEnum(SessionStatus).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  })
});

export const getSessionSchema = idParamSchema;

export const createSessionSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    consultantId: z.string().uuid().optional(),
    sessionDate: z.coerce.date(),
    duration: z.number().int().positive().max(480).optional(), // max 8 hours
    sessionType: z.nativeEnum(SessionType),
    topic: z.string().optional(),
    notes: z.string().optional(),
    followUpRequired: z.boolean().optional(),
    followUpDate: z.coerce.date().optional(),
    preSessionStress: z.number().int().min(1).max(10).optional(),
    postSessionStress: z.number().int().min(1).max(10).optional(),
    sessionOutcome: z.string().optional()
  })
});

export const updateSessionSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z
    .object({
      sessionDate: z.coerce.date().optional(),
      duration: z.number().int().positive().max(480).optional(),
      sessionType: z.nativeEnum(SessionType).optional(),
      status: z.nativeEnum(SessionStatus).optional(),
      topic: z.string().optional(),
      notes: z.string().optional(),
      followUpRequired: z.boolean().optional(),
      followUpDate: z.coerce.date().optional(),
      preSessionStress: z.number().int().min(1).max(10).optional(),
      postSessionStress: z.number().int().min(1).max(10).optional(),
      sessionOutcome: z.string().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided'
    })
});

export const deleteSessionSchema = idParamSchema;

export type ListSessionsQuery = z.infer<typeof listSessionsSchema>['query'];
export type CreateSessionInput = z.infer<typeof createSessionSchema>['body'];
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>['body'];

