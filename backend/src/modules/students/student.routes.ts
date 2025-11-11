import { Router } from 'express';

import {
  createStudentHandler,
  deleteStudentHandler,
  getStudentHandler,
  listStudentsHandler,
  updateStudentHandler
} from './student.controller';
import {
  createStudentSchema,
  deleteStudentSchema,
  getStudentSchema,
  listStudentsSchema,
  updateStudentSchema
} from './student.schema';
import { authenticate, validateRequest } from '../../middleware';
import multer from 'multer';
import { importStudentsHandler } from './student.controller';
import { importStudentsSchema } from './student.schema';

const router = Router();

router.use(authenticate);

router.get('/', validateRequest(listStudentsSchema), listStudentsHandler);
router.get('/:id', validateRequest(getStudentSchema), getStudentHandler);
router.post('/', validateRequest(createStudentSchema), createStudentHandler);
router.put('/:id', validateRequest(updateStudentSchema), updateStudentHandler);
router.delete('/:id', validateRequest(deleteStudentSchema), deleteStudentHandler);

// Import students via CSV
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.post('/import', upload.single('file'), validateRequest(importStudentsSchema), importStudentsHandler);

export default router;

