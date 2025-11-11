import { Router } from 'express';
import multer from 'multer';

import {
  deleteDatasetHandler,
  getDatasetHandler,
  getDatasetPreviewHandler,
  getDatasetStatisticsHandler,
  listDatasetsHandler,
  uploadDatasetHandler
} from './datasets.controller';
import {
  deleteDatasetSchema,
  getDatasetPreviewSchema,
  getDatasetStatisticsSchema,
  getDatasetSchema,
  listDatasetsSchema,
  uploadDatasetSchema
} from './datasets.schema';
import { authenticate, requireRole, validateRequest } from '../../middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);
router.use(requireRole(['admin', 'data_scientist']));

router.get('/', validateRequest(listDatasetsSchema), listDatasetsHandler);
router.get('/:id', validateRequest(getDatasetSchema), getDatasetHandler);
router.post(
  '/upload',
  upload.single('file'),
  validateRequest(uploadDatasetSchema),
  uploadDatasetHandler
);
router.get('/:id/preview', validateRequest(getDatasetPreviewSchema), getDatasetPreviewHandler);
router.get('/:id/statistics', validateRequest(getDatasetStatisticsSchema), getDatasetStatisticsHandler);
router.delete('/:id', validateRequest(deleteDatasetSchema), deleteDatasetHandler);

export default router;

