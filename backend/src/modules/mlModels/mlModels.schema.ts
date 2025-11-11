import { ModelStatus, ModelType } from '@prisma/client';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listModelsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(ModelStatus).optional(),
    isActive: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  })
});

export const getModelSchema = idParamSchema;

export const createModelSchema = z.object({
  body: z.object({
    modelName: z.string().min(1),
    modelType: z.nativeEnum(ModelType),
    algorithm: z.string().min(1),
    hyperparameters: z.record(z.string(), z.any()).optional(),
    features: z.array(z.string()).optional(),
    targetVariable: z.string().optional(),
    version: z.string().optional()
  })
});

export const updateModelSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z
    .object({
      modelName: z.string().min(1).optional(),
      algorithm: z.string().min(1).optional(),
      hyperparameters: z.record(z.string(), z.any()).optional(),
      features: z.array(z.string()).optional(),
      targetVariable: z.string().optional(),
      status: z.nativeEnum(ModelStatus).optional(),
      isActive: z.boolean().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided'
    })
});

export const trainModelSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    datasetId: z.string().uuid(),
    trainTestSplit: z.number().min(0.1).max(0.9).optional()
  })
});

export const deployModelSchema = idParamSchema;

export const deleteModelSchema = idParamSchema;

export type ListModelsQuery = z.infer<typeof listModelsSchema>['query'];
export type CreateModelInput = z.infer<typeof createModelSchema>['body'];
export type UpdateModelInput = z.infer<typeof updateModelSchema>['body'];
export type TrainModelInput = z.infer<typeof trainModelSchema>['body'];

