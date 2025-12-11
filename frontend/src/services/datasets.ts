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
  try {
    // Note: Backend doesn't have /ml/datasets endpoint yet
    // Return empty array or fetch from uploaded files folder
    // For now, return mock empty response to prevent 404 errors
    console.warn("Dataset endpoint not implemented. Returning empty dataset list.");
    return { items: [], total: 0, page: 1, limit: 20 };
    
    // TODO: Implement proper dataset listing when backend is ready
    // const query = new URLSearchParams();
    // Object.entries(params).forEach(([k, v]) => {
    //   if (v !== undefined && v !== null) query.set(k, String(v));
    // });
    // const res: any = await apiClient.get(`/ml/datasets?${query.toString()}`);
    // const items: Dataset[] = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
    // const total: number = (res?.pagination?.total as number) ?? (Array.isArray(items) ? items.length : 0);
    // const page = (res?.pagination?.page as number) ?? (params.page ?? 1);
    // const limit = (res?.pagination?.limit as number) ?? (params.limit ?? 20);
    // return { items, total, page, limit };
  } catch (error) {
    console.error("Error listing datasets:", error);
    return { items: [], total: 0, page: 1, limit: 20 };
  }
}

export async function uploadDataset(file: File, name: string, description?: string): Promise<Dataset> {
  try {
    // Note: Backend doesn't have /ml/datasets/upload endpoint yet
    // Use ML preset creation endpoint instead
    console.warn("Dataset upload endpoint not implemented. Use ML Preset creation instead.");
    throw new Error("Please use ML Preset creation to upload datasets");
    
    // TODO: Implement when backend is ready
    // const form = new FormData();
    // form.append("file", file);
    // form.append("name", name);
    // if (description) form.append("description", description);
    // return apiClient.post(`/ml/datasets/upload`, form);
  } catch (error) {
    throw error;
  }
}

export async function deleteDataset(id: string): Promise<void> {
  try {
    // Note: Backend doesn't have /ml/datasets endpoint yet
    console.warn("Dataset delete endpoint not implemented.");
    throw new Error("Dataset deletion not available yet");
    
    // TODO: Implement when backend is ready
    // await apiClient.delete(`/ml/datasets/${id}`);
  } catch (error) {
    throw error;
  }
}


