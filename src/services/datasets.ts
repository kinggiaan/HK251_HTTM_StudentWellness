import { apiClient } from "../lib/api";

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  format: string;
  totalSamples?: number;
  uploadedAt: string;
}

export interface ListDatasetsParams {
  page?: number;
  limit?: number;
  search?: string;
  format?: 'csv' | 'json' | 'excel';
  sortBy?: 'name' | 'uploadedAt' | 'totalSamples' | 'fileSize';
  order?: 'asc' | 'desc';
}

export async function listDatasets(params: ListDatasetsParams = {}): Promise<{ items: Dataset[]; total: number; page: number; limit: number; }> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, String(v));
  });
  const res: any = await apiClient.get(`/ml/datasets?${query.toString()}`);
  // Backend returns { success, data: Dataset[], pagination }.
  // apiClient returns data.data if exists → here it's Dataset[] (array).
  // Normalize multiple shapes to a stable { items, total, page, limit }.
  const items: Dataset[] = Array.isArray(res)
    ? res
    : (res?.items ?? res?.data ?? []);
  const total: number =
    (res?.pagination?.total as number) ??
    (Array.isArray(items) ? items.length : 0);
  const page = (res?.pagination?.page as number) ?? (params.page ?? 1);
  const limit = (res?.pagination?.limit as number) ?? (params.limit ?? 20);
  return { items, total, page, limit };
}

export async function uploadDataset(file: File, name: string, description?: string): Promise<Dataset> {
  const form = new FormData();
  form.append("file", file);
  form.append("name", name);
  if (description) form.append("description", description);
  return apiClient.post(`/ml/datasets/upload`, form);
}

export async function deleteDataset(id: string): Promise<void> {
  await apiClient.delete(`/ml/datasets/${id}`);
}


