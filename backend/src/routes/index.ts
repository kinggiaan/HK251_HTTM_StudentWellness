import { Router } from 'express';

import { analyticsRouter } from '../modules/analytics';
import { authRouter } from '../modules/auth';
import { datasetsRouter } from '../modules/datasets';
import { mlModelsRouter } from '../modules/mlModels';
import mentalHealthRouter from '../modules/mentalHealth/mentalHealth.routes';
import { notificationsRouter } from '../modules/notifications';
import { sessionsRouter } from '../modules/sessions';
import { studentsRouter } from '../modules/students';
import { usersRouter } from '../modules/users';
import { adminRouter } from '../modules/admin/permissions.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/admin', adminRouter);
router.use('/students', studentsRouter);
router.use('/sessions', sessionsRouter);
router.use('/notifications', notificationsRouter);
router.use('/analytics', analyticsRouter);
router.use('/ml/models', mlModelsRouter);
router.use('/ml/datasets', datasetsRouter);
router.use('/', mentalHealthRouter);

export default router;

