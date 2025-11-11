import { Router } from 'express';

import {
  changePasswordHandler,
  loginHandler,
  logoutHandler,
  refreshHandler
} from './auth.controller';
import {
  changePasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema
} from './auth.schema';
import { authenticate, validateRequest } from '../../middleware';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/refresh', validateRequest(refreshSchema), refreshHandler);
router.post('/logout', validateRequest(logoutSchema), logoutHandler);
router.post(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  changePasswordHandler
);

export default router;

