import { RiskLevel, StudentStatus } from '@prisma/client';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listStudentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
    status: z.nativeEnum(StudentStatus).optional(),
    sortBy: z.enum(['name', 'riskScore', 'lastAssessment']).optional(),
    order: z.enum(['asc', 'desc']).optional()
  })
});

export const getStudentSchema = idParamSchema;

export const createStudentSchema = z.object({
  body: z.object({
    studentId: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5).optional(),
    department: z.string().optional(),
    year: z.coerce.number().int().min(1).max(6).optional(),
    avatarUrl: z.string().url().optional(),
    stressLevel: z.number().int().min(1).max(10).optional(),
    sleepHours: z.number().min(0).max(24).optional(),
    riskScore: z.number().int().min(0).max(100).optional(),
    riskLevel: z.nativeEnum(RiskLevel).optional(),
    status: z.nativeEnum(StudentStatus).optional(),
    consultantId: z.string().uuid().optional()
  })
});

export const updateStudentSchema = z
  .object({
    body: z
      .object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().min(5).optional(),
        department: z.string().optional(),
        year: z.coerce.number().int().min(1).max(6).optional(),
        avatarUrl: z.string().url().nullable().optional(),
        stressLevel: z.number().int().min(1).max(10).optional(),
        sleepHours: z.number().min(0).max(24).optional(),
        riskScore: z.number().int().min(0).max(100).optional(),
        riskLevel: z.nativeEnum(RiskLevel).optional(),
        status: z.nativeEnum(StudentStatus).optional(),
        consultantId: z.string().uuid().optional()
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided'
      })
  })
  .merge(idParamSchema);

export const deleteStudentSchema = idParamSchema;

export const importStudentsSchema = z.object({
  query: z.object({
    upsert: z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),
    consultantId: z.string().uuid().optional()
  })
});

export type ListStudentsQuery = z.infer<typeof listStudentsSchema>['query'];
export type CreateStudentInput = z.infer<typeof createStudentSchema>['body'];
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>['body'];
export type ImportStudentsQuery = z.infer<typeof importStudentsSchema>['query'];

