import { Router } from 'express';

import {
  createUserHandler,
  deleteUserHandler,
  getMeHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler
} from './user.controller';
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  listUsersSchema,
  updateUserSchema
} from './user.schema';
import { authenticate, validateRequest } from '../../middleware';

const router = Router();

router.use(authenticate);

router.get('/me', getMeHandler);
router.get('/', validateRequest(listUsersSchema), listUsersHandler);
router.post('/', validateRequest(createUserSchema), createUserHandler);
router.get('/:id', validateRequest(getUserSchema), getUserHandler);
router.put('/:id', validateRequest(updateUserSchema), updateUserHandler);
router.delete('/:id', validateRequest(deleteUserSchema), deleteUserHandler);

export default router;

