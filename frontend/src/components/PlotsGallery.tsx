import { useEffect, useState } from "react";
import { mlService, type MLPlots } from "../services/ml.service";
import { BarChart3, X, ZoomIn, Download, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PlotsGalleryProps {
  presetName: string;
  className?: string;
}

interface PlotItem {
  name: string;
  displayName: string;
  url: string;
  category: 'model' | 'feature' | 'dataset';
}

/**
 * PlotsGallery Component
 * 
 * Displays all visualization plots for a trained ML preset.
 * Features:
 * - Grid layout with responsive design
 * - Click to zoom (full-screen modal)
 * - Download plot functionality
 * - Categorized plots (Model Performance, Feature Analysis, Dataset Overview)
 * - Loading states and error handling
 * 
 * Defense Strategy (learned from Phase 5 bugs):
 * - Layer 1: Service validates API response structure
 * - Layer 2: Component validates plots object before processing
 * - Layer 3: UI safely renders with existence checks
 */
export function PlotsGallery({ presetName, className = "" }: PlotsGalleryProps) {
  const [plots, setPlots] = useState<MLPlots | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<PlotItem | null>(null);

  useEffect(() => {
    if (!presetName || presetName === 'default') {
      setPlots(null);
      setError('Please select a valid preset to view plots');
      return;
    }

    let mounted = true;

    const loadPlots = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('[PlotsGallery] Fetching plots for preset:', presetName);
        const data = await mlService.getPlots(presetName);
        console.log('[PlotsGallery] Received data:', data);
        
        if (mounted) {
          setPlots(data);
        }
      } catch (err: any) {
        console.error('[PlotsGallery] Error loading plots:', err);
        if (mounted) {
          setError(err?.message || 'Failed to load plots');
          toast.error(err?.message || 'Failed to load plots');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPlots();

    return () => {
      mounted = false;
    };
  }, [presetName]);

  // Categorize and format plot names
  const categorizePlots = (): Record<string, PlotItem[]> => {
    // Defense Layer 2: Validate plots object exists and is valid
    if (!plots || !plots.plots || typeof plots.plots !== 'object') {
      console.warn('[PlotsGallery] Invalid plots object:', plots);
      return { model: [], feature: [], dataset: [] };
    }

    const categorized: Record<string, PlotItem[]> = {
      model: [],
      feature: [],
      dataset: []
    };

    // Process each plot
    Object.entries(plots.plots).forEach(([filename, path]) => {
      // Skip if path is not a string
      if (typeof path !== 'string') {
        console.warn('[PlotsGallery] Invalid path for', filename, ':', path);
        return;
      }

      // Format display name
      let displayName = filename
        .replace('.png', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      // Determine category based on filename
      let category: 'model' | 'feature' | 'dataset' = 'dataset';
      
      if (filename.includes('confusion_matrix')) {
        category = 'model';
        displayName = 'Confusion Matrix';
      } else if (filename.includes('feature_box') || filename.includes('feature_prop')) {
        category = 'feature';
      } else if (filename.includes('column_analysis')) {
        category = 'dataset';
      }

      categorized[category].push({
        name: filename,
        displayName,
        url: path,
        category
      });
    });

    return categorized;
  };

  const categorizedPlots = categorizePlots();
  const totalPlots = Object.values(categorizedPlots).reduce((sum, arr) => sum + arr.length, 0);

  // Handle plot download
  const handleDownload = async (plot: PlotItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    
    try {
      // Get base URL from environment or default to localhost
      const baseUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
      const fullUrl = `${baseUrl}${plot.url}`;
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = plot.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading ${plot.displayName}`);
    } catch (err) {
      console.error('[PlotsGallery] Download error:', err);
      toast.error('Failed to download plot');
    }
  };

  // Render category section
  const renderCategory = (title: string, icon: React.ReactNode, plots: PlotItem[]) => {
    if (plots.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-blue-600">{icon}</div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-sm text-gray-500">({plots.length} plot{plots.length > 1 ? 's' : ''})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plots.map((plot) => (
            <PlotCard
              key={plot.name}
              plot={plot}
              onView={() => setSelectedPlot(plot)}
              onDownload={(e) => handleDownload(plot, e)}
            />
          ))}
        </div>
      </div>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading plots gallery...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error Loading Plots</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (totalPlots === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No Plots Available</p>
          <p className="text-sm mt-2">Train the model to generate visualization plots</p>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Plots Gallery</h2>
          <p className="text-gray-600 text-sm mt-1">
            Visualization plots for <span className="font-medium">{presetName}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Plots</p>
          <p className="text-3xl font-bold text-blue-600">{totalPlots}</p>
        </div>
      </div>

      {/* Plot Categories */}
      {renderCategory('Model Performance', <BarChart3 className="w-5 h-5" />, categorizedPlots.model)}
      {renderCategory('Feature Analysis', <BarChart3 className="w-5 h-5" />, categorizedPlots.feature)}
      {renderCategory('Dataset Overview', <BarChart3 className="w-5 h-5" />, categorizedPlots.dataset)}

      {/* Full-Screen Modal */}
      {selectedPlot && (
        <PlotModal
          plot={selectedPlot}
          onClose={() => setSelectedPlot(null)}
          onDownload={(e) => handleDownload(selectedPlot, e)}
        />
      )}
    </div>
  );
}

// ============================================================================
// PlotCard Component
// ============================================================================

interface PlotCardProps {
  plot: PlotItem;
  onView: () => void;
  onDownload: (e: React.MouseEvent) => void;
}

function PlotCard({ plot, onView, onDownload }: PlotCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get full URL for image
  const baseUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
  const fullUrl = `${baseUrl}${plot.url}`;

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={onView}
    >
      {/* Image Container */}
      <div className="relative aspect-video bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-xs">Failed to load image</p>
          </div>
        ) : (
          <img
            src={fullUrl}
            alt={plot.displayName}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Info Footer */}
      <div className="p-3 bg-white">
        <p className="text-sm font-medium text-gray-800 truncate">{plot.displayName}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            plot.category === 'model' ? 'bg-blue-100 text-blue-700' :
            plot.category === 'feature' ? 'bg-green-100 text-green-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {plot.category}
          </span>
          
          <button
            onClick={onDownload}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Download plot"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PlotModal Component - Full-Screen View
// ============================================================================

interface PlotModalProps {
  plot: PlotItem;
  onClose: () => void;
  onDownload: (e: React.MouseEvent) => void;
}

function PlotModal({ plot, onClose, onDownload }: PlotModalProps) {
  const baseUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
  const fullUrl = `${baseUrl}${plot.url}`;

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="relative max-w-6xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{plot.displayName}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-lg overflow-hidden">
          <img
            src={fullUrl}
            alt={plot.displayName}
            className="w-full h-auto"
          />
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">{plot.name}</p>
        </div>
      </div>
    </div>
  );
}
