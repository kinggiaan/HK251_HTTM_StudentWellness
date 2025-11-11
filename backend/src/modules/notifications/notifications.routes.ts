import { Router } from 'express';

import {
  createNotificationHandler,
  dismissNotificationHandler,
  getNotificationHandler,
  getUnreadCountHandler,
  listNotificationsHandler,
  markAllAsReadHandler,
  markAsReadHandler
} from './notifications.controller';
import {
  createNotificationSchema,
  dismissNotificationSchema,
  getNotificationSchema,
  listNotificationsSchema,
  markAllAsReadSchema,
  markAsReadSchema
} from './notifications.schema';
import { authenticate, validateRequest } from '../../middleware';

const router = Router();

router.use(authenticate);

router.get('/', validateRequest(listNotificationsSchema), listNotificationsHandler);
router.get('/unread-count', getUnreadCountHandler);
router.get('/:id', validateRequest(getNotificationSchema), getNotificationHandler);
router.post('/', validateRequest(createNotificationSchema), createNotificationHandler);
router.patch('/:id/read', validateRequest(markAsReadSchema), markAsReadHandler);
router.patch('/:id/dismiss', validateRequest(dismissNotificationSchema), dismissNotificationHandler);
router.post('/mark-all-read', validateRequest(markAllAsReadSchema), markAllAsReadHandler);

export default router;

