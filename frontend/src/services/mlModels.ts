import { apiClient } from "../lib/api";

export type ModelStatus = 'training' | 'trained' | 'deployed' | 'archived';

export interface MLModel {
  id: string;
  modelName: string;
  modelType: 'classification' | 'regression' | 'clustering';
  version: string;
  algorithm: string;
  hyperparameters?: Record<string, any>;
  features?: string[];
  targetVariable?: string;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  trainingDatasetId?: string;
  trainingSamples?: number;
  testingSamples?: number;
  status: ModelStatus;
  isActive: boolean;
  trainedAt?: string;
  deployedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListModelsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'accuracy' | 'version';
  order?: 'asc' | 'desc';
}

export async function listModels(params: ListModelsParams = {}): Promise<{ items: MLModel[]; total: number; page: number; limit: number; }> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  const res = await apiClient.get(`/ml/models?${query.toString()}`);
  // Normalize shape: backend may return { data, pagination } or already { items, total, ... }
  if (Array.isArray(res?.data) && res?.pagination) {
    return {
      items: res.data as MLModel[],
      total: Number(res.pagination.total ?? (res.data as MLModel[]).length),
      page: Number(res.pagination.page ?? params.page ?? 1),
      limit: Number(res.pagination.limit ?? params.limit ?? 20),
    };
  }
  if (Array.isArray(res?.items)) {
    return {
      items: res.items as MLModel[],
      total: Number(res.total ?? (res.items as MLModel[]).length),
      page: Number(res.page ?? params.page ?? 1),
      limit: Number(res.limit ?? params.limit ?? 20),
    };
  }
  // Fallback
  const arr = Array.isArray(res) ? res : [];
  return { items: arr as MLModel[], total: arr.length, page: Number(params.page ?? 1), limit: Number(params.limit ?? 20) };
}

export async function createModel(input: Partial<MLModel> & { modelName: string; modelType: MLModel['modelType']; algorithm: string; }): Promise<MLModel> {
  return apiClient.post(`/ml/models`, input);
}

export async function updateModel(id: string, input: Partial<MLModel>): Promise<MLModel> {
  return apiClient.put(`/ml/models/${id}`, input);
}

export async function deleteModel(id: string): Promise<void> {
  await apiClient.delete(`/ml/models/${id}`);
}

export async function trainModel(id: string, params: { datasetId: string; trainTestSplit?: number; hyperparameters?: Record<string, any>; features?: string[]; targetVariable?: string; }): Promise<MLModel> {
  return apiClient.post(`/ml/models/${id}/train`, params);
}

export async function deployModel(id: string): Promise<MLModel> {
  return apiClient.post(`/ml/models/${id}/deploy`);
}


