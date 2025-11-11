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
  return apiClient.get(`/ml/models?${query.toString()}`);
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


