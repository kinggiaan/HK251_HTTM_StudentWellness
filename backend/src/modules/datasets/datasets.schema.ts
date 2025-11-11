import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listDatasetsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional()
  })
});

export const getDatasetSchema = idParamSchema;

export const uploadDatasetSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional()
  })
});

export const getDatasetPreviewSchema = idParamSchema.extend({
  query: z.object({
    rows: z.coerce.number().int().positive().max(100).optional()
  })
});

export const getDatasetStatisticsSchema = idParamSchema;

export const deleteDatasetSchema = idParamSchema;

export type ListDatasetsQuery = z.infer<typeof listDatasetsSchema>['query'];
export type UploadDatasetInput = z.infer<typeof uploadDatasetSchema>['body'];

