import { apiClient } from "../lib/api";

export interface MLPreset {
  name: string;
  // Add other fields as we discover them
}

export interface MLConfig {
  features: string[];
  test_size: number;
  n_estimators: number;
  max_depth: number | null;
  class_weight: string;
}

export interface MLPredictionInput {
  id: number;
  [key: string]: any; // Dynamic features
}

export const mlService = {
  // Presets
  async listPresets(): Promise<MLPreset[]> {
    return apiClient.get('/api/ml/presets');
  },

  async createPreset(formData: FormData): Promise<any> {
    // formData should contain: file, preset_name, config
    return apiClient.post('/api/ml/presets', formData);
  },

  async deletePreset(presetName: string): Promise<void> {
    return apiClient.delete(`/api/ml/presets/${presetName}`);
  },

  async updateConfig(presetName: string, config: MLConfig): Promise<any> {
    return apiClient.put(`/api/ml/presets/${presetName}`, config);
  },

  async getConfig(presetName: string): Promise<MLConfig> {
    return apiClient.get(`/api/ml/presets/${presetName}/config`);
  },

  // Training & State
  async retrain(presetName: string): Promise<any> {
    return apiClient.post(`/api/ml/presets/${presetName}/retrain`);
  },

  async getState(presetName: string): Promise<any> {
    return apiClient.get(`/api/ml/presets/${presetName}/state`);
  },

  // Analysis & Performance
  async getPerformance(presetName: string): Promise<any> {
    return apiClient.get(`/api/ml/presets/${presetName}/performance`);
  },

  async getAnalysis(presetName: string): Promise<any> {
    return apiClient.get(`/api/ml/presets/${presetName}/analysis`);
  },

  async getPlots(presetName: string): Promise<any> {
    return apiClient.get(`/api/ml/presets/${presetName}/plots`);
  },

  // Prediction
  async predict(presetName: string, input: MLPredictionInput): Promise<any> {
    return apiClient.post(`/api/ml/presets/${presetName}/predict`, input);
  }
};
