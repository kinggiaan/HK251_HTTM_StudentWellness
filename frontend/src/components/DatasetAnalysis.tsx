import React, { useEffect, useState } from 'react';
import { mlService, type MLAnalysis } from '../services/ml.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Database, FileText, AlertCircle, TrendingUp, Package } from 'lucide-react';

interface DatasetAnalysisProps {
  presetName: string;
  className?: string;
}

/**
 * DatasetAnalysis Component
 * 
 * Displays comprehensive dataset statistics and analysis for a selected ML preset:
 * - Dataset size and feature count
 * - Missing values percentage
 * - Outliers detected
 * - Target distribution chart
 * - Feature statistics summary
 */
export function DatasetAnalysis({ presetName, className = '' }: DatasetAnalysisProps) {
  const [analysis, setAnalysis] = useState<MLAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!presetName) {
      setAnalysis(null);
      return;
    }

    // Pre-flight check: Don't fetch if preset name is invalid
    if (presetName === 'default' || presetName === 'undefined' || presetName === 'null') {
      console.warn('[DatasetAnalysis] Invalid preset name:', presetName);
      setError(`Invalid preset name: "${presetName}". Please select a valid trained preset.`);
      return;
    }

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      console.log('[DatasetAnalysis] Fetching analysis for preset:', presetName);
      try {
        const data = await mlService.getAnalysis(presetName);
        console.log('[DatasetAnalysis] Received data:', data);
        
        // Log the entire structure for debugging
        console.log('[DatasetAnalysis] Full analysis structure:');
        console.log('- dataset_path:', data.dataset_path);
        console.log('- splits:', data.splits);
        console.log('- null_percent keys:', Object.keys(data.null_percent || {}));
        console.log('- column_analysis length:', data.column_analysis?.length);
        console.log('- feature_proportions length:', data.feature_proportions?.length);
        console.log('- feature_boxplots length:', data.feature_boxplots?.length);
        
        // Log full column_analysis for depression_truth
        const depCol = data.column_analysis?.find((c: any) => c.column === 'depression_truth');
        console.log('[DatasetAnalysis] Depression column full object:', depCol);
        console.log('[DatasetAnalysis] Depression column keys:', depCol ? Object.keys(depCol) : []);
        
        setAnalysis(data);
      } catch (err: any) {
        console.error('[DatasetAnalysis] Error fetching analysis:', err);
        setError(err?.message || 'Failed to load dataset analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [presetName]);

  // Calculate derived values from API response
  const datasetSize = analysis ? analysis.splits.train + analysis.splits.validation + analysis.splits.test : 0;
  const numFeatures = analysis ? analysis.column_analysis.filter((col: any) => col.column !== 'depression_truth' && col.type !== 'target').length : 0;
  
  // Find target column and extract distribution
  // Try multiple ways to find the target column
  let targetColumn = analysis?.column_analysis.find(
    (col: any) => col.column === 'depression_truth' || col.original_name === 'Depression'
  );
  
  // Fallback 1: Find any column with type='target' or similar
  if (!targetColumn) {
    targetColumn = analysis?.column_analysis.find(
      (col: any) => col.type === 'target' || col.column?.toLowerCase().includes('depression')
    );
  }
  
  // Fallback 2: Find column with top_categories (usually the target)
  if (!targetColumn) {
    targetColumn = analysis?.column_analysis.find(
      (col: any) => col.top_categories && Object.keys(col.top_categories).length > 0
    );
  }
  
  // Debug logging
  console.log('[DatasetAnalysis] Looking for target column...');
  console.log('[DatasetAnalysis] Available columns:', analysis?.column_analysis.map((c: any) => ({ 
    column: c.column, 
    original_name: c.original_name,
    type: c.type,
    has_top_categories: !!c.top_categories,
    all_properties: Object.keys(c)
  })));
  console.log('[DatasetAnalysis] Target column found:', targetColumn);
  console.log('[DatasetAnalysis] Target column keys:', targetColumn ? Object.keys(targetColumn) : []);
  
  // Try to get distribution from different possible locations
  let targetDistribution = targetColumn?.top_categories || {};
  
  // If no top_categories, try to use target_distribution from analysis root
  if (Object.keys(targetDistribution).length === 0 && analysis?.target_distribution) {
    console.log('[DatasetAnalysis] Using target_distribution from analysis root');
    targetDistribution = analysis.target_distribution;
  }
  
  // If still empty, try to calculate from value_counts if available
  if (Object.keys(targetDistribution).length === 0 && targetColumn?.value_counts) {
    console.log('[DatasetAnalysis] Using value_counts from target column');
    targetDistribution = targetColumn.value_counts;
  }
  
  // WORKAROUND: If still empty, try to find in describe object
  if (Object.keys(targetDistribution).length === 0 && targetColumn?.describe) {
    console.log('[DatasetAnalysis] Checking describe object:', targetColumn.describe);
    // Some APIs put distribution in describe.counts or describe.value_counts
    if (targetColumn.describe.counts) {
      targetDistribution = targetColumn.describe.counts;
    } else if (targetColumn.describe.value_counts) {
      targetDistribution = targetColumn.describe.value_counts;
    }
  }
  
  // LAST RESORT: Check if analysis has any property with distribution data
  if (Object.keys(targetDistribution).length === 0 && analysis) {
    console.log('[DatasetAnalysis] Searching entire analysis object for distribution...');
    
    // SOLUTION: Extract from feature_boxplots which contains actual counts!
    if (analysis.feature_boxplots && Array.isArray(analysis.feature_boxplots)) {
      console.log('[DatasetAnalysis] Checking feature_boxplots for distribution...');
      
      // Find any boxplot that has depression_truth as target
      const targetBoxplot = analysis.feature_boxplots.find(
        (bp: any) => bp.target === 'depression_truth' && bp.group_counts
      );
      
      if (targetBoxplot && targetBoxplot.group_counts) {
        console.log('[DatasetAnalysis] Found distribution in feature_boxplots.group_counts!');
        
        // Convert group_counts array to distribution object
        // group_counts: [{"label": "0", "count": 7367}, {"label": "1", "count": 10462}]
        targetDistribution = targetBoxplot.group_counts.reduce((acc: any, item: any) => {
          // Map 0 to "Normal", 1 to "Depression"
          const labelName = item.label === "0" ? "Normal" : "Depression";
          acc[labelName] = item.count;
          return acc;
        }, {});
        
        console.log('[DatasetAnalysis] Extracted distribution:', targetDistribution);
      }
    }
    
    // Fallback: Check for common distribution property names at root level
    if (Object.keys(targetDistribution).length === 0) {
      const distributionKeys = ['class_distribution', 'label_distribution', 'target_counts', 'class_counts', 'target_distribution'];
      for (const key of distributionKeys) {
        if ((analysis as any)[key] && typeof (analysis as any)[key] === 'object') {
          console.log(`[DatasetAnalysis] Found distribution in analysis.${key}`);
          targetDistribution = (analysis as any)[key];
          break;
        }
      }
    }
  }
  
  console.log('[DatasetAnalysis] Final target distribution:', targetDistribution);
  
  // Calculate average missing values percent
  const missingValuesPercent = analysis 
    ? Object.values(analysis.null_percent).reduce((sum: number, val: number) => sum + val, 0) / Object.keys(analysis.null_percent).length
    : 0;
  
  // Build feature stats from column_analysis
  const featureStats: Record<string, any> = {};
  if (analysis) {
    analysis.column_analysis.forEach((col: any) => {
      if (col.type === 'numeric' && col.describe && col.column !== 'depression_truth') {
        featureStats[col.original_name] = {
          mean: col.describe.mean,
          std: col.describe.std,
          min: col.describe.min,
          max: col.describe.max,
          unique_values: col.unique
        };
      }
    });
  }

  // Prepare chart data from target distribution
  const chartData = Object.keys(targetDistribution).length > 0
    ? Object.entries(targetDistribution).map(([label, value]) => ({
        label,
        count: value as number,
        percentage: (((value as number) / datasetSize) * 100).toFixed(1),
      }))
    : [];

  // Color palette for chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading dataset analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-blue-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 text-blue-600 mb-3">
          <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
          <div>
            <p className="font-medium">Model Training in Progress</p>
            <p className="text-sm text-gray-600 mt-1">Analysis data will be available once training completes.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis || typeof analysis !== 'object' || Object.keys(analysis).length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a preset to view dataset analysis</p>
            {analysis && Object.keys(analysis).length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ API returned empty data - preset may not have analysis yet
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Dataset Analysis</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Statistical overview and distribution for <span className="font-medium text-gray-700">{presetName}</span>
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dataset Size */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Dataset Size</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {datasetSize.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">Total records (Train: {analysis?.splits.train.toLocaleString()}, Test: {analysis?.splits.test.toLocaleString()})</p>
          </div>

          {/* Features Count */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-900">Features</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {numFeatures}
            </p>
            <p className="text-xs text-green-600 mt-1">Input variables</p>
          </div>

          {/* Missing Values */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-medium text-amber-900">Missing Values</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {missingValuesPercent.toFixed(2)}%
            </p>
            <p className="text-xs text-amber-600 mt-1">Average across all features</p>
          </div>

          {/* Data Quality */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Columns</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {analysis?.column_analysis.length ?? 0}
            </p>
            <p className="text-xs text-purple-600 mt-1">Total columns analyzed</p>
          </div>
        </div>

        {/* Target Distribution Chart */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Target Variable Distribution
          </h3>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} (${props.payload.percentage}%)`,
                    'Count'
                  ]}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p className="text-sm">No distribution data available</p>
            </div>
          )}
          
          {/* Distribution Summary */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {chartData.map((item, index) => (
              <div 
                key={item.label}
                className="flex items-center gap-2 text-sm"
              >
                <div 
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700 font-medium">{item.label}:</span>
                <span className="text-gray-600">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Statistics Table */}
        {Object.keys(featureStats).length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Feature Statistics</h3>
              <p className="text-xs text-gray-500 mt-1">Statistical summary for numeric features</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mean
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Std Dev
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Min
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Max
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Unique
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(featureStats).map(([feature, stats]) => (
                    <tr key={feature} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">
                        {feature}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-right">
                        {stats.mean !== undefined ? stats.mean.toFixed(2) : '-'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-right">
                        {stats.std !== undefined ? stats.std.toFixed(2) : '-'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-right">
                        {stats.min !== undefined ? stats.min.toFixed(2) : '-'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-right">
                        {stats.max !== undefined ? stats.max.toFixed(2) : '-'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-right">
                        {stats.unique_values !== undefined ? stats.unique_values : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
