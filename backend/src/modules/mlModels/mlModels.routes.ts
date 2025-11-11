import { Router } from 'express';

import {
  createModelHandler,
  deleteModelHandler,
  deployModelHandler,
  getModelHandler,
  listModelsHandler,
  trainModelHandler,
  updateModelHandler
} from './mlModels.controller';
import {
  createModelSchema,
  deleteModelSchema,
  deployModelSchema,
  getModelSchema,
  listModelsSchema,
  trainModelSchema,
  updateModelSchema
} from './mlModels.schema';
import { authenticate, requireRole, validateRequest } from '../../middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['admin', 'data_scientist']));

router.get('/', validateRequest(listModelsSchema), listModelsHandler);
router.get('/:id', validateRequest(getModelSchema), getModelHandler);
router.post('/', validateRequest(createModelSchema), createModelHandler);
router.put('/:id', validateRequest(updateModelSchema), updateModelHandler);
router.post('/:id/train', validateRequest(trainModelSchema), trainModelHandler);
router.post('/:id/deploy', validateRequest(deployModelSchema), deployModelHandler);
router.delete('/:id', validateRequest(deleteModelSchema), deleteModelHandler);

export default router;

