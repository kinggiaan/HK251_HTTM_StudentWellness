import type { Request, Response } from 'express';

import type {
  CreateHealthRecordInput,
  ListHealthRecordsQuery,
  UpdateHealthRecordInput
} from './mentalHealth.schema';
import {
  createHealthRecord,
  deleteHealthRecord,
  getHealthRecordById,
  listHealthRecords,
  updateHealthRecord
} from './mentalHealth.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listHealthRecordsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { query } = req as Request & { query: ListHealthRecordsQuery };
    const records = await listHealthRecords(studentId, query, buildContext(req));

    res.json({
      success: true,
      data: records
    });
  }
);

export const getHealthRecordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const record = await getHealthRecordById(req.params.id, buildContext(req));

    res.json({
      success: true,
      data: record
    });
  }
);

export const createHealthRecordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { body } = req as Request & { body: CreateHealthRecordInput };
    const record = await createHealthRecord(studentId, body, buildContext(req));

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: record
    });
  }
);

export const updateHealthRecordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { body } = req as Request & { body: UpdateHealthRecordInput };
    const record = await updateHealthRecord(req.params.id, body, buildContext(req));

    res.json({
      success: true,
      data: record
    });
  }
);

export const deleteHealthRecordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteHealthRecord(req.params.id, buildContext(req));

    res.status(HTTP_STATUS.NO_CONTENT).end();
  }
);

