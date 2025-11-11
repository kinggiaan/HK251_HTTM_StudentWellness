import type { Request, Response } from 'express';

import type { GetOverviewQuery, GetStudentStatsQuery, GetTrendsQuery } from './analytics.schema';
import { getDistribution, getOverview, getStudentStats, getTrends } from './analytics.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role
});

export const getOverviewHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: GetOverviewQuery };
  const data = await getOverview(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data
  });
});

export const getDistributionHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: GetOverviewQuery };
  const data = await getDistribution(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data
  });
});

export const getTrendsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: GetTrendsQuery };
  const data = await getTrends(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data
  });
});

export const getStudentStatsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: GetStudentStatsQuery };
  const data = await getStudentStats(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data
  });
});

