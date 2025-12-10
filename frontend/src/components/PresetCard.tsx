import React from "react";
import { Bot, Clock, Trash2, RotateCcw, CheckCircle2 } from "lucide-react";
import { MLPreset, MLPresetState } from "../services/ml.service";

interface PresetCardProps {
  preset: MLPreset;
  isSelected?: boolean;
  onSelect: () => void;
  onRetrain: () => void;
  onDelete: () => void;
  presetState?: MLPresetState;
}

export function PresetCard({ preset, isSelected, onSelect, onRetrain, onDelete, presetState }: PresetCardProps) {
  // Use presetState if available, otherwise fall back to preset.status
  const currentStatus = presetState?.status || preset.status;
  
  const getStatusColor = (status: MLPreset['status'] | MLPresetState['status']) => {
    switch (status) {
      case 'trained':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          dot: 'bg-green-500'
        };
      case 'training':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-300',
          dot: 'bg-yellow-500 animate-pulse'
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          dot: 'bg-gray-500'
        };
    }
  };

  const statusColors = getStatusColor(currentStatus);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className={`bg-gradient-to-r from-white to-gray-50 border-2 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side - Preset Info */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <Bot className="w-5 h-5 text-gray-600 flex-shrink-0" aria-hidden="true" />
            <h3 className="font-bold text-gray-900 text-base truncate" title={preset.name}>
              {preset.name}
            </h3>
            {/* Status Badge */}
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`}></span>
              {currentStatus.toUpperCase()}
            </span>
          </div>

          {/* Progress Bar - Show when training */}
          {presetState?.status === 'training' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600 font-medium">Training Progress</span>
                <span className="text-yellow-700 font-bold">{Math.round(presetState.progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${presetState.progress * 100}%` }}
                />
              </div>
              {presetState.accuracy !== undefined && (
                <div className="text-xs text-gray-500 mt-1">
                  Current Accuracy: {(presetState.accuracy * 100).toFixed(2)}%
                </div>
              )}
            </div>
          )}

          {/* Error Message - Show when error */}
          {presetState?.status === 'error' && presetState.error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <span className="font-semibold">Error:</span> {presetState.error}
            </div>
          )}

          {/* Details */}
          <div className="space-y-2 text-sm">
            {preset.dataset_name && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xs">📊 Dataset:</span>
                <span className="font-medium text-gray-900">{preset.dataset_name}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span className="text-xs">
                Created: {formatDate(preset.created_at)}
              </span>
            </div>

            {preset.last_trained && (
              <div className="flex items-center gap-2 text-gray-500">
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                <span className="text-xs">
                  Last trained: {formatDate(preset.last_trained)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetrain();
            }}
            disabled={currentStatus === 'training'}
            className="px-4 py-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Retrain this preset"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Retrain</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={currentStatus === 'training'}
            className="px-4 py-2 text-xs border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete this preset"
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
