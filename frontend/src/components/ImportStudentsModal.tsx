import React, { useState, useRef } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../lib/api';
import { toast } from 'sonner';

interface ImportStudentsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export function ImportStudentsModal({ onClose, onSuccess }: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Chỉ chấp nhận file CSV');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file CSV');
      return;
    }

    setIsUploading(true);
    setResult(null);

    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
      
      if (lines.length < 2) {
        toast.error('File rỗng hoặc không đúng định dạng');
        return;
      }

      const headers = lines[0].split(',').map((h: string) => h.trim().toLowerCase());
      
      // Validate required columns
      const required = ['name', 'age', 'gender'];
      const missing = required.filter(r => !headers.includes(r));
      if (missing.length > 0) {
        toast.error(`Thiếu cột bắt buộc: ${missing.join(', ')}`);
        return;
      }

      // Parse CSV rows
      const rows = lines.slice(1).map((line: string) => {
        const cells = line.split(',');
        const obj: Record<string, string> = {};
        headers.forEach((h: string, i: number) => {
          obj[h] = (cells[i] ?? '').trim();
        });
        return obj;
      });

      // Import each student using existing create API
      for (let i = 0; i < rows.length; i++) {
        try {
          const row = rows[i];
          
          // Validate required fields
          if (!row.name || !row.age || !row.gender) {
            results.failed++;
            results.errors.push(`Dòng ${i + 2}: Thiếu thông tin bắt buộc (name, age, gender)`);
            continue;
          }

          // Prepare student data
          const studentData: any = {
            name: row.name,
            age: parseInt(row.age) || 0,
            gender: row.gender,
            validated: false
          };

          // Add optional fields if provided
          if (row.cgpa) studentData.cgpa = parseFloat(row.cgpa);
          if (row.city) studentData.city = row.city;
          if (row.degree) studentData.degree = row.degree;
          if (row.academic_pressure) studentData.academic_pressure = parseInt(row.academic_pressure);
          if (row.study_satisfaction) studentData.study_satisfaction = parseInt(row.study_satisfaction);
          if (row.sleep_duration) studentData.sleep_duration = row.sleep_duration;
          if (row.dietary_habits) studentData.dietary_habits = row.dietary_habits;
          if (row.work_study_hours) studentData.work_study_hours = parseInt(row.work_study_hours);
          if (row.financial_stress) studentData.financial_stress = parseInt(row.financial_stress);
          if (row.family_his_of_mental_illness) studentData.family_his_of_mental_illness = row.family_his_of_mental_illness;

          // Call Strapi create API
          await apiClient.post('/api/students', {
            data: studentData
          });

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Dòng ${i + 2}: ${error.message || 'Lỗi không xác định'}`);
        }
      }

      setResult(results);
      
      if (results.failed === 0) {
        toast.success(`Import thành công ${results.success} sinh viên`);
        onSuccess();
      } else {
        toast.warning(`Thành công: ${results.success}, Thất bại: ${results.failed}`);
      }
    } catch (error: any) {
      console.error('Import failed:', error);
      toast.error(error.message || 'Import thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,age,gender,cgpa,city,degree,academic_pressure,study_satisfaction,sleep_duration,dietary_habits,work_study_hours,financial_stress,family_his_of_mental_illness
Nguyen Van A,20,Male,7.5,Ho Chi Minh,Third year,3,4,7-8 hours,Healthy,8,2,No
Tran Thi B,21,Female,8.2,Ha Noi,Fourth year,4,3,5-6 hours,Moderate,10,3,No
Le Van C,19,Male,6.8,Da Nang,Second year,2,5,7-8 hours,Healthy,6,1,No`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_students.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Đã tải template CSV');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Danh Sách Sinh Viên
            </h2>
            <p className="text-sm font-['Poppins:Regular',sans-serif] text-[#495d72] mt-1">
              Tải lên file CSV để thêm sinh viên mới hàng loạt
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-sm">
                    Hướng dẫn import sinh viên
                  </h4>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-xs mt-1">
                    File CSV cần có: <strong>name, age, gender</strong> (bắt buộc).
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-xs mt-1">
                    Các trường tùy chọn: cgpa (0-10), city, degree, academic_pressure (0-5), study_satisfaction (0-5), sleep_duration, dietary_habits, work_study_hours (0-24), financial_stress (0-5), family_his_of_mental_illness (Yes/No)
                  </p>
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-['Poppins:Medium',sans-serif] text-xs transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                Tải template
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] mb-2">
              Chọn file CSV
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              {file ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-['Poppins:Medium',sans-serif] text-sm">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="block mx-auto text-blue-600 hover:text-blue-700 font-['Poppins:Medium',sans-serif] text-sm"
                  >
                    Chọn file khác
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-['Poppins:Medium',sans-serif] text-sm"
                    >
                      Chọn file CSV
                    </button>
                    <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-xs mt-1">
                      hoặc kéo thả file vào đây
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Import Result */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.failed === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.failed === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-sm">
                    Kết quả import
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="font-['Poppins:Regular',sans-serif] text-sm">
                      <span className="text-green-600">✓ Thành công: {result.success}</span>
                    </p>
                    {result.failed > 0 && (
                      <p className="font-['Poppins:Regular',sans-serif] text-sm">
                        <span className="text-red-600">✗ Thất bại: {result.failed}</span>
                      </p>
                    )}
                  </div>
                  {result.errors.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200 max-h-32 overflow-y-auto">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-xs text-[#495d72] mb-2">
                        Chi tiết lỗi:
                      </p>
                      {result.errors.map((error, idx) => (
                        <p key={idx} className="font-['Poppins:Regular',sans-serif] text-xs text-red-600">
                          • {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-['Poppins:Medium',sans-serif] text-[#495d72] text-sm transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-['Poppins:Medium',sans-serif] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
