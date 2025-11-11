import { Router } from 'express';

import {
  createSessionHandler,
  deleteSessionHandler,
  getSessionHandler,
  listSessionsHandler,
  updateSessionHandler
} from './sessions.controller';
import {
  createSessionSchema,
  deleteSessionSchema,
  getSessionSchema,
  listSessionsSchema,
  updateSessionSchema
} from './sessions.schema';
import { authenticate, validateRequest } from '../../middleware';

const router = Router();

router.use(authenticate);

router.get('/', validateRequest(listSessionsSchema), listSessionsHandler);
router.get('/:id', validateRequest(getSessionSchema), getSessionHandler);
router.post('/', validateRequest(createSessionSchema), createSessionHandler);
router.put('/:id', validateRequest(updateSessionSchema), updateSessionHandler);
router.delete('/:id', validateRequest(deleteSessionSchema), deleteSessionHandler);

export default router;

