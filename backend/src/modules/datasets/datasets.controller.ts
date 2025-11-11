import type { Request, Response } from 'express';

import type { ListDatasetsQuery, UploadDatasetInput } from './datasets.schema';
import {
  deleteDataset,
  getDatasetById,
  getDatasetPreview,
  getDatasetStatistics,
  listDatasets,
  uploadDataset
} from './datasets.service';
import { asyncHandler } from '../../middleware';
import { HTTP_STATUS } from '../../utils/httpStatus';

const buildContext = (req: Request) => ({
  userId: req.user!.id,
  role: req.user!.role,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});

export const listDatasetsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req as Request & { query: ListDatasetsQuery };
  const result = await listDatasets(query, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

export const getDatasetHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dataset = await getDatasetById(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: dataset
  });
});

export const uploadDatasetHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'File is required'
    });
  }

  const { body } = req as Request & { body: UploadDatasetInput };
  const dataset = await uploadDataset(req.file, body, buildContext(req));

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: dataset
  });
});

export const getDatasetPreviewHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const maxRows = req.query.rows ? Number(req.query.rows) : 10;
  const preview = await getDatasetPreview(id, maxRows, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: preview
  });
});

export const getDatasetStatisticsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const statistics = await getDatasetStatistics(id, buildContext(req));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: statistics
  });
});

export const deleteDatasetHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteDataset(id, buildContext(req));

  res.status(HTTP_STATUS.NO_CONTENT).end();
});

