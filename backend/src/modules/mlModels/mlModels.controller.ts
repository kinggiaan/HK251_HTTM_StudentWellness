import type { Request, Response } from 'express';

import type { CreateModelInput, ListModelsQuery, TrainModelInput, UpdateModelInput } from './mlModels.schema';
import {
  createModel,
  deleteModel,
  deployModel,
  getModelById,
  listModels,
  trainModel,
  updateModel
} from './mlModels.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listModelsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: ListModelsQuery };
  const result = await listModels(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

export const getModelHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const model = await getModelById(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: model
  });
});

export const createModelHandler = asyncHandler(async (req: Request, res: Response) => {
  const { body } = req as Request & { body: CreateModelInput };
  const model = await createModel(body, buildContext(req));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: model
  });
});

export const updateModelHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req as Request & { body: UpdateModelInput };
  const model = await updateModel(id, body, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: model
  });
});

export const trainModelHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req as Request & { body: TrainModelInput };
  const result = await trainModel(id, body, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

export const deployModelHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deployModel(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
});

export const deleteModelHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteModel(id, buildContext(req));

  res.status(HTTP_STATUS.NO_CONTENT).end();
});

