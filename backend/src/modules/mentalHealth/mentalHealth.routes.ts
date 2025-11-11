import { Router } from 'express';

import {
  createHealthRecordHandler,
  deleteHealthRecordHandler,
  getHealthRecordHandler,
  listHealthRecordsHandler,
  updateHealthRecordHandler
} from './mentalHealth.controller';
import {
  createHealthRecordSchema,
  deleteHealthRecordSchema,
  getHealthRecordSchema,
  listHealthRecordsSchema,
  updateHealthRecordSchema
} from './mentalHealth.schema';
import { authenticate, validateRequest } from '../../middleware';

const router = Router();

router.use(authenticate);

// List records for a student
router.get(
  '/students/:studentId/health-records',
  validateRequest(listHealthRecordsSchema),
  listHealthRecordsHandler
);

// Get single record
router.get(
  '/health-records/:id',
  validateRequest(getHealthRecordSchema),
  getHealthRecordHandler
);

// Create record for a student
router.post(
  '/students/:studentId/health-records',
  validateRequest(createHealthRecordSchema),
  createHealthRecordHandler
);

// Update record
router.put(
  '/health-records/:id',
  validateRequest(updateHealthRecordSchema),
  updateHealthRecordHandler
);

// Delete record
router.delete(
  '/health-records/:id',
  validateRequest(deleteHealthRecordSchema),
  deleteHealthRecordHandler
);

export default router;

