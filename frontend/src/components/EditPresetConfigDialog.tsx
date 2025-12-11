import React, { useState, useEffect } from "react";
import { X, Settings, Code } from "lucide-react";
import { toast } from "sonner";
import { mlService, type MLConfig } from "../services/ml.service";

interface EditPresetConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presetName: string;
  currentConfig: MLConfig;
  onConfigUpdated: () => void;
}

const AVAILABLE_FEATURES = [
  "age",
  "gender",
  "academic_year",
  "cgpa",
  "study_satisfaction",
  "sleep_duration",
  "dietary_habits",
  "suicidal_thoughts",
  "study_hours",
  "financial_concerns",
];

const N_ESTIMATORS_OPTIONS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
const MAX_DEPTH_OPTIONS = [5, 10, 15, 20, null]; // null = unlimited

export function EditPresetConfigDialog({
  isOpen,
  onClose,
  presetName,
  currentConfig,
  onConfigUpdated,
}: EditPresetConfigDialogProps) {
  const [useVisualConfig, setUseVisualConfig] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Visual config states
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({});
  const [testSize, setTestSize] = useState(20); // Percentage (10-40)
  const [nEstimators, setNEstimators] = useState(100);
  const [maxDepth, setMaxDepth] = useState<number | null>(null);
  const [classWeight, setClassWeight] = useState<"balanced" | "none">("balanced");

  // JSON mode state
  const [jsonConfig, setJsonConfig] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Initialize from currentConfig when dialog opens
  useEffect(() => {
    if (isOpen && currentConfig) {
      // Set visual config from current config
      const featuresMap: Record<string, boolean> = {};
      AVAILABLE_FEATURES.forEach(feature => {
        featuresMap[feature] = currentConfig.features?.includes(feature) || false;
      });
      setSelectedFeatures(featuresMap);
      setTestSize((currentConfig.test_size || 0.2) * 100);
      setNEstimators(currentConfig.n_estimators || 100);
      setMaxDepth(currentConfig.max_depth);
      setClassWeight(currentConfig.class_weight === "balanced" ? "balanced" : "none");

      // Set JSON mode
      setJsonConfig(JSON.stringify(currentConfig, null, 2));
      setJsonError(null);
    }
  }, [isOpen, currentConfig]);

  // Sync visual config to JSON preview
  useEffect(() => {
    if (useVisualConfig) {
      const features = Object.entries(selectedFeatures)
        .filter(([_, selected]) => selected)
        .map(([feature]) => feature);

      const config = {
        features,
        test_size: testSize / 100,
        n_estimators: nEstimators,
        max_depth: maxDepth,
        class_weight: classWeight,
      };

      setJsonConfig(JSON.stringify(config, null, 2));
    }
  }, [useVisualConfig, selectedFeatures, testSize, nEstimators, maxDepth, classWeight]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let configToSave: MLConfig;

      if (useVisualConfig) {
        // Build from visual controls
        const features = Object.entries(selectedFeatures)
          .filter(([_, selected]) => selected)
          .map(([feature]) => feature);

        if (features.length === 0) {
          toast.error("Please select at least one feature");
          return;
        }

        configToSave = {
          features,
          test_size: testSize / 100,
          n_estimators: nEstimators,
          max_depth: maxDepth,
          class_weight: classWeight,
        };
      } else {
        // Parse from JSON
        try {
          configToSave = JSON.parse(jsonConfig);
          setJsonError(null);
        } catch (error) {
          setJsonError("Invalid JSON format");
          toast.error("Invalid JSON format");
          return;
        }
      }

      // Call API to update config
      const result = await mlService.updateConfig(presetName, configToSave);
      
      if (result.success) {
        toast.success(`Configuration updated successfully for ${presetName}`);
        onConfigUpdated(); // Reload config in parent
        onClose();
      } else {
        toast.error(result.message || "Failed to update configuration");
      }
    } catch (error: any) {
      console.error("Failed to update config:", error);
      toast.error(error.message || "Failed to update configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonConfig(value);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch (error: any) {
      setJsonError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Edit Preset Configuration</h2>
              <p className="text-sm text-purple-100">Preset: {presetName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setUseVisualConfig(true)}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                useVisualConfig
                  ? "bg-white shadow-md text-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Visual Mode
              </div>
            </button>
            <button
              onClick={() => setUseVisualConfig(false)}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                !useVisualConfig
                  ? "bg-white shadow-md text-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                JSON Mode
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {useVisualConfig ? (
            <div className="space-y-6">
              {/* Features Selection */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🎯 Select Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_FEATURES.map((feature) => (
                    <label
                      key={feature}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedFeatures[feature]
                          ? "bg-purple-100 border-purple-400"
                          : "bg-white border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures[feature] || false}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="font-medium text-gray-700">
                        {feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Test Size Slider */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Test Size: {testSize}%
                </h3>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={testSize}
                  onChange={(e) => setTestSize(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-300 to-teal-400 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #86efac ${testSize * 2.5}%, #e5e7eb ${testSize * 2.5}%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>10%</span>
                  <span>40%</span>
                </div>
              </div>

              {/* N Estimators */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  🌳 Number of Estimators
                </h3>
                <select
                  value={nEstimators}
                  onChange={(e) => setNEstimators(Number(e.target.value))}
                  className="w-full p-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white font-medium"
                >
                  {N_ESTIMATORS_OPTIONS.map((val) => (
                    <option key={val} value={val}>
                      {val} trees
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Depth */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📏 Maximum Depth
                </h3>
                <select
                  value={maxDepth === null ? "null" : maxDepth}
                  onChange={(e) =>
                    setMaxDepth(e.target.value === "null" ? null : Number(e.target.value))
                  }
                  className="w-full p-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white font-medium"
                >
                  {MAX_DEPTH_OPTIONS.map((val) => (
                    <option key={val === null ? "null" : val} value={val === null ? "null" : val}>
                      {val === null ? "Unlimited" : `${val} levels`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Weight */}
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  ⚖️ Class Weight
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setClassWeight("balanced")}
                    className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all ${
                      classWeight === "balanced"
                        ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    ⚖️ Balanced
                  </button>
                  <button
                    onClick={() => setClassWeight("none")}
                    className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all ${
                      classWeight === "none"
                        ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    📊 None
                  </button>
                </div>
              </div>

              {/* JSON Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">
                  Configuration Preview (JSON)
                </h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {jsonConfig}
                </pre>
              </div>
            </div>
          ) : (
            /* JSON Editor Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Configuration JSON
                </label>
                <textarea
                  value={jsonConfig}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className={`w-full h-96 p-4 font-mono text-sm border-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    jsonError
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  placeholder='{"features": [...], "test_size": 0.2, ...}'
                />
                {jsonError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <span>⚠️</span>
                    {jsonError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-2.5 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || (!useVisualConfig && !!jsonError)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
