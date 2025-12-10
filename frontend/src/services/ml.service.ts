import { apiClient } from "../lib/api";

// ============================================================================
// PHASE 1: Enhanced TypeScript Interfaces for ML Service
// ============================================================================
// 
// NOTE: Backend API (port 1337) acts as a PROXY for ML Service (port 8000)
// - Frontend → Backend (1337) → ML Service (8000)
// - All /api/ml/* endpoints are handled by Backend and forwarded to ML Service
// - Use apiClient (Backend) for all ML operations
//

/**
 * Represents a ML Preset (Model + Dataset combination)
 */
export interface MLPreset {
  name: string;
  created_at: string;
  status: 'idle' | 'training' | 'trained' | 'error';
  dataset_name?: string;
  last_trained?: string;
}

/**
 * Training state and progress information
 */
export interface MLPresetState {
  status: 'idle' | 'training' | 'trained' | 'error';
  progress: number; // 0.0 to 1.0
  accuracy?: number; // Only available when status = 'trained'
  error?: string | null; // Error message if status = 'error'
  started_at?: string;
  completed_at?: string | null;
}

/**
 * Model performance metrics - matches ML Service API response
 * API returns: { test_metrics: {...}, confusion_matrices: {...}, permutation_importance: [...] }
 */
export interface MLPerformance {
  accuracy: number;       // Extracted from test_metrics.depression_truth.acc
  precision: number;      // Extracted from test_metrics.depression_truth.precision
  recall: number;         // Extracted from test_metrics.depression_truth.recall
  f1_score: number;       // Extracted from test_metrics.depression_truth.f1
  confusion_matrix: number[][]; // Extracted from confusion_matrices.depression_truth
  feature_importance: Record<string, number>; // Extracted from permutation_importance[0].top_k
  class_labels: string[]; // ["Normal", "Depression"]
}

/**
 * Dataset analysis statistics - matches ML Service API response
 */
export interface MLAnalysis {
  dataset_path: string;
  config: {
    status: string;
    data: {
      features: string[];
      test_size: number;
      n_estimators: number;
      max_depth: number | null;
      class_weight: string;
    };
  };
  null_counts: Record<string, number>;
  null_percent: Record<string, number>;
  splits: {
    train: number;
    validation: number;
    test: number;
  };
  column_analysis: Array<{
    column: string;
    original_name: string;
    dtype: string;
    nulls: number;
    unique: number;
    type: 'categorical' | 'numeric';
    describe?: {
      count: number;
      mean: number;
      std: number;
      min: number;
      '25%': number;
      '50%': number;
      '75%': number;
      max: number;
    };
    top_categories?: Record<string, number>;
  }>;
  feature_boxplots: any[];
  feature_proportions: any[];
}

/**
 * Visualization plot URLs - matches ML Service API response
 * API returns { plots: { "plot_name.png": "/static/path/to/plot.png", ... } }
 */
export interface MLPlots {
  plots: Record<string, string>; // { "confusion_matrix.png": "/static/.../plot.png", ... }
}

/**
 * Model configuration
 */
export interface MLConfig {
  features: string[];
  test_size: number;
  n_estimators: number;
  max_depth: number | null;
  class_weight: string;
}

/**
 * Prediction input
 */
export interface MLPredictionInput {
  id?: number;
  [key: string]: any; // Dynamic features based on model config
}

/**
 * Prediction result
 */
export interface MLPredictionResult {
  prediction: string; // "Depression" | "Anxiety" | "Normal"
  confidence: number; // 0.0 to 1.0
  probabilities: Record<string, number>; // { "Depression": 0.85, "Anxiety": 0.10, "Normal": 0.05 }
}

// ============================================================================
// ML Service API Methods
// ============================================================================

export const mlService = {
  // ========== Preset Management ==========
  
  /**
   * Get list of all presets
   */
  async listPresets(): Promise<MLPreset[]> {
    try {
      const result = await apiClient.get('/api/ml/presets');
      console.log('[ML Service] listPresets raw result:', result);
      
      // CASE 1: Backend returns { presets: ['name1', 'name2', ...] }
      // This is the current backend format - convert string array to objects
      if (result && typeof result === 'object' && 'presets' in result) {
        const presetNames = (result as any).presets;
        if (Array.isArray(presetNames)) {
          console.log('[ML Service] Converting preset names to objects:', presetNames);
          // Convert string array to MLPreset objects with placeholder data
          return presetNames.map((name: string) => ({
            name,
            dataset_name: `${name}.csv`, // Placeholder
            created_at: new Date().toISOString(),
            status: 'idle' as const,
            // Will be populated when backend returns full objects
          }));
        }
      }
      
      // CASE 2: Direct array of objects (proper format from backend)
      if (Array.isArray(result)) {
        console.log('[ML Service] Result is array, length:', result.length);
        return result;
      }
      
      // CASE 3: Wrapped in data property
      if (result && typeof result === 'object' && 'data' in result) {
        const data = (result as any).data;
        console.log('[ML Service] Result has data property:', data);
        return Array.isArray(data) ? data : [];
      }
      
      console.warn("ML Service - listPresets returned unexpected format:", result);
      return [];
    } catch (error: any) {
      console.error("ML Service - listPresets error:", error);
      // Return empty array instead of throwing to prevent dashboard crash
      return [];
    }
  },

  /**
   * Create a new preset with dataset upload
   * @param formData - Must contain: file (CSV), preset_name (string), config (JSON string)
   */
  async createPreset(formData: FormData): Promise<{ success: boolean; preset_name: string; message: string }> {
    try {
      return apiClient.post('/api/ml/presets', formData);
    } catch (error: any) {
      console.error("ML Service - createPreset error:", error);
      throw new Error(error?.message || "Failed to create ML preset");
    }
  },

  /**
   * Delete a preset by name
   */
  async deletePreset(presetName: string): Promise<void> {
    return apiClient.delete(`/api/ml/presets/${presetName}`);
  },

  /**
   * Update preset configuration
   */
  async updateConfig(presetName: string, config: MLConfig): Promise<{ success: boolean; message: string }> {
    return apiClient.put(`/api/ml/presets/${presetName}`, config);
  },

  /**
   * Get preset configuration
   */
  async getConfig(presetName: string): Promise<MLConfig> {
    return apiClient.get(`/api/ml/presets/${presetName}/config`);
  },

  // ========== Training & State ==========
  
  /**
   * Request model retraining for a preset
   */
  async retrain(presetName: string): Promise<{ success: boolean; message: string; job_id?: string }> {
    return apiClient.post(`/api/ml/presets/${presetName}/retrain`);
  },

  /**
   * Get current training state and progress
   */
  async getState(presetName: string): Promise<MLPresetState> {
    return apiClient.get(`/api/ml/presets/${presetName}/state`);
  },

  // ========== Analysis & Performance ==========
  
  /**
   * Get model performance metrics
   * Transforms API response to match MLPerformance interface
   */
  async getPerformance(presetName: string): Promise<MLPerformance> {
    try {
      const result = await apiClient.get(`/api/ml/presets/${presetName}/performance`);
      console.log('[ML Service] getPerformance raw result:', result);
      
      // Validate response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format from performance API');
      }
      
      // Extract metrics from nested structure
      const metrics = result.test_metrics?.depression_truth;
      const confusionMatrix = result.confusion_matrices?.depression_truth;
      const permutationImportance = result.permutation_importance?.[0]?.top_k;
      
      if (!metrics) {
        throw new Error('No test metrics found in performance response');
      }
      
      // Transform feature importance from array to object
      const featureImportance: Record<string, number> = {};
      if (Array.isArray(permutationImportance)) {
        permutationImportance.forEach((item: any) => {
          if (item.name && typeof item.importance === 'number') {
            // Clean up feature name (remove cat__ prefix)
            const cleanName = item.name.replace('cat__', '').replace(/_/g, ' ');
            featureImportance[cleanName] = item.importance;
          }
        });
      }
      
      // Build MLPerformance object
      const performance: MLPerformance = {
        accuracy: metrics.acc || 0,
        precision: metrics.precision || 0,
        recall: metrics.recall || 0,
        f1_score: metrics.f1 || 0,
        confusion_matrix: confusionMatrix || [[0, 0], [0, 0]],
        feature_importance: featureImportance,
        class_labels: ['Normal', 'Depression']
      };
      
      console.log('[ML Service] Transformed performance:', performance);
      return performance;
      
    } catch (error: any) {
      console.error('[ML Service] getPerformance error:', error);
      
      // Provide user-friendly error messages
      if (error?.response?.status === 404) {
        throw new Error(`Preset "${presetName}" not found or has no performance metrics yet. Please train the model first.`);
      }
      if (error?.response?.status === 500) {
        throw new Error('Server error while fetching performance metrics. Please try again later.');
      }
      
      throw error;
    }
  },

  /**
   * Get dataset analysis statistics
   */
  async getAnalysis(presetName: string): Promise<MLAnalysis> {
    try {
      const result = await apiClient.get(`/api/ml/presets/${presetName}/analysis`);
      
      // Validate response format
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format from analysis API');
      }
      
      // Check if response is empty
      if (Object.keys(result).length === 0) {
        throw new Error('No analysis data available. The preset may not be trained yet.');
      }
      
      // Check required fields from actual API response
      const required = ['splits', 'column_analysis'] as const;
      for (const field of required) {
        if (!(field in result)) {
          throw new Error(`Missing required field: ${field}. Please ensure the preset is trained and analysis is available.`);
        }
      }
      
      return result as MLAnalysis;
    } catch (error: any) {
      // Provide user-friendly error messages
      if (error?.response?.status === 404) {
        throw new Error(`Preset "${presetName}" not found or has no analysis data yet.`);
      }
      if (error?.response?.status === 500) {
        throw new Error('Server error while fetching analysis. Please try again later.');
      }
      // Re-throw with original message if already formatted
      throw error;
    }
  },

  /**
   * Get visualization plot URLs
   * Returns object with plots dictionary: { plots: { "plot_name.png": "/path/to/plot.png", ... } }
   */
  async getPlots(presetName: string): Promise<MLPlots> {
    try {
      const result = await apiClient.get(`/api/ml/presets/${presetName}/plots`);
      console.log('[ML Service] getPlots raw result:', result);
      
      // Validate response has plots property
      if (!result || typeof result !== 'object') {
        console.warn('[ML Service] getPlots returned non-object:', result);
        return { plots: {} };
      }
      
      // Check if plots property exists
      if (!('plots' in result)) {
        console.warn('[ML Service] getPlots missing plots property:', result);
        return { plots: {} };
      }
      
      const plots = (result as any).plots;
      
      // Validate plots is an object
      if (typeof plots !== 'object' || plots === null) {
        console.warn('[ML Service] plots is not an object:', plots);
        return { plots: {} };
      }
      
      return { plots };
    } catch (error: any) {
      console.error('[ML Service] getPlots error:', error);
      
      // Provide user-friendly error messages
      if (error?.response?.status === 404) {
        throw new Error(`Preset "${presetName}" not found or has no plots generated yet.`);
      }
      if (error?.response?.status === 500) {
        throw new Error('Server error while fetching plots. Please try again later.');
      }
      
      // Return empty plots on error to avoid crashes
      return { plots: {} };
    }
  },

  // ========== Prediction ==========
  
  /**
   * Make a prediction using the preset's model
   */
  async predict(presetName: string, input: MLPredictionInput): Promise<MLPredictionResult> {
    return apiClient.post(`/api/ml/presets/${presetName}/predict`, input);
  }
};
