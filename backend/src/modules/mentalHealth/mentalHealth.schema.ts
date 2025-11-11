import { AssessmentType } from '@prisma/client';
import { z } from 'zod';

const recordIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listHealthRecordsSchema = z.object({
  query: z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  })
});

export const getHealthRecordSchema = recordIdParamSchema;

export const createHealthRecordSchema = z.object({
  body: z.object({
    stressLevel: z.number().int().min(1).max(10),
    anxietyLevel: z.number().int().min(1).max(10),
    depressionLevel: z.number().int().min(1).max(10),
    sleepHours: z.number().min(0).max(24),
    sleepQuality: z.number().int().min(1).max(10),
    assessmentType: z.nativeEnum(AssessmentType),
    assessmentDate: z.coerce.date().optional(),
    notes: z.string().optional(),
    predictedRisk: z.number().int().min(0).max(100).optional(),
    modelVersion: z.string().optional()
  })
});

export const updateHealthRecordSchema = z.object({
  body: z
    .object({
      stressLevel: z.number().int().min(1).max(10).optional(),
      anxietyLevel: z.number().int().min(1).max(10).optional(),
      depressionLevel: z.number().int().min(1).max(10).optional(),
      sleepHours: z.number().min(0).max(24).optional(),
      sleepQuality: z.number().int().min(1).max(10).optional(),
      assessmentType: z.nativeEnum(AssessmentType).optional(),
      assessmentDate: z.coerce.date().optional(),
      notes: z.string().optional(),
      predictedRisk: z.number().int().min(0).max(100).optional(),
      modelVersion: z.string().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided'
    })
});

export const deleteHealthRecordSchema = recordIdParamSchema;

export type ListHealthRecordsQuery = z.infer<
  typeof listHealthRecordsSchema
>['query'];
export type CreateHealthRecordInput = z.infer<
  typeof createHealthRecordSchema
>['body'];
export type UpdateHealthRecordInput = z.infer<
  typeof updateHealthRecordSchema
>['body'];

