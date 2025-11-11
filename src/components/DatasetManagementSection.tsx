import { useEffect, useMemo, useRef, useState } from "react";
import { listDatasets, uploadDataset } from "../services/datasets";
import { toast } from "sonner";
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
    <div className="absolute bg-white rounded-[8px] p-[24px] top-[1140px] left-[calc(16.667%+83.978px)] w-[1149px] border border-[#e5e5e5]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <div className="relative shrink-0 size-[20px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d="M17.5 7.5V12.5C17.5 16.6667 16.25 17.9167 12.0833 17.9167H7.91667C3.75 17.9167 2.5 16.6667 2.5 12.5V7.5C2.5 3.33333 3.75 2.08333 7.91667 2.08333H12.0833C16.25 2.08333 17.5 3.33333 17.5 7.5Z" fill="#0C1E33"/>
                <path d="M12.0833 11.6667H10.8333V12.9167C10.8333 13.375 10.4583 13.75 10 13.75C9.54167 13.75 9.16667 13.375 9.16667 12.9167V11.6667H7.91667C7.45833 11.6667 7.08333 11.2917 7.08333 10.8333C7.08333 10.375 7.45833 10 7.91667 10H9.16667V8.75C9.16667 8.29167 9.54167 7.91667 10 7.91667C10.4583 7.91667 10.8333 8.29167 10.8333 8.75V10H12.0833C12.5417 10 12.9167 10.375 12.9167 10.8333C12.9167 11.2917 12.5417 11.6667 12.0833 11.6667Z" fill="#0C1E33"/>
              </svg>
            </div>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Dataset Management</p>
          </div>

          <div className="flex items-center gap-[12px]">
            <input ref={fileInputRef} type="file" accept=".csv,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={onFileSelected} />
            <button onClick={onClickUpload} disabled={isUploading} className="bg-[#4c85e9] text-white px-[16px] py-[8px] rounded-[6px] font-['Poppins:Medium',sans-serif] text-[12px] hover:bg-[#4c85e9]/90 transition-colors flex items-center gap-[8px] disabled:opacity-60">
              <svg className="size-[14px]" fill="none" viewBox="0 0 20 20">
                <path d="M17.5 7.5V12.5C17.5 16.6667 16.25 17.9167 12.0833 17.9167H7.91667C3.75 17.9167 2.5 16.6667 2.5 12.5V7.5C2.5 3.33333 3.75 2.08333 7.91667 2.08333H12.0833C16.25 2.08333 17.5 3.33333 17.5 7.5Z" fill="white"/>
                <path d="M12.0833 11.6667H10.8333V12.9167C10.8333 13.375 10.4583 13.75 10 13.75C9.54167 13.75 9.16667 13.375 9.16667 12.9167V11.6667H7.91667C7.45833 11.6667 7.08333 11.2917 7.08333 10.8333C7.08333 10.375 7.45833 10 7.91667 10H9.16667V8.75C9.16667 8.29167 9.54167 7.91667 10 7.91667C10.4583 7.91667 10.8333 8.29167 10.8333 8.75V10H12.0833C12.5417 10 12.9167 10.375 12.9167 10.8333C12.9167 11.2917 12.5417 11.6667 12.0833 11.6667Z" fill="white"/>
              </svg>
              {isUploading ? "Uploading..." : "Upload Dataset"}
            </button>
            <button className="bg-[#27ae60] text-white px-[16px] py-[8px] rounded-[6px] font-['Poppins:Medium',sans-serif] text-[12px] hover:bg-[#27ae60]/90 transition-colors">
              Export Data
            </button>
          </div>
        </div>

        {/* Dataset Info Cards */}
        <div className="grid grid-cols-4 gap-[16px]">
          <div className="bg-[#f4f6f7] rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <div className="size-[32px] rounded-full bg-[#4c85e9]/10 flex items-center justify-center">
                <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                  <path d="M7.5 2.5H12.5C15 2.5 15 1.66667 15 0.833333C15 0 14.1667 0 12.5 0H7.5C5.83333 0 5 0 5 0.833333C5 1.66667 5 2.5 7.5 2.5Z" transform="translate(2.5 2.5)" fill="#4c85e9"/>
                  <path d="M15 0.833333C15 1.66667 15 2.5 12.5 2.5H7.5C5 2.5 5 1.66667 5 0.833333C5 0 5.83333 0 7.5 0H12.5C14.1667 0 15 0 15 0.833333ZM12.5 5.83333H7.5C4.16667 5.83333 2.5 7.5 2.5 10.8333V11.6667C2.5 15 4.16667 16.6667 7.5 16.6667H12.5C15.8333 16.6667 17.5 15 17.5 11.6667V10.8333C17.5 7.5 15.8333 5.83333 12.5 5.83333Z" transform="translate(0 0.833333)" fill="#4c85e9"/>
                </svg>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Total Samples</p>
            </div>
            <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[28px]">{totalSamples}</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[#27ae60] text-[10px] mt-[4px]">+12 this week</p>
          </div>

          <div className="bg-[#f4f6f7] rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <div className="size-[32px] rounded-full bg-[#27ae60]/10 flex items-center justify-center">
                <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                  <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#27ae60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.66667 10L8.81667 12.15L13.3333 7.85" stroke="#27ae60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Training Set</p>
            </div>
            <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[28px]">{Math.floor(totalSamples * 0.8)}</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[10px] mt-[4px]">80% of total</p>
          </div>

          <div className="bg-[#f4f6f7] rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <div className="size-[32px] rounded-full bg-[#f2994a]/10 flex items-center justify-center">
                <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                  <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#f2994a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 6.66667V10.8333" stroke="#f2994a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.99609 13.3333H10.0036" stroke="#f2994a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Testing Set</p>
            </div>
            <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[28px]">{Math.floor(totalSamples * 0.2)}</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[10px] mt-[4px]">20% of total</p>
          </div>

          <div className="bg-[#f4f6f7] rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <div className="flex items-center gap-[8px] mb-[8px]">
              <div className="size-[32px] rounded-full bg-[#eb5757]/10 flex items-center justify-center">
                <svg className="size-[18px]" fill="none" viewBox="0 0 20 20">
                  <path d="M7.5 15.8333H12.5C16.6667 15.8333 17.5 14.1667 17.5 10.8333V9.16667C17.5 5.83333 16.6667 4.16667 12.5 4.16667H7.5C3.33333 4.16667 2.5 5.83333 2.5 9.16667V10.8333C2.5 14.1667 3.33333 15.8333 7.5 15.8333Z" stroke="#eb5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.08333 4.16667V2.5" stroke="#eb5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.9167 4.16667V2.5" stroke="#eb5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 11.25H17.5" stroke="#eb5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Last Update</p>
            </div>
            <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[18px]">Nov 1</p>
            <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[10px] mt-[4px]">2025, 14:30</p>
          </div>
        </div>

        {/* Dataset Split Visualization */}
        <div className="bg-[#f9fafb] rounded-[8px] p-[20px] border border-[#e5e5e5]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[14px] mb-[16px]">Data Split Ratio</p>
          
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
        <div className="grid grid-cols-3 gap-[16px]">
          <div className="bg-white rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[8px]">Data Completeness</p>
            <div className="flex items-end gap-[8px]">
              <p className="font-['Poppins:Bold',sans-serif] text-[#27ae60] text-[32px] leading-none">98.5%</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[#27ae60] text-[11px] mb-[4px]">Excellent</p>
            </div>
            <div className="w-full h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden mt-[8px]">
              <div className="h-full bg-[#27ae60]" style={{ width: '98.5%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[8px]">Missing Values</p>
            <div className="flex items-end gap-[8px]">
              <p className="font-['Poppins:Bold',sans-serif] text-[#4c85e9] text-[32px] leading-none">1.5%</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Low</p>
            </div>
            <div className="w-full h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden mt-[8px]">
              <div className="h-full bg-[#4c85e9]" style={{ width: '1.5%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-[16px] border border-[#e5e5e5]">
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[8px]">Data Balance</p>
            <div className="flex items-end gap-[8px]">
              <p className="font-['Poppins:Bold',sans-serif] text-[#f2994a] text-[32px] leading-none">85%</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[#f2994a] text-[11px] mb-[4px]">Good</p>
            </div>
            <div className="w-full h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden mt-[8px]">
              <div className="h-full bg-[#f2994a]" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* Feature Correlation Matrix */}
        <div className="bg-white rounded-[8px] p-[20px] border border-[#e5e5e5]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M2.5 7.08333H17.5" stroke="#0C1E33" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2.5 12.9167H17.5" stroke="#0C1E33" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M7.08333 2.5V17.5" stroke="#0C1E33" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12.9167 2.5V17.5" stroke="#0C1E33" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Feature Correlation Matrix</p>
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
