import { RiskLevel } from '@prisma/client';
import { z } from 'zod';

export const getOverviewSchema = z.object({
  query: z.object({
    consultantId: z.string().uuid().optional()
  })
});

export const getDistributionSchema = z.object({
  query: z.object({
    consultantId: z.string().uuid().optional()
  })
});

export const getTrendsSchema = z.object({
  query: z.object({
    metric: z.enum(['stress', 'anxiety', 'depression', 'sleep']).optional(),
    period: z.enum(['7d', '30d', '90d', '1y']).optional(),
    groupBy: z.enum(['day', 'week', 'month']).optional(),
    consultantId: z.string().uuid().optional()
  })
});

export const getStudentStatsSchema = z.object({
  query: z.object({
    studentId: z.string().uuid(),
    period: z.enum(['7d', '30d', '90d', '1y']).optional()
  })
});

export type GetOverviewQuery = z.infer<typeof getOverviewSchema>['query'];
export type GetTrendsQuery = z.infer<typeof getTrendsSchema>['query'];
export type GetStudentStatsQuery = z.infer<typeof getStudentStatsSchema>['query'];

