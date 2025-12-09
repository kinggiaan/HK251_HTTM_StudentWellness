import { useEffect, useMemo, useRef, useState } from "react";
import { listDatasets, uploadDataset } from "../services/datasets";
import { toast } from "sonner";
import { BarChart3, CheckCircle2, FlaskConical, Calendar } from "lucide-react";
import correlationMatrix from "figma:asset/9cd4c173c374f15abc2fa955af96ccd62c5e6093.png";

export function DatasetManagement() {
  const [totalSamples, setTotalSamples] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function reload() {
    try {
      const res = await listDatasets({ page: 1, limit: 1 });
      const latest = res.items?.[0];
      setTotalSamples(latest?.totalSamples ?? 0);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load datasets");
    }
  }

  useEffect(() => {
    reload();
  }, []);

  function onClickUpload() {
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      await uploadDataset(file, file.name);
      toast.success("Dataset uploaded");
      await reload();
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="bg-white border-2 border-teal-300 rounded-lg p-8 shadow-md">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
              <span className="text-3xl">💾</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Dataset Management
              </h2>
              <p className="text-base text-gray-600 mt-1 font-semibold">{totalSamples} total samples loaded</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input ref={fileInputRef} type="file" accept=".csv,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={onFileSelected} />
            <button onClick={onClickUpload} disabled={isUploading} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              <span className="text-xl">📤</span>
              <span>{isUploading ? "Uploading..." : "Upload Dataset"}</span>
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-base hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
              <span className="text-xl">📥</span>
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Dataset Info Cards */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-8 h-8 text-blue-600" aria-hidden="true" />
              <p className="font-bold text-blue-900 text-xs uppercase">Total Samples</p>
            </div>
            <p className="font-black text-blue-700 text-5xl mb-2">{totalSamples}</p>
            <p className="font-semibold text-green-600 text-sm flex items-center gap-1">
              <span>↑</span>
              <span>+12 this week</span>
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" aria-hidden="true" />
              <p className="font-bold text-green-900 text-xs uppercase">Training Set</p>
            </div>
            <p className="font-black text-green-700 text-5xl mb-2">{Math.floor(totalSamples * 0.8)}</p>
            <p className="font-semibold text-green-600 text-sm">80% of total</p>
          </div>

          <div className="bg-white rounded-lg p-6 border-l-4 border-orange-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical className="w-8 h-8 text-orange-600" aria-hidden="true" />
              <p className="font-bold text-orange-900 text-xs uppercase">Testing Set</p>
            </div>
            <p className="font-black text-orange-700 text-5xl mb-2">{Math.floor(totalSamples * 0.2)}</p>
            <p className="font-semibold text-orange-600 text-sm">20% of total</p>
          </div>

          <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-8 h-8 text-purple-600" aria-hidden="true" />
              <p className="font-bold text-purple-900 text-xs uppercase">Last Update</p>
            </div>
            <p className="font-black text-purple-700 text-3xl mb-2">Nov 13</p>
            <p className="font-semibold text-purple-600 text-sm">2025, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        {/* Dataset Split Visualization */}
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-700" aria-hidden="true" />
            <p className="font-['Poppins:Bold',sans-serif] text-gray-900 text-base">Data Split Ratio</p>
          </div>
          
          <div className="flex items-center gap-[8px] mb-[12px]">
            <div className="flex-1 h-[24px] bg-[#e5e5e5] rounded-[4px] overflow-hidden flex">
              <div className="h-full bg-[#27ae60] flex items-center justify-center" style={{ width: '80%' }}>
                <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[11px]">Training (80%)</span>
              </div>
              <div className="h-full bg-[#f2994a] flex items-center justify-center" style={{ width: '20%' }}>
                <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[11px]">Test (20%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[12px] mt-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="size-[12px] rounded-[2px] bg-[#27ae60]"></div>
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">
                Training: {Math.floor(totalSamples * 0.8)} samples
              </p>
            </div>
            <div className="flex items-center gap-[8px]">
              <div className="size-[12px] rounded-[2px] bg-[#f2994a]"></div>
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">
                Testing: {Math.floor(totalSamples * 0.2)} samples
              </p>
            </div>
          </div>
        </div>

        {/* Data Quality Metrics */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <p className="font-bold text-green-900 text-sm uppercase">Data Completeness</p>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <p className="font-black text-green-700 text-5xl leading-none">98.5%</p>
              <p className="font-bold text-green-600 text-lg mb-2">Excellent</p>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: '98.5%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔍</span>
              <p className="font-bold text-blue-900 text-sm uppercase">Missing Values</p>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <p className="font-black text-blue-700 text-5xl leading-none">1.5%</p>
              <p className="font-bold text-blue-600 text-lg mb-2">Low</p>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '1.5%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border-l-4 border-orange-500 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚖️</span>
              <p className="font-bold text-orange-900 text-sm uppercase">Data Balance</p>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <p className="font-black text-orange-700 text-5xl leading-none">85%</p>
              <p className="font-bold text-orange-600 text-lg mb-2">Good</p>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Feature Correlation Matrix */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <p className="font-['Poppins:Bold',sans-serif] text-gray-900 text-lg">Feature Correlation Matrix</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <div className="size-[12px] rounded-full bg-[#f2994a]"></div>
                <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Class 0</p>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="size-[12px] rounded-full bg-[#4c85e9]"></div>
                <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Class 1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f9fafb] rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <img 
              src={correlationMatrix} 
              alt="Feature correlation matrix showing distributions and relationships between features" 
              className="w-full h-auto rounded-[4px]"
            />
          </div>
          
          <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] mt-[12px]">
            Pairwise scatter plots and distribution curves showing relationships between features for binary classification.
          </p>
        </div>
      </div>
    </div>
  );
}
