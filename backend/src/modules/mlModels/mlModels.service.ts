import { ModelStatus, UserRole } from '@prisma/client';

import { prisma } from '../../config';
import env from '../../config/env';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { createAuditLog } from '../common';
import type { CreateModelInput, ListModelsQuery, TrainModelInput, UpdateModelInput } from './mlModels.schema';

interface RequestContext {
  userId: string;
  role: UserRole;
  ip?: string;
  userAgent?: string;
}

function canManageModels(role: UserRole): boolean {
  return role === 'admin' || role === 'data_scientist';
}

function generateVersion(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `v1.0.${timestamp}-${random}`;
}

async function callMLService(endpoint: string, data: any): Promise<any> {
  const mlServiceUrl = env.ML_SERVICE_URL;
  if (!mlServiceUrl) {
    throw new AppError('ML Service not configured', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  try {
    const response = await fetch(`${mlServiceUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`ML Service error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    // In development, return mock response if ML service is not available
    if (env.NODE_ENV === 'development') {
      console.warn('ML Service not available, returning mock response');
      return {
        success: true,
        modelId: data.modelId,
        status: 'trained',
        accuracy: 0.85,
        precision: 0.83,
        recall: 0.87,
        f1Score: 0.85
      };
    }
    throw error;
  }
}

export async function listModels(query: ListModelsQuery, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const where: {
    status?: ModelStatus;
    isActive?: boolean;
  } = {};

  if (query.status) {
    where.status = query.status;
  }
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  const skip = (page - 1) * limit;

  const [models, total] = await Promise.all([
    prisma.mLModel.findMany({
      where,
      include: {
        trainingDataset: {
          select: {
            id: true,
            name: true
          }
        },
        trainedBy: {
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
    prisma.mLModel.count({ where })
  ]);

  return {
    data: models.map((model) => ({
      id: model.id,
      modelName: model.modelName,
      modelType: model.modelType,
      version: model.version,
      algorithm: model.algorithm,
      hyperparameters: model.hyperparameters,
      features: model.features,
      targetVariable: model.targetVariable,
      accuracy: model.accuracy ? Number(model.accuracy) : null,
      precision: model.precision ? Number(model.precision) : null,
      recall: model.recall ? Number(model.recall) : null,
      f1Score: model.f1Score ? Number(model.f1Score) : null,
      trainingDataset: model.trainingDataset,
      trainingSamples: model.trainingSamples,
      testingSamples: model.testingSamples,
      status: model.status,
      isActive: model.isActive,
      trainedBy: model.trainedBy,
      trainedAt: model.trainedAt,
      deployedAt: model.deployedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getModelById(id: string, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const model = await prisma.mLModel.findUnique({
    where: { id },
    include: {
      trainingDataset: true,
      trainedBy: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });

  if (!model) {
    throw new AppError('Model not found', HTTP_STATUS.NOT_FOUND);
  }

  return {
    id: model.id,
    modelName: model.modelName,
    modelType: model.modelType,
    version: model.version,
    algorithm: model.algorithm,
    hyperparameters: model.hyperparameters,
    features: model.features,
    targetVariable: model.targetVariable,
    accuracy: model.accuracy ? Number(model.accuracy) : null,
    precision: model.precision ? Number(model.precision) : null,
    recall: model.recall ? Number(model.recall) : null,
    f1Score: model.f1Score ? Number(model.f1Score) : null,
    trainingDataset: model.trainingDataset,
    trainingSamples: model.trainingSamples,
    testingSamples: model.testingSamples,
    status: model.status,
    isActive: model.isActive,
    trainedBy: model.trainedBy,
    trainedAt: model.trainedAt,
    deployedAt: model.deployedAt,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt
  };
}

export async function createModel(input: CreateModelInput, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const model = await prisma.mLModel.create({
    data: {
      modelName: input.modelName,
      modelType: input.modelType,
      version: input.version ?? generateVersion(),
      algorithm: input.algorithm,
      hyperparameters: input.hyperparameters ?? {},
      features: input.features ?? [],
      targetVariable: input.targetVariable,
      status: 'training',
      isActive: false
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'ml_model.create',
    resource: model.id,
    metadata: { modelName: input.modelName, algorithm: input.algorithm },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    id: model.id,
    modelName: model.modelName,
    modelType: model.modelType,
    version: model.version,
    algorithm: model.algorithm,
    hyperparameters: model.hyperparameters,
    features: model.features,
    targetVariable: model.targetVariable,
    status: model.status,
    isActive: model.isActive,
    createdAt: model.createdAt
  };
}

export async function updateModel(id: string, input: UpdateModelInput, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const model = await prisma.mLModel.findUnique({
    where: { id }
  });

  if (!model) {
    throw new AppError('Model not found', HTTP_STATUS.NOT_FOUND);
  }

  const updated = await prisma.mLModel.update({
    where: { id },
    data: {
      modelName: input.modelName,
      algorithm: input.algorithm,
      hyperparameters: input.hyperparameters as any,
      features: input.features,
      targetVariable: input.targetVariable,
      status: input.status,
      isActive: input.isActive
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'ml_model.update',
    resource: id,
    metadata: input,
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    id: updated.id,
    modelName: updated.modelName,
    modelType: updated.modelType,
    version: updated.version,
    algorithm: updated.algorithm,
    hyperparameters: updated.hyperparameters,
    features: updated.features,
    targetVariable: updated.targetVariable,
    status: updated.status,
    isActive: updated.isActive,
    updatedAt: updated.updatedAt
  };
}

export async function trainModel(id: string, input: TrainModelInput, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const model = await prisma.mLModel.findUnique({
    where: { id }
  });

  if (!model) {
    throw new AppError('Model not found', HTTP_STATUS.NOT_FOUND);
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id: input.datasetId }
  });

  if (!dataset) {
    throw new AppError('Dataset not found', HTTP_STATUS.NOT_FOUND);
  }

  // Update model status to training
  await prisma.mLModel.update({
    where: { id },
    data: {
      status: 'training',
      trainingDatasetId: input.datasetId
    }
  });

  // Call ML service to train model
  const trainTestSplit = input.trainTestSplit ?? 0.8;
  const result = await callMLService('/train', {
    modelId: id,
    datasetId: input.datasetId,
    algorithm: model.algorithm,
    hyperparameters: model.hyperparameters,
    features: model.features,
    targetVariable: model.targetVariable,
    trainTestSplit
  });

  // Update model with training results
  const updated = await prisma.mLModel.update({
    where: { id },
    data: {
      status: result.status === 'trained' ? 'trained' : 'training',
      accuracy: result.accuracy,
      precision: result.precision,
      recall: result.recall,
      f1Score: result.f1Score,
      trainingSamples: result.trainingSamples,
      testingSamples: result.testingSamples,
      trainedById: context.userId,
      trainedAt: new Date()
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'ml_model.train',
    resource: id,
    metadata: { datasetId: input.datasetId, accuracy: result.accuracy },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    id: updated.id,
    status: updated.status,
    accuracy: updated.accuracy ? Number(updated.accuracy) : null,
    precision: updated.precision ? Number(updated.precision) : null,
    recall: updated.recall ? Number(updated.recall) : null,
    f1Score: updated.f1Score ? Number(updated.f1Score) : null,
    trainedAt: updated.trainedAt
  };
}

export async function deployModel(id: string, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const model = await prisma.mLModel.findUnique({
    where: { id }
  });

  if (!model) {
    throw new AppError('Model not found', HTTP_STATUS.NOT_FOUND);
  }

  if (model.status !== 'trained') {
    throw new AppError('Model must be trained before deployment', HTTP_STATUS.BAD_REQUEST);
  }

  // Deactivate all other active models of the same type
  await prisma.mLModel.updateMany({
    where: {
      modelType: model.modelType,
      isActive: true,
      id: {
        not: id
      }
    },
    data: {
      isActive: false
    }
  });

  // Activate this model
  const updated = await prisma.mLModel.update({
    where: { id },
    data: {
      isActive: true,
      status: 'deployed',
      deployedAt: new Date()
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'ml_model.deploy',
    resource: id,
    metadata: { modelName: model.modelName },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return {
    id: updated.id,
    isActive: updated.isActive,
    status: updated.status,
    deployedAt: updated.deployedAt
  };
}

export async function deleteModel(id: string, context: RequestContext) {
  if (!canManageModels(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const model = await prisma.mLModel.findUnique({
    where: { id }
  });

  if (!model) {
    throw new AppError('Model not found', HTTP_STATUS.NOT_FOUND);
  }

  if (model.isActive) {
    throw new AppError('Cannot delete active model. Deactivate it first.', HTTP_STATUS.BAD_REQUEST);
  }

  await prisma.mLModel.delete({
    where: { id }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'ml_model.delete',
    resource: id,
    metadata: { modelName: model.modelName },
    ip: context.ip,
    userAgent: context.userAgent
  });
}

