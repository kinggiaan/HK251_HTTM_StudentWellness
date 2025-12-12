import React, { useState, useEffect } from "react";
import { X, Upload, FileText, Settings, ChevronDown, Info } from "lucide-react";
import { mlService } from "../services/ml.service";
import { toast } from "sonner";

interface CreatePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPresetCreated: (presetName: string) => void;
}

// Default features available
const AVAILABLE_FEATURES = [
  "Gender",
  "Age",
  "Academic Pressure",
  "CGPA",
  "Study Satisfaction",
  "Sleep Duration",
  "Dietary Habits",
  "Work/Study Hours",
  "Financial Stress",
  "Family History of Mental Illness"
];

export function CreatePresetDialog({ open, onOpenChange, onPresetCreated }: CreatePresetDialogProps) {
  const [presetName, setPresetName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Visual config mode
  const [useVisualConfig, setUseVisualConfig] = useState(true);
  
  // Visual config states
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(AVAILABLE_FEATURES);
  const [testSize, setTestSize] = useState(0.2);
  const [nEstimators, setNEstimators] = useState(300);
  const [maxDepth, setMaxDepth] = useState<number | null>(10);
  const [classWeight, setClassWeight] = useState<"balanced" | "none">("none");
  
  // JSON config state (for advanced mode)
  const [jsonConfig, setJsonConfig] = useState("{}");
  
  // Sync visual config to JSON when switching modes
  useEffect(() => {
    if (useVisualConfig) {
      const config: any = {
        features: selectedFeatures.length === AVAILABLE_FEATURES.length ? [] : selectedFeatures,
        test_size: testSize,
        n_estimators: nEstimators,
      };
      
      if (maxDepth !== null) {
        config.max_depth = maxDepth;
      }
      
      if (classWeight === "balanced") {
        config.class_weight = "balanced";
      } else if (classWeight === "none") {
        config.class_weight = null;
      }
      
      setJsonConfig(JSON.stringify(config, null, 2));
    }
  }, [useVisualConfig, selectedFeatures, testSize, nEstimators, maxDepth, classWeight]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error("Please select a CSV file");
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  const toggleAllFeatures = () => {
    setSelectedFeatures(prev => 
      prev.length === AVAILABLE_FEATURES.length 
        ? [] 
        : AVAILABLE_FEATURES
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!presetName.trim()) {
      toast.error("Please enter a preset name");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a CSV file");
      return;
    }
    
    // Use the appropriate config based on mode
    const configToSend = useVisualConfig ? jsonConfig : jsonConfig;

    // Validate JSON config
    try {
      JSON.parse(configToSend);
    } catch (error) {
      toast.error("Invalid JSON config format");
      return;
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('preset_name', presetName.trim());
      formData.append('config', configToSend);

      const result = await mlService.createPreset(formData);
      
      const createdPresetName = result.preset_name;
      
      toast.success(`Preset "${createdPresetName}" created successfully!`);
      
      // Automatically start training for the new preset
      try {
        await mlService.retrain(createdPresetName);
        toast.info(`Training started for "${createdPresetName}"...`);
      } catch (retrainError: any) {
        console.error('Failed to start training:', retrainError);
        toast.warning(`Preset created but failed to start training. Please manually retrain.`);
      }
      
      // Reset form
      setPresetName("");
      setSelectedFile(null);
      setSelectedFeatures(AVAILABLE_FEATURES);
      setTestSize(0.2);
      setNEstimators(300);
      setMaxDepth(10);
      setClassWeight("none");
      setJsonConfig("{}");
      
      // Close dialog and notify parent with preset name
      onOpenChange(false);
      onPresetCreated(createdPresetName);
    } catch (error: any) {
      toast.error(error.message || "Failed to create preset");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Preset</h2>
              <p className="text-sm text-gray-500">Upload dataset and configure model</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Preset Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4" aria-hidden="true" />
              Preset Name *
            </label>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g., preset1, student_wellness_v2"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={isCreating}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Choose a unique name for this preset</p>
          </div>

          {/* File Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Upload className="w-4 h-4" aria-hidden="true" />
              Dataset File (CSV) *
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isCreating}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                  selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className={`w-6 h-6 ${selectedFile ? 'text-green-600' : 'text-gray-400'}`} aria-hidden="true" />
                <div className="text-center">
                  {selectedFile ? (
                    <>
                      <p className="font-semibold text-green-700">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-700">Click to upload CSV file</p>
                      <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload your training dataset in CSV format
            </p>
          </div>

          {/* Configuration Mode Toggle */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Settings className="w-4 h-4" aria-hidden="true" />
                Model Configuration
              </label>
              <button
                type="button"
                onClick={() => setUseVisualConfig(!useVisualConfig)}
                className="px-3 py-1 text-xs font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                disabled={isCreating}
              >
                {useVisualConfig ? "Switch to JSON" : "Switch to Visual"}
              </button>
            </div>

            {useVisualConfig ? (
              /* Visual Configuration Mode */
              <div className="space-y-6 bg-gray-50 rounded-xl p-6">
                {/* Features Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Select Features ({selectedFeatures.length}/{AVAILABLE_FEATURES.length})
                    </label>
                    <button
                      type="button"
                      onClick={toggleAllFeatures}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      disabled={isCreating}
                    >
                      {selectedFeatures.length === AVAILABLE_FEATURES.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_FEATURES.map(feature => (
                      <label
                        key={feature}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedFeatures.includes(feature)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          disabled={isCreating}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xs font-medium">{feature}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <Info className="w-3 h-3 inline mr-1" />
                    Leave all selected to use default features
                  </p>
                </div>

                {/* Test Size Slider */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Test Size: {(testSize * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={testSize * 100}
                    onChange={(e) => setTestSize(Number(e.target.value) / 100)}
                    disabled={isCreating}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>25%</span>
                    <span>40%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Percentage of data used for testing (recommended: 20%)
                  </p>
                </div>

                {/* N Estimators */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Number of Trees (n_estimators): {nEstimators}
                  </label>
                  <select
                    value={nEstimators}
                    onChange={(e) => setNEstimators(Number(e.target.value))}
                    disabled={isCreating}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value={50}>50 (Fast - Lower Accuracy)</option>
                    <option value={100}>100 (Balanced - Recommended)</option>
                    <option value={200}>200 (Good - Higher Accuracy)</option>
                    <option value={300}>300 (Better - More Accurate)</option>
                    <option value={500}>500 (Best - Highest Accuracy)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    More trees = better accuracy but slower training
                  </p>
                </div>

                {/* Max Depth */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Max Tree Depth: {maxDepth === null ? "Unlimited" : maxDepth}
                  </label>
                  <select
                    value={maxDepth === null ? "null" : maxDepth}
                    onChange={(e) => setMaxDepth(e.target.value === "null" ? null : Number(e.target.value))}
                    disabled={isCreating}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="null">Unlimited (Best for large datasets)</option>
                    <option value={5}>5 (Shallow - Prevent overfitting)</option>
                    <option value={10}>10 (Moderate - Balanced)</option>
                    <option value={15}>15 (Deep - More complex patterns)</option>
                    <option value={20}>20 (Very Deep - Large datasets)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Limit depth for small datasets to prevent overfitting
                  </p>
                </div>

                {/* Class Weight */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Class Weight Strategy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setClassWeight("balanced")}
                      disabled={isCreating}
                      className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                        classWeight === "balanced"
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      ⚖️ Balanced
                      <p className="text-xs font-normal mt-1">Auto-adjust for imbalanced data</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setClassWeight("none")}
                      disabled={isCreating}
                      className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                        classWeight === "none"
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      } ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      📊 None
                      <p className="text-xs font-normal mt-1">Equal weights (balanced data)</p>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use "Balanced" if your dataset has unequal class distribution
                  </p>
                </div>

                {/* Preview Generated Config */}
                <div className="border-t border-gray-300 pt-4">
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Generated Configuration Preview:
                  </label>
                  <pre className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-xs overflow-x-auto">
                    {jsonConfig}
                  </pre>
                </div>
              </div>
            ) : (
              /* JSON Configuration Mode */
              <div>
                <textarea
                  value={jsonConfig}
                  onChange={(e) => setJsonConfig(e.target.value)}
                  placeholder='{"features": [], "test_size": 0.2, "n_estimators": 100}'
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
                  disabled={isCreating}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Advanced: Edit JSON configuration directly. Leave as {} for defaults.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !presetName.trim() || !selectedFile}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" aria-hidden="true" />
                  Create Preset
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
