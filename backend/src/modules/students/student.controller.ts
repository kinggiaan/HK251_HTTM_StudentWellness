import type { Request, Response } from 'express';

import type {
  CreateStudentInput,
  ListStudentsQuery,
  UpdateStudentInput
} from './student.schema';
import {
  createStudent,
  deleteStudent,
  getStudentById,
  listStudents,
  updateStudent,
  importStudentsFromCsv
} from './student.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';
import type { ImportStudentsQuery } from './student.schema';

export const importStudentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: ImportStudentsQuery };
  const file = (req as any).file as Express.Multer.File | undefined;

  if (!file || !file.buffer) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No file uploaded. Please attach a CSV file with field name "file".'
    });
  }

  const result = await importStudentsFromCsv(file.buffer, query, buildContext(req));
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listStudentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: ListStudentsQuery };
  const result = await listStudents(query, buildContext(req));

  res.json({
    success: true,
    data: {
      data: result.students,
      pagination: result.pagination
    }
  });
});

export const getStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  const student = await getStudentById(req.params.id, buildContext(req));

  res.json({
    success: true,
    data: student
  });
});

export const createStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: CreateStudentInput };
  const student = await createStudent(body, buildContext(req));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: student
  });
});

export const updateStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: UpdateStudentInput };
  const student = await updateStudent(req.params.id, body, buildContext(req));

  res.json({
    success: true,
    data: student
  });
});

export const deleteStudentHandler = asyncHandler(async (req: Request, res: Response) => {
  await deleteStudent(req.params.id, buildContext(req));

  res.status(HTTP_STATUS.NO_CONTENT).end();
});

