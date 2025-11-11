import { Router } from 'express';

import {
  getDistributionHandler,
  getOverviewHandler,
  getStudentStatsHandler,
  getTrendsHandler
} from './analytics.controller';
import {
  getDistributionSchema,
  getOverviewSchema,
  getStudentStatsSchema,
  getTrendsSchema
} from './analytics.schema';
import { authenticate, validateRequest } from '../../middleware';

const router = Router();

router.use(authenticate);

router.get('/overview', validateRequest(getOverviewSchema), getOverviewHandler);
router.get('/students/distribution', validateRequest(getDistributionSchema), getDistributionHandler);
router.get('/trends', validateRequest(getTrendsSchema), getTrendsHandler);
router.get('/students/stats', validateRequest(getStudentStatsSchema), getStudentStatsHandler);

export default router;

