import { UserRole } from '@prisma/client';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { createAuditLog } from '../common';
import type { ListDatasetsQuery, UploadDatasetInput } from './datasets.schema';

interface RequestContext {
  userId: string;
  role: UserRole;
  ip?: string;
  userAgent?: string;
}

function canManageDatasets(role: UserRole): boolean {
  return role === 'admin' || role === 'data_scientist';
}

// Simple CSV parser (in production, use a proper CSV library)
function parseCSV(content: string): { headers: string[]; rows: any[][] } {
  const lines = content.trim().split('\n');
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split(',').map((cell) => cell.trim()));

  return { headers, rows };
}

// Calculate basic statistics for a dataset
function calculateStatistics(rows: any[][], headers: string[]) {
  const stats: Record<string, any> = {};

  headers.forEach((header, colIndex) => {
    const values = rows
      .map((row) => {
        const val = row[colIndex];
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
      })
      .filter((v) => v !== null) as number[];

    if (values.length > 0) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

      // Simple std deviation
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);

      stats[header] = {
        mean: Math.round(mean * 100) / 100,
        std: Math.round(std * 100) / 100,
        min,
        max,
        median: Math.round(median * 100) / 100,
        missing: rows.length - values.length
      };
    } else {
      stats[header] = {
        mean: 0,
        std: 0,
        min: 0,
        max: 0,
        median: 0,
        missing: rows.length
      };
    }
  });

  return stats;
}

export async function listDatasets(query: ListDatasetsQuery, context: RequestContext) {
  if (!canManageDatasets(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const [datasets, total] = await Promise.all([
    prisma.dataset.findMany({
      include: {
        uploadedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.dataset.count()
  ]);

  return {
    data: datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      fileName: dataset.fileName,
      fileSize: dataset.fileSize ? Number(dataset.fileSize) : null,
      format: dataset.format,
      totalSamples: dataset.totalSamples,
      features: dataset.features,
      targetVariable: dataset.targetVariable,
      completeness: dataset.completeness ? Number(dataset.completeness) : null,
      missingValues: dataset.missingValues ? Number(dataset.missingValues) : null,
      dataBalance: dataset.dataBalance ? Number(dataset.dataBalance) : null,
      uploadedBy: dataset.uploadedBy,
      uploadedAt: dataset.uploadedAt,
      lastUsedAt: dataset.lastUsedAt,
      createdAt: dataset.createdAt
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getDatasetById(id: string, context: RequestContext) {
  if (!canManageDatasets(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });

  if (!dataset) {
    throw new AppError('Dataset not found', HTTP_STATUS.NOT_FOUND);
  }

  return {
    id: dataset.id,
    name: dataset.name,
    description: dataset.description,
    fileName: dataset.fileName,
    fileSize: dataset.fileSize ? Number(dataset.fileSize) : null,
    format: dataset.format,
    totalSamples: dataset.totalSamples,
    features: dataset.features,
    targetVariable: dataset.targetVariable,
    completeness: dataset.completeness ? Number(dataset.completeness) : null,
    missingValues: dataset.missingValues ? Number(dataset.missingValues) : null,
    dataBalance: dataset.dataBalance ? Number(dataset.dataBalance) : null,
    uploadedBy: dataset.uploadedBy,
    uploadedAt: dataset.uploadedAt,
    lastUsedAt: dataset.lastUsedAt,
    createdAt: dataset.createdAt
  };
}

export async function uploadDataset(
  file: Express.Multer.File,
  input: UploadDatasetInput,
  context: RequestContext
) {
  if (!canManageDatasets(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  // In production, upload to S3
  // For now, save to local storage
  const uploadsDir = join(process.cwd(), 'uploads', 'datasets');
  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = join(uploadsDir, fileName);

  // Save file (in production, use S3)
  await writeFile(filePath, file.buffer);

  // Parse CSV to get basic info
  const content = file.buffer.toString('utf-8');
  const { headers, rows } = parseCSV(content);

  // Calculate basic statistics
  const totalSamples = rows.length;
  const stats = calculateStatistics(rows, headers);
  const completeness = totalSamples > 0 ? ((totalSamples - (stats[headers[0]]?.missing || 0)) / totalSamples) * 100 : 0;

  const dataset = await prisma.dataset.create({
    data: {
      name: input.name,
      description: input.description,
      fileUrl: filePath, // In production, use S3 URL
      fileName: file.originalname,
      fileSize: BigInt(file.size),
      format: 'csv',
      totalSamples,
      features: headers,
      completeness: completeness,
      missingValues: 100 - completeness,
      uploadedById: context.userId
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'dataset.upload',
    resource: dataset.id,
    metadata: { fileName: file.originalname, totalSamples },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    id: dataset.id,
    name: dataset.name,
    fileName: dataset.fileName,
    totalSamples,
    features: headers,
    uploadedAt: dataset.uploadedAt
  };
}

export async function getDatasetPreview(id: string, maxRows: number, context: RequestContext) {
  if (!canManageDatasets(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id }
  });

  if (!dataset) {
    throw new AppError('Dataset not found', HTTP_STATUS.NOT_FOUND);
  }

  // Read file (in production, read from S3)
  const content = await readFile(dataset.fileUrl, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const previewRows = rows.slice(0, maxRows || 10);

  return {
    headers,
    rows: previewRows,
    totalRows: rows.length
  };
}

export async function getDatasetStatistics(id: string, context: RequestContext) {
  if (!canManageDatasets(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id }
  });

  if (!dataset) {
    throw new AppError('Dataset not found', HTTP_STATUS.NOT_FOUND);
  }

  // Read file (in production, read from S3)
  const content = await readFile(dataset.fileUrl, 'utf-8');
  const { headers, rows } = parseCSV(content);

  const featureStats = calculateStatistics(rows, headers);

  return {
    summary: {
      totalSamples: rows.length,
      features: headers.length,
      completeness: dataset.completeness ? Number(dataset.completeness) : 0
    },
    featureStats
  };
}

export async function deleteDataset(id: string, context: RequestContext) {
  if (!canManageDatasets(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id }
  });

  if (!dataset) {
    throw new AppError('Dataset not found', HTTP_STATUS.NOT_FOUND);
  }

  await prisma.dataset.delete({
    where: { id }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'dataset.delete',
    resource: id,
    metadata: { fileName: dataset.fileName },
    ip: context.ip,
    userAgent: context.userAgent
  });
}

