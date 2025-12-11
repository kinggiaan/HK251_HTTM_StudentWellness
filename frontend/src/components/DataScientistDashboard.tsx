import React, { useEffect, useMemo, useState } from "react";
import { usePermissions } from "../contexts/PermissionsContext";
import svgPaths from "../imports/svg-24pp62cn5v";
import img from "figma:asset/b84a227f158a096d5fb31a5a5f2dd6c595e78767.png";
import imgImage1 from "figma:asset/5ce7c74a7b703322bab79cb35e6c6cd9197ba400.png";
import imgImage2 from "figma:asset/4d017917f435f0b47041e4f44e1c93ff6b274c6e.png";
import { ModelConfigDialog } from "./ModelConfigDialog";
import { NotificationPanel } from "./NotificationPanel";
import { extendedMockStudents } from "../data/mockStudentsExtended";
import { MentalHealthRecord, mockMentalHealthRecords } from "../data/mockMentalHealth";
import { useStudents } from "../hooks/useStudents";
import { transformStudentsToMentalHealthRecords } from "../utils/dataTransform";
import type { Student } from "../services/students.service";
import { dataScientistNotifications } from "../data/mockNotificationsByRole";
import { DatasetManagement } from "./DatasetManagementSection";
import { listDatasets } from "../services/datasets";
import { toast } from "sonner";
import { Users, AlertCircle, AlertTriangle, CheckCircle2, BarChart3, Target, Check, Search, Scale, Info, TrendingUp, Bot, Eye, Download, Trash2, Clock, FileText, Settings } from "lucide-react";
import { mlService, type MLPreset, type MLPerformance, type MLConfig } from "../services/ml.service";
import { CreatePresetDialog } from "./CreatePresetDialog";
import { EditPresetConfigDialog } from "./EditPresetConfigDialog";
import { PresetCard } from "./PresetCard";
import { DatasetAnalysis } from "./DatasetAnalysis";
import { PlotsGallery } from "./PlotsGallery";

interface DataScientistDashboardProps {
  onLogout: () => void;
}

type DashboardView = "dashboard" | "modelSettings";

// Removed old absolute-positioned Welcome, Notification, and Header components

// Removed old absolute-positioned ModelOverview component

function Sidebar({ onLogout, currentView, onNavigate }: { onLogout: () => void; currentView: DashboardView; onNavigate: (view: DashboardView) => void }) {
  return (
    <div 
      className="fixed top-0 left-0 h-screen w-[200px] z-50 flex flex-col overflow-y-auto shadow-xl"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        bottom: 0, 
        height: '100vh', 
        width: '200px', 
        background: 'linear-gradient(180deg, #0a1628 0%, #0c1e33 50%, #142c47 100%)',
        zIndex: 50
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-white/20">
        <div className="shrink-0 size-4">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.p8fcdd00} fill="white" />
            <path d={svgPaths.p147ecfb0} fill="white" />
          </svg>
        </div>
        <div className="font-['Alumni_Sans_Inline_One:Regular',sans-serif] text-[16px] text-white">
          Data Scientist
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Dashboard Button */}
        <button
          onClick={() => onNavigate("dashboard")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs font-['Poppins:Medium',sans-serif] transition-all ${
            currentView === "dashboard" 
              ? "bg-blue-500/20 font-semibold border-l-2 border-blue-400" 
              : "hover:bg-white/5"
          }`}
        >
          <div className="shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p16a2c600} fill="white" />
              <path d={svgPaths.p2e95ef80} fill="white" />
              <path d={svgPaths.p2d8edc00} fill="white" />
              <path d={svgPaths.p15dc2100} fill="white" />
            </svg>
          </div>
          <span>Dashboard</span>
        </button>

        {/* Model Settings Button */}
        <button
          onClick={() => onNavigate("modelSettings")}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs font-['Poppins:Medium',sans-serif] transition-all ${
            currentView === "modelSettings" 
              ? "bg-purple-500/20 font-semibold border-l-2 border-purple-400" 
              : "hover:bg-white/5"
          }`}
        >
          <div className="shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p37842780} fill="white" />
            </svg>
          </div>
          <span>Model Settings</span>
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/20 pt-4">
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs font-['Poppins:Medium',sans-serif] hover:bg-red-500/20 transition-all"
        >
          <div className="shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p37611800} fill="white" />
              <path d={svgPaths.p28a1ad00} fill="white" />
            </svg>
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function ModelSettings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#0c1e33] mb-4">
          Model Settings
        </h2>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#495d72]">
          Configure your machine learning model parameters and training settings.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Configuration */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Model Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Algorithm
              </label>
              <select className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]">
                <option>Random Forest</option>
                <option>Neural Network</option>
                <option>Gradient Boosting</option>
              </select>
            </div>
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Number of Features
              </label>
              <input
                type="number"
                defaultValue="8"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Training Parameters */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Training Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                step="0.001"
                defaultValue="0.001"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Epochs
              </label>
              <input
                type="number"
                defaultValue="100"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
          </div>
        </div>

        {/* Data Processing */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Data Processing
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="normalize"
                defaultChecked
                className="mr-3"
              />
              <label htmlFor="normalize" className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72]">
                Normalize Data
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="balance"
                defaultChecked
                className="mr-3"
              />
              <label htmlFor="balance" className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72]">
                Balance Classes
              </label>
            </div>
          </div>
        </div>

        {/* Validation */}
        <div className="bg-[#f4f6f7] p-6 rounded-[8px]">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#0c1e33] mb-4">
            Validation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Validation Split
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                defaultValue="0.2"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
            <div>
              <label className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#495d72] block mb-2">
                Cross-Validation Folds
              </label>
              <input
                type="number"
                defaultValue="5"
                className="w-full bg-white border border-[#d0d0d0] rounded-[6px] px-4 py-2 font-['Poppins:Regular',sans-serif] text-[13px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="bg-[#0c1e33] text-white px-6 py-3 rounded-[6px] font-['Poppins:Medium',sans-serif] text-[13px] hover:bg-[#1a2f4a] transition-colors">
          Save Settings
        </button>
        <button className="bg-[#cb2740] text-white px-6 py-3 rounded-[6px] font-['Poppins:Medium',sans-serif] text-[13px] hover:bg-[#cb2740]/90 transition-colors">
          Train Model
        </button>
      </div>
    </div>
  );
}

interface AnalyticsDashboardProps {
  latestTrained?: MLPreset | null;
}

function AnalyticsDashboard({ latestTrained }: AnalyticsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"basic" | "mental" | "lifestyle" | "background" | "academic">("basic");
  const studentsPerPage = 5;
  
  // Load students from API
  const { students, isLoading: studentsLoading } = useStudents();
  const [performance, setPerformance] = useState<MLPerformance | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  
  // Load performance metrics when latestTrained changes
  useEffect(() => {
    if (latestTrained?.name) {
      setPerformanceLoading(true);
      mlService.getPerformance(latestTrained.name)
        .then(perf => {
          console.log('Performance metrics loaded:', perf);
          setPerformance(perf);
        })
        .catch(err => {
          console.error('Failed to load performance metrics:', err);
          setPerformance(null);
        })
        .finally(() => setPerformanceLoading(false));
    }
  }, [latestTrained?.name]);
  
  // Transform students to mental health records
  const mentalHealthRecords = useMemo(() => {
    return transformStudentsToMentalHealthRecords(students || []);
  }, [students]);
  
  // Calculate statistics from real data
  const totalStudents = students?.length || 0;
  const highRisk = mentalHealthRecords.filter((r: MentalHealthRecord) => r.riskLevel === "high").length;
  const moderateRisk = mentalHealthRecords.filter((r: MentalHealthRecord) => r.riskLevel === "moderate").length;
  const lowRisk = mentalHealthRecords.filter((r: MentalHealthRecord) => r.riskLevel === "low").length;
  
  const avgStress = totalStudents > 0 
    ? (mentalHealthRecords.reduce((sum: number, r: MentalHealthRecord) => sum + r.stressLevel, 0) / totalStudents).toFixed(1)
    : "0.0";
  const avgSleep = totalStudents > 0
    ? (mentalHealthRecords.reduce((sum: number, r: MentalHealthRecord) => sum + r.sleepHours, 0) / totalStudents).toFixed(1)
    : "0.0";

  // Student data for table - with all fields
  interface StudentDataRow {
    studentId: string;
    studentName: string;
    age: number;
    course: string;
    stressLevel: number;
    moodRating: number;
    sleepHours: number;
    counselingSessions: number;
    riskLevel: string;
    depressionScore: number;
    anxietyScore: number;
    sleepQuality: string;
    physicalActivity: string;
    dietQuality: string;
    socialSupport: number;
    substanceUse: string;
    familyHistory: string;
    chronicIllness: string;
    financialStress: number;
    semesterCreditLoad: number;
    lastCheckIn: string;
    notes: string;
    prediction: string;
  }

  const studentData: StudentDataRow[] = (students || []).map((student: Student) => {
    const mentalHealth = mentalHealthRecords.find((record: MentalHealthRecord) => record.id === student.id);
    
    return {
      studentId: student.id?.toString() || "N/A",
      studentName: student.name || "Unknown",
      age: mentalHealth?.age || student.age || 20,
      course: student.degree || "Unknown",
      stressLevel: mentalHealth?.stressLevel || 0,
      moodRating: mentalHealth?.moodRating || 3,
      sleepHours: mentalHealth?.sleepHours || 7,
      counselingSessions: mentalHealth?.counselingSessions || 0,
      riskLevel: mentalHealth?.riskLevel === "high" ? "High" : 
                 mentalHealth?.riskLevel === "moderate" ? "Medium" : "Low",
      depressionScore: mentalHealth?.depressionScore || 0,
      anxietyScore: mentalHealth?.anxietyScore || 0,
      sleepQuality: mentalHealth?.sleepQuality || "Good",
      physicalActivity: mentalHealth?.physicalActivity || "Moderate",
      dietQuality: mentalHealth?.dietQuality || "Good",
      socialSupport: mentalHealth?.socialSupport || 3,
      substanceUse: mentalHealth?.substanceUse || "Never",
      familyHistory: mentalHealth?.familyHistory || "No",
      chronicIllness: mentalHealth?.chronicIllness || "No",
      financialStress: mentalHealth?.financialStress || 2,
      semesterCreditLoad: mentalHealth?.semesterCreditLoad || 15,
      lastCheckIn: mentalHealth?.lastCheckIn || "N/A",
      notes: mentalHealth?.notes || "No notes available",
      prediction: mentalHealth?.riskLevel === "high" ? "Stress" : 
                  mentalHealth?.riskLevel === "moderate" ? "Anxiety" : "Normal",
    };
  });

  const filteredStudents = studentData.filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  // Show loading state
  if (studentsLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-['Poppins:Regular',sans-serif]">Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-blue-700" aria-hidden="true" />
            <div className="text-xs font-['Poppins:Medium',sans-serif] text-blue-700">Total Students</div>
          </div>
          <div className="text-3xl font-['Poppins:Bold',sans-serif] text-blue-900">{totalStudents}</div>
          <div className="text-xs text-blue-600 mt-1">Analyzed records</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border-2 border-red-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-700" aria-hidden="true" />
            <div className="text-xs font-['Poppins:Medium',sans-serif] text-red-700">High Risk</div>
          </div>
          <div className="text-3xl font-['Poppins:Bold',sans-serif] text-red-900">{highRisk}</div>
          <div className="text-xs text-red-600 mt-1">{totalStudents > 0 ? Math.round((highRisk / totalStudents) * 100) : 0}% of total</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-orange-700" aria-hidden="true" />
            <div className="text-xs font-['Poppins:Medium',sans-serif] text-orange-700">Moderate Risk</div>
          </div>
          <div className="text-3xl font-['Poppins:Bold',sans-serif] text-orange-900">{moderateRisk}</div>
          <div className="text-xs text-orange-600 mt-1">{totalStudents > 0 ? Math.round((moderateRisk / totalStudents) * 100) : 0}% of total</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-700" aria-hidden="true" />
            <div className="text-xs font-['Poppins:Medium',sans-serif] text-green-700">Low Risk</div>
          </div>
          <div className="text-3xl font-['Poppins:Bold',sans-serif] text-green-900">{lowRisk}</div>
          <div className="text-xs text-green-600 mt-1">{totalStudents > 0 ? Math.round((lowRisk / totalStudents) * 100) : 0}% of total</div>
        </div>
      </div>

      {/* Risk Distribution and Dataset Statistics Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-[8px] p-[24px] shadow-sm border border-gray-200">
        <div className="flex flex-col gap-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Risk Distribution</p>
          
          <div className="flex flex-col gap-[12px] mt-[8px]">
            {/* High Risk */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[100px] font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">High Risk</div>
              <div className="flex-1 h-[28px] bg-[#f4f6f7] rounded-[4px] overflow-hidden relative">
                <div className="h-full bg-[#eb5757] transition-all" style={{ width: `${(highRisk / totalStudents) * 100}%` }}></div>
              </div>
              <div className="w-[60px] text-right font-['Poppins:Bold',sans-serif] text-[#eb5757] text-[14px]">{highRisk} ({Math.round((highRisk / totalStudents) * 100)}%)</div>
            </div>

            {/* Moderate Risk */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[100px] font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">Moderate Risk</div>
              <div className="flex-1 h-[28px] bg-[#f4f6f7] rounded-[4px] overflow-hidden relative">
                <div className="h-full bg-[#f2994a] transition-all" style={{ width: `${(moderateRisk / totalStudents) * 100}%` }}></div>
              </div>
              <div className="w-[60px] text-right font-['Poppins:Bold',sans-serif] text-[#f2994a] text-[14px]">{moderateRisk} ({Math.round((moderateRisk / totalStudents) * 100)}%)</div>
            </div>

            {/* Low Risk */}
            <div className="flex items-center gap-[12px]">
              <div className="w-[100px] font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">Low Risk</div>
              <div className="flex-1 h-[28px] bg-[#f4f6f7] rounded-[4px] overflow-hidden relative">
                <div className="h-full bg-[#27ae60] transition-all" style={{ width: `${(lowRisk / totalStudents) * 100}%` }}></div>
              </div>
              <div className="w-[60px] text-right font-['Poppins:Bold',sans-serif] text-[#27ae60] text-[14px]">{lowRisk} ({Math.round((lowRisk / totalStudents) * 100)}%)</div>
            </div>
          </div>

          <div className="mt-[16px] pt-[16px] border-t border-[#e5e5e5]">
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px]">Total Students Analyzed: <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]">{totalStudents}</span></p>
          </div>
        </div>
      </div>

        {/* Dataset Statistics */}
        <div className="bg-white rounded-[8px] p-[24px] shadow-sm border border-gray-200">
        <div className="flex flex-col gap-[16px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Dataset Statistics</p>
          
          <div className="grid grid-cols-2 gap-[16px] mt-[8px]">
            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Avg Stress Level</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">{avgStress}/10</p>
            </div>
            
            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Avg Sleep Hours</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">{avgSleep}h</p>
            </div>

            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Features Used</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">8</p>
            </div>

            <div className="bg-[#f4f6f7] rounded-[8px] p-[16px]">
              <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[4px]">Model Version</p>
              <p className="font-['Poppins:Bold',sans-serif] text-[#0c1e33] text-[24px]">v2.1</p>
            </div>
          </div>

          <div className="mt-[8px] bg-[#e8f4fd] rounded-[8px] p-[12px] border border-[#4c85e9]/20">
            <p className="font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[11px]">
              <span className="font-['Poppins:Bold',sans-serif]">Last Training:</span> Nov 1, 2025 14:30
            </p>
            <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[10px] mt-[4px]">
              Training Time: 2.4 minutes • Samples: {totalStudents}
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Top Features */}
      <div className="bg-white rounded-[8px] p-[24px] mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-[12px]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Top Feature Importance</p>
          
          <div className="grid grid-cols-4 gap-[16px] mt-[8px]">
            {[
              { name: 'Sleep Hours', value: 0.28, color: '#4c85e9' },
              { name: 'Stress Level', value: 0.24, color: '#eb5757' },
              { name: 'Study Hours', value: 0.18, color: '#f2994a' },
              { name: 'Social Activity', value: 0.12, color: '#27ae60' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-[8px] p-[16px] flex flex-col">
                <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[11px] mb-[8px]">{feature.name}</p>
                <p className="font-['Poppins:Bold',sans-serif] text-[20px] mb-[8px]" style={{ color: feature.color }}>
                  {(feature.value * 100).toFixed(0)}%
                </p>
                <div className="w-full h-[6px] bg-[#e5e5e5] rounded-full overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${feature.value * 100}%`, backgroundColor: feature.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List Section */}
      <div className="bg-white rounded-[8px] p-[24px] shadow-sm border border-gray-200">
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="relative shrink-0 size-[20px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p2a321e00} fill="#0C1E33" />
                  <path d={svgPaths.p1e977b80} fill="#0C1E33" />
                </svg>
              </div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[16px]">Student Data Records</p>
              <span className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">({filteredStudents.length} students)</span>
            </div>
            
            {/* Search */}
            <div className="bg-[#f5f6f8] box-border content-stretch flex gap-[9.863px] h-[32px] items-center px-[13.151px] py-[4.932px] rounded-[4.932px] w-[300px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or ID..."
                className="flex-1 bg-transparent border-none outline-none text-[11.507px] font-['Poppins:Medium',sans-serif] text-[#495d72] placeholder:text-[rgba(73,93,114,0.6)]"
              />
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p246ea500} fill="#495D72" />
                  <path d={svgPaths.p3f321470} fill="#495D72" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 text-sm font-['Poppins:Medium',sans-serif] border-b-2 transition-colors ${
                activeTab === "basic"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              📋 Basic Info
            </button>
            <button
              onClick={() => setActiveTab("mental")}
              className={`px-4 py-2 text-sm font-['Poppins:Medium',sans-serif] border-b-2 transition-colors ${
                activeTab === "mental"
                  ? "border-purple-500 text-purple-600 bg-purple-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              🧠 Mental Health
            </button>
            <button
              onClick={() => setActiveTab("lifestyle")}
              className={`px-4 py-2 text-sm font-['Poppins:Medium',sans-serif] border-b-2 transition-colors ${
                activeTab === "lifestyle"
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              💪 Lifestyle
            </button>
            <button
              onClick={() => setActiveTab("background")}
              className={`px-4 py-2 text-sm font-['Poppins:Medium',sans-serif] border-b-2 transition-colors ${
                activeTab === "background"
                  ? "border-orange-500 text-orange-600 bg-orange-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              👨‍👩‍👧 Background
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`px-4 py-2 text-sm font-['Poppins:Medium',sans-serif] border-b-2 transition-colors ${
                activeTab === "academic"
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              📚 Academic
            </button>
          </div>

          {/* Table with Tab-based Content */}
          <div className="mt-[8px] overflow-x-auto rounded-[4px] border border-[#e5e5e5]">
            {activeTab === "basic" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student Name</th>
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student ID</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Age</th>
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Course</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                      <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                      <td className="py-[12px] px-[12px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.studentId}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.age}</td>
                      <td className="py-[12px] px-[12px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.course}</td>
                      <td className="py-[12px] px-[12px] text-center">
                        <span className={`font-['Poppins:Bold',sans-serif] text-[12px] px-[12px] py-[4px] rounded-full flex items-center gap-1 ${
                          student.riskLevel === "High" ? "bg-red-100 text-red-700 border border-red-300" :
                          student.riskLevel === "Medium" ? "bg-orange-100 text-orange-700 border border-orange-300" :
                          "bg-green-100 text-green-700 border border-green-300"
                        }`}>
                          {student.riskLevel === "High" ? (
                            <>
                              <AlertCircle className="w-3 h-3" aria-hidden="true" />
                              <span>High</span>
                            </>
                          ) : student.riskLevel === "Medium" ? (
                            <>
                              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                              <span>Moderate</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                              <span>Low</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Mental Health Tab */}
            {activeTab === "mental" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student Name</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Stress Level</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Depression</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Anxiety</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Mood Rating</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Sleep Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                      <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                      <td className="py-[12px] px-[12px] text-center">
                        <span className={`font-['Poppins:SemiBold',sans-serif] text-[12px] px-[10px] py-[3px] rounded-full ${
                          student.stressLevel >= 4 ? 'bg-red-100 text-red-700' :
                          student.stressLevel >= 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {student.stressLevel}/5
                        </span>
                      </td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.depressionScore}/5</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.anxietyScore}/5</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.moodRating}/5</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.sleepQuality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Lifestyle Tab */}
            {activeTab === "lifestyle" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student Name</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Sleep Hours</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Physical Activity</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Diet Quality</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Social Support</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Substance Use</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                      <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.sleepHours}h</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.physicalActivity}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.dietQuality}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.socialSupport}/5</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.substanceUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Background Tab */}
            {activeTab === "background" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student Name</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Family History</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Chronic Illness</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Financial Stress</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                      <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.familyHistory}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.chronicIllness}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.financialStress}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Academic Tab */}
            {activeTab === "academic" && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                    <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student Name</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Credit Load</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Counseling Sessions</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Last Check-In</th>
                    <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Prediction</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                      <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.semesterCreditLoad}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.counselingSessions}</td>
                      <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.lastCheckIn}</td>
                      <td className="py-[12px] px-[12px] text-center">
                        <span className="font-['Poppins:Medium',sans-serif] text-[12px] px-[12px] py-[4px] rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                          {student.prediction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#e5e5e5] bg-gradient-to-r from-gray-50/50 to-white px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-indigo-700" aria-hidden="true" />
              <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">
                Showing <span className="font-['Poppins:Bold',sans-serif] text-gray-900">{startIndex + 1}-{Math.min(startIndex + studentsPerPage, filteredStudents.length)}</span> of <span className="font-['Poppins:Bold',sans-serif] text-gray-900">{filteredStudents.length}</span> students
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 text-[11px] font-['Poppins:SemiBold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Previous</span>
              </button>
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-[11px] text-center font-['Poppins:Bold',sans-serif] min-w-[80px] shadow-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 text-[11px] font-['Poppins:SemiBold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-1.5"
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataScientistDashboard({ onLogout }: DataScientistDashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>("modelSettings");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState(dataScientistNotifications);
  const { hasPermission } = usePermissions();
  const [presets, setPresets] = useState<MLPreset[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [isCreatePresetOpen, setIsCreatePresetOpen] = useState(false);
  const [isEditConfigOpen, setIsEditConfigOpen] = useState(false);
  const [presetConfig, setPresetConfig] = useState<MLConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  type SavedConfig = {
    configName: string;
    trainTestRatio: number;
    hyperparameters: Record<string, any>;
    selectedFeatures: Record<string, boolean>;
  };
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [selectedConfigName, setSelectedConfigName] = useState<string | null>(null);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);
  const [performance, setPerformance] = useState<MLPerformance | null>(null);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [presetStates, setPresetStates] = useState<Record<string, MLPresetState>>({});
  function openConfigDialog() {
    if (!hasPermission("mlModels.manage")) {
      toast.error("You do not have permission to manage ML models.");
      return;
    }
    setIsConfigDialogOpen(true);
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  async function reloadPresets() {
    try {
      setIsLoadingPresets(true);
      const presetList = await mlService.listPresets();
      console.log('[DataScientistDashboard] Loaded presets:', presetList);
      setPresets(presetList);
    } catch (e: any) {
      console.error('[DataScientistDashboard] Failed to load presets:', e);
      // Silently handle errors - show toast only if it's not a 404/500 (expected when backend is not ready)
      const status = e?.response?.status;
      if (status && status !== 404 && status !== 500) {
        toast.error(e?.message ?? "Failed to load presets");
      }
      // Set empty array on error to prevent undefined issues
      setPresets([]);
    } finally {
      setIsLoadingPresets(false);
    }
  }

  useEffect(() => {
    if (hasPermission("mlModels.manage")) {
      reloadPresets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission]);

  // Auto-select first trained preset when presets load
  useEffect(() => {
    if (!Array.isArray(presets) || presets.length === 0) return;
    if (selectedPresetName) return; // Don't override user selection
    
    // Try to select first trained preset, otherwise select first preset
    const trained = presets.find(p => p.status === 'trained');
    setSelectedPresetName(trained?.name ?? presets[0].name);
  }, [presets, selectedPresetName]);
  useEffect(() => {
    try {
      const rawList = localStorage.getItem("ml:configs");
      const rawActive = localStorage.getItem("ml:activeConfig");
      if (rawList) {
        const arr = JSON.parse(rawList) as SavedConfig[];
        setConfigs(Array.isArray(arr) ? arr : []);
      }
      if (rawActive) {
        setSelectedConfigName(rawActive);
      }
    } catch {}
  }, []);

  const latestTrained = useMemo(() => {
    // Ensure presets is an array before calling .find()
    if (!Array.isArray(presets) || presets.length === 0) {
      return null;
    }
    return presets.find(p => p.status === "trained") ?? presets[0];
  }, [presets]);

  // Load performance metrics when a preset is selected
  useEffect(() => {
    if (!selectedPresetName) {
      setPerformance(null);
      return;
    }

    let mounted = true;

    const loadPerformance = async () => {
      setIsLoadingPerformance(true);
      try {
        const perf = await mlService.getPerformance(selectedPresetName);
        if (mounted) {
          setPerformance(perf);
        }
      } catch (error) {
        console.error('Failed to load performance:', error);
        if (mounted) {
          setPerformance(null);
          toast.error('Failed to load performance metrics');
        }
      } finally {
        if (mounted) {
          setIsLoadingPerformance(false);
        }
      }
    };

    loadPerformance();

    return () => {
      mounted = false;
    };
  }, [selectedPresetName]);

  // Poll training state for selected preset
  useEffect(() => {
    if (!selectedPresetName) return;

    let mounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    const pollState = async () => {
      try {
        const state = await mlService.getState(selectedPresetName);
        if (mounted) {
          setPresetStates(prev => ({
            ...prev,
            [selectedPresetName]: state
          }));

          // If training completed, reload performance and presets
          if (state.status === 'trained') {
            await reloadPresets();
            // Reload performance metrics
            try {
              const perf = await mlService.getPerformance(selectedPresetName);
              if (mounted) {
                setPerformance(perf);
              }
            } catch (error) {
              console.error('Failed to reload performance:', error);
            }
            // Stop polling
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll state:', error);
      }
    };

    // Initial poll
    pollState();

    // Set up polling interval (5 seconds)
    pollInterval = setInterval(pollState, 5000);

    return () => {
      mounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [selectedPresetName]);

  // Load preset configuration when selectedPresetName changes
  useEffect(() => {
    if (!selectedPresetName) {
      setPresetConfig(null);
      return;
    }

    const loadConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const config = await mlService.getConfig(selectedPresetName);
        setPresetConfig(config);
      } catch (error) {
        console.error('Failed to load preset config:', error);
        toast.error("Failed to load preset configuration");
        setPresetConfig(null);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadConfig();
  }, [selectedPresetName]);

  // Reload config after edit
  const reloadPresetConfig = async () => {
    if (!selectedPresetName) return;
    
    try {
      setIsLoadingConfig(true);
      const config = await mlService.getConfig(selectedPresetName);
      setPresetConfig(config);
      toast.success("Configuration reloaded");
    } catch (error) {
      console.error('Failed to reload preset config:', error);
      toast.error("Failed to reload configuration");
    } finally {
      setIsLoadingConfig(false);
    }
  };

  async function handleSaveConfig(config: {
    configName: string;
    trainTestRatio: number;
    hyperparameters: Record<string, any>;
    selectedFeatures: Record<string, boolean>;
  }) {
    // Save only, do NOT train here
    try {
      setConfigs(prev => {
        const idx = prev.findIndex(c => c.configName === config.configName);
        let next: SavedConfig[];
        if (idx >= 0) {
          next = prev.map((c, i) => (i === idx ? { ...config } : c));
        } else {
          next = [...prev, { ...config }];
        }
        localStorage.setItem("ml:configs", JSON.stringify(next));
        return next;
      });
      setSelectedConfigName(config.configName);
      localStorage.setItem("ml:activeConfig", config.configName);
    } catch {}
    toast.success("Configuration saved");
  }

  async function handleRetrain() {
    try {
      if (!selectedConfigName) {
        toast.error("Please select a configuration to retrain.");
        return;
      }
      const config = configs.find(c => c.configName === selectedConfigName);
      if (!config) {
        toast.error("Selected configuration not found. Please save again.");
        return;
      }
      let latestDataset;
      try {
        const dsList = await listDatasets({ page: 1, limit: 1, order: "desc", sortBy: "uploadedAt" });
        latestDataset = dsList.items?.[0];
      } catch (e: any) {
        // Handle API errors gracefully
        const status = e?.response?.status;
        if (status && status !== 404 && status !== 500) {
          toast.error(e?.message ?? "Failed to load datasets");
        }
        latestDataset = null;
      }
      if (!latestDataset) {
        toast.error("No dataset available. Please upload a dataset first.");
        return;
      }
      const features = Object.entries(config.selectedFeatures)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const created = await createModel({
        modelName: config.configName,
        modelType: "classification",
        algorithm: "RandomForest",
        features,
        targetVariable: "riskLevel",
        hyperparameters: config.hyperparameters
      } as any);
      const trained = await trainModel(created.id, {
        datasetId: latestDataset.id,
        trainTestSplit: config.trainTestRatio / 100,
        hyperparameters: config.hyperparameters,
        features,
        targetVariable: "riskLevel"
      });
      if (trained?.accuracy != null) {
        const acc = (trained.accuracy * 100).toFixed(1);
        const f1 = trained.f1Score != null ? (trained.f1Score * 100).toFixed(1) : null;
        toast.success(`Training completed: acc ${acc}%${f1 ? ` • f1 ${f1}%` : ""}`);
      } else {
        toast.success("Training started/completed");
      }
      await reloadModels();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to train model");
    }
  }

  async function handleDeployLatest() {
    try {
      if (!selectedPresetName) {
        toast.error("Please select a preset to deploy.");
        return;
      }
      
      // Check if preset is trained
      const selectedPreset = presets.find(p => p.name === selectedPresetName);
      if (!selectedPreset || selectedPreset.status !== 'trained') {
        toast.error("Only trained presets can be deployed.");
        return;
      }
      
      await mlService.deployPreset(selectedPresetName);
      toast.success(`Preset "${selectedPresetName}" deployed successfully!`);
      await reloadPresets();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to deploy preset");
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-white">
      <Sidebar onLogout={onLogout} currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Main content area with proper layout */}
      <div className="ml-[200px] min-h-screen bg-white" style={{ marginLeft: '200px' }}>
      
      {currentView === "modelSettings" ? (
        <div className="min-h-screen">
          {/* Top Bar with User Info */}
          <div className="bg-white border-b border-gray-100 px-8 py-3">
            <div className="flex items-center justify-end gap-4">
              <NotificationPanel 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismiss}
              />
              <div className="size-8">
                <img alt="User avatar" className="block size-full rounded-full" src={img} />
              </div>
            </div>
          </div>

          {/* MLflow-style Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-['Poppins:SemiBold',sans-serif] text-[#0c1e33]">
                    StudentRiskModel
                  </h1>
                  <span className="text-sm text-gray-500">
                    {latestTrained?.version || "v1.0"}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    latestTrained?.status === "deployed" 
                      ? "bg-green-100 text-green-800"
                      : latestTrained?.status === "trained"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {latestTrained?.status || "Not trained"}
                  </span>
                </div>
                {hasPermission("mlModels.manage") && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDeployLatest}
                      disabled={
                        isLoadingPresets || 
                        !selectedPresetName || 
                        presets.find(p => p.name === selectedPresetName)?.status !== 'trained'
                      }
                      className="px-5 py-2.5 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Deploy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content - Single scrollable page with static gradient background */}
          <div 
            className="px-8 py-6 space-y-8 pb-24 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          >
            
            {/* WORKFLOW STEP 1: Training Presets - Create/Select preset */}
            <section className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-['Poppins:Bold',sans-serif] text-gray-900">
                      Training Presets
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">{Array.isArray(presets) ? presets.length : 0} preset(s) configured</p>
                  </div>
                </div>
                {hasPermission("mlModels.manage") && (
                  <button
                    onClick={() => setIsCreatePresetOpen(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" aria-hidden="true" />
                    <span>Create New Preset</span>
                  </button>
                )}
              </div>
              <div className="bg-white border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">

              {Array.isArray(presets) && presets.length > 0 ? (
                <div className="space-y-4">
                  {presets.map((preset) => (
                    <PresetCard
                      key={preset.name}
                      preset={preset}
                      isSelected={selectedPresetName === preset.name}
                      presetState={presetStates[preset.name]}
                      onSelect={() => setSelectedPresetName(preset.name)}
                      onRetrain={async () => {
                        try {
                          await mlService.retrain(preset.name);
                          toast.success(`Training started for preset: ${preset.name}`);
                          setTimeout(reloadPresets, 1000);
                        } catch (e: any) {
                          toast.error(e?.message ?? "Failed to start training");
                        }
                      }}
                      onDelete={async () => {
                        if (!confirm(`Are you sure you want to delete preset "${preset.name}"?`)) return;
                        try {
                          await mlService.deletePreset(preset.name);
                          toast.success(`Preset "${preset.name}" deleted successfully`);
                          setSelectedPresetName(null);
                          reloadPresets();
                        } catch (e: any) {
                          toast.error(e?.message ?? "Failed to delete preset");
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-blue-500 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-gray-600 font-medium">No presets configured yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first preset to start training models</p>
                  {hasPermission("mlModels.manage") && (
                    <button
                      onClick={() => setIsCreatePresetOpen(true)}
                      className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                    >
                      <Bot className="w-4 h-4" aria-hidden="true" />
                      <span>Create Your First Preset</span>
                    </button>
                  )}
                </div>
              )}
              </div>
            </section>

            {/* WORKFLOW STEP 3: Preset Configuration - Review/Edit config */}
            {hasPermission("mlModels.manage") && selectedPresetName && (
              <section className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '100ms' }}>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Settings className="w-7 h-7 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900">Preset Configuration</h2>
                        <p className="text-sm text-gray-500 mt-1">Training parameters for <strong>{selectedPresetName}</strong></p>
                      </div>
                    </div>
                    {presetConfig && (
                      <button
                        onClick={() => setIsEditConfigOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <Settings className="w-5 h-5" />
                        Edit Configuration
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Configuration Container */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                  {presetConfig ? (
                    <div className="p-6 space-y-6">
                      {/* Hyperparameters Section */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <span className="text-2xl">⚙️</span>
                          </div>
                          <h3 className="text-xl font-black text-gray-800">Hyperparameters</h3>
                        </div>
                        
                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Test Size Card */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-xl">📊</span>
                              </div>
                              <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Test Size</h4>
                            </div>
                            <p className="text-4xl font-black text-blue-900">
                              {((presetConfig.test_size || 0.2) * 100).toFixed(0)}
                              <span className="text-2xl">%</span>
                            </p>
                          </div>

                          {/* N Estimators Card */}
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-xl">🌳</span>
                              </div>
                              <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide">N Estimators</h4>
                            </div>
                            <p className="text-4xl font-black text-purple-900">{presetConfig.n_estimators || 100}</p>
                          </div>

                          {/* Max Depth Card */}
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-xl">📏</span>
                              </div>
                              <h4 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Max Depth</h4>
                            </div>
                            <p className="text-4xl font-black text-orange-900">
                              {presetConfig.max_depth === null || presetConfig.max_depth === undefined 
                                ? "∞" 
                                : presetConfig.max_depth}
                            </p>
                          </div>

                          {/* Class Weight Card */}
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-xl">⚖️</span>
                              </div>
                              <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wide">Class Weight</h4>
                            </div>
                            <p className="text-2xl font-black text-purple-900">
                              {presetConfig.class_weight === "balanced" ? "⚖️ Balanced" : "📊 None"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Selected Features Section */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <span className="text-2xl">🎯</span>
                          </div>
                          <h3 className="text-xl font-black text-gray-800">
                            {presetConfig.features && presetConfig.features.length > 0 
                              ? `${presetConfig.features.length} Features` 
                              : "Selected Features"}
                          </h3>
                        </div>
                        
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200">
                          {presetConfig.features && presetConfig.features.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {presetConfig.features.map((feature: string, idx: number) => (
                                <span key={feature} className={`px-4 py-2 text-white text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                                  idx % 6 === 0 ? 'bg-blue-600' :
                                  idx % 6 === 1 ? 'bg-purple-600' :
                                  idx % 6 === 2 ? 'bg-green-600' :
                                  idx % 6 === 3 ? 'bg-orange-600' :
                                  idx % 6 === 4 ? 'bg-pink-600' :
                                  'bg-indigo-600'
                                }`}>
                                  {feature}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {["Gender", "Age", "Academic Pressure", "CGPA", "Study Satisfaction", 
                                "Sleep Duration", "Dietary Habits", "Work/Study Hours", "Financial Stress", 
                                "Family History of Mental Illness"].map((feature, idx) => (
                                <span key={feature} className={`px-4 py-2 text-white text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                                  idx % 6 === 0 ? 'bg-blue-600' :
                                  idx % 6 === 1 ? 'bg-purple-600' :
                                  idx % 6 === 2 ? 'bg-green-600' :
                                  idx % 6 === 3 ? 'bg-orange-600' :
                                  idx % 6 === 4 ? 'bg-pink-600' :
                                  'bg-indigo-600'
                                }`}>
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Info Message */}
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-purple-900">Editable Configuration</p>
                          <p className="text-xs text-purple-700 mt-1">
                            Click "Edit Configuration" above to modify training parameters. Changes will be saved to this preset.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
                      <p className="text-sm font-semibold">Loading configuration...</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* WORKFLOW STEP 4: Model Performance - View training results */}
            <section className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Model Performance</h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time accuracy metrics</p>
                  </div>
                </div>
              </div>
                
              {/* Modern Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Accuracy Card */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <Target className="w-6 h-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Accuracy</p>
                    <p className="text-6xl font-black text-blue-900 leading-none">
                      {isLoadingPerformance ? (
                        <span className="text-3xl animate-pulse">Loading...</span>
                      ) : performance?.accuracy ? (
                        `${(performance.accuracy * 100).toFixed(1)}`
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-2xl font-black text-blue-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: performance?.accuracy ? `${performance.accuracy * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold mt-2">Model Accuracy Rate</p>
                  </div>
                </div>

                {/* Precision Card */}
                <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <Check className="w-6 h-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Precision</p>
                    <p className="text-6xl font-black text-purple-900 leading-none">
                      {isLoadingPerformance ? (
                        <span className="text-3xl animate-pulse">Loading...</span>
                      ) : performance?.precision ? (
                        `${(performance.precision * 100).toFixed(1)}`
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-2xl font-black text-purple-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: performance?.precision ? `${performance.precision * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-purple-600 font-semibold mt-2">Positive Prediction Rate</p>
                  </div>
                </div>

                {/* Recall Card */}
                <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <Search className="w-6 h-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">Recall</p>
                    <p className="text-6xl font-black text-green-900 leading-none">
                      {isLoadingPerformance ? (
                        <span className="text-3xl animate-pulse">Loading...</span>
                      ) : performance?.recall ? (
                        `${(performance.recall * 100).toFixed(1)}`
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-2xl font-black text-green-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: performance?.recall ? `${performance.recall * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-600 font-semibold mt-2">Detection Success Rate</p>
                  </div>
                </div>

                {/* F1 Score Card */}
                <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <Scale className="w-6 h-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">F1 Score</p>
                    <p className="text-6xl font-black text-orange-900 leading-none">
                      {isLoadingPerformance ? (
                        <span className="text-3xl animate-pulse">Loading...</span>
                      ) : performance?.f1_score ? (
                        `${(performance.f1_score * 100).toFixed(1)}`
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-2xl font-black text-orange-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: performance?.f1_score ? `${performance.f1_score * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-orange-600 font-semibold mt-2">Balanced Performance</p>
                  </div>
                </div>
              </div>

              {/* Confusion Matrix & Feature Importance Grid */}
              {performance && !isLoadingPerformance && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Confusion Matrix */}
                  <div className="bg-white border-2 border-gray-400 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                      <h3 className="text-xl font-bold text-gray-900">Confusion Matrix</h3>
                    </div>
                    
                    {performance.confusion_matrix && performance.confusion_matrix.length === 2 ? (
                      <div className="space-y-4">
                        {/* Matrix Visualization */}
                        <div className="grid grid-cols-3 gap-2">
                          {/* Empty top-left cell */}
                          <div></div>
                          {/* Predicted Labels */}
                          <div className="text-center text-sm font-bold text-gray-700">Predicted Normal</div>
                          <div className="text-center text-sm font-bold text-gray-700">Predicted Depression</div>
                          
                          {/* Actual Normal row */}
                          <div className="text-right text-sm font-bold text-gray-700 flex items-center justify-end pr-2">
                            Actual Normal
                          </div>
                          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="text-3xl font-black text-green-700">
                              {performance.confusion_matrix[0][0]}
                            </div>
                            <div className="text-xs text-green-600 font-semibold mt-1">True Negative</div>
                          </div>
                          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="text-3xl font-black text-red-700">
                              {performance.confusion_matrix[0][1]}
                            </div>
                            <div className="text-xs text-red-600 font-semibold mt-1">False Positive</div>
                          </div>
                          
                          {/* Actual Depression row */}
                          <div className="text-right text-sm font-bold text-gray-700 flex items-center justify-end pr-2">
                            Actual Depression
                          </div>
                          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="text-3xl font-black text-red-700">
                              {performance.confusion_matrix[1][0]}
                            </div>
                            <div className="text-xs text-red-600 font-semibold mt-1">False Negative</div>
                          </div>
                          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="text-3xl font-black text-green-700">
                              {performance.confusion_matrix[1][1]}
                            </div>
                            <div className="text-xs text-green-600 font-semibold mt-1">True Positive</div>
                          </div>
                        </div>
                        
                        {/* Explanation */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <strong>True Negative:</strong> Correctly predicted as Normal | 
                            <strong className="ml-2">False Positive:</strong> Incorrectly predicted as Depression<br/>
                            <strong>False Negative:</strong> Missed Depression cases | 
                            <strong className="ml-2">True Positive:</strong> Correctly predicted as Depression
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
                        <p className="text-sm">No confusion matrix data available</p>
                      </div>
                    )}
                  </div>

                  {/* Feature Importance */}
                  <div className="bg-white border-2 border-gray-400 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-6 h-6 text-purple-600" aria-hidden="true" />
                      <h3 className="text-xl font-bold text-gray-900">Feature Importance</h3>
                    </div>
                    
                    {performance.feature_importance && Object.keys(performance.feature_importance).length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {Object.entries(performance.feature_importance)
                          .sort(([, a], [, b]) => b - a) // Sort by importance descending
                          .slice(0, 10) // Top 10 features
                          .map(([feature, importance], index) => {
                            const percentage = (importance * 100).toFixed(1);
                            const maxImportance = Math.max(...Object.values(performance.feature_importance));
                            const barWidth = (importance / maxImportance) * 100;
                            
                            return (
                              <div key={feature} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-semibold text-gray-700 truncate flex-1" title={feature}>
                                    {index + 1}. {feature}
                                  </span>
                                  <span className="text-purple-600 font-bold ml-2">{percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                                    style={{ width: `${barWidth}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
                        <p className="text-sm">No feature importance data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Training Info Panel */}
              {latestTrained && (
                <div className="mt-8 bg-white border-2 border-gray-400 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-5">
                    <Info className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    <h3 className="text-xl font-bold text-gray-900">Latest Model Information</h3>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-400 shadow-sm">
                      <div className="text-sm text-gray-900 font-bold mb-2 uppercase">Model Name</div>
                      <div className="font-bold text-gray-900 text-base truncate" title={latestTrained.modelName}>
                        {latestTrained.modelName}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-400 shadow-sm">
                      <div className="text-sm text-gray-900 font-bold mb-2 uppercase">Trained On</div>
                      <div className="font-bold text-gray-900 text-base">
                        {new Date(latestTrained.updatedAt || latestTrained.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-400 shadow-sm">
                      <div className="text-sm text-gray-900 font-bold mb-2 uppercase">Dataset</div>
                      <div className="font-bold text-gray-900 text-base">
                        {latestTrained.datasetName || 'Default Dataset'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-400 shadow-sm">
                      <div className="text-sm text-gray-900 font-bold mb-2 uppercase">Training Time</div>
                      <div className="font-bold text-gray-900 text-base">
                        {latestTrained.trainingTime ? `${(latestTrained.trainingTime / 1000).toFixed(1)}s` : '—'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-400 shadow-sm">
                      <div className="text-sm text-gray-900 font-bold mb-2 uppercase">Samples</div>
                      <div className="font-bold text-gray-900 text-base">
                        {latestTrained.sampleSize || extendedMockStudents.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* WORKFLOW STEP 5: Dataset Analysis - Detailed statistics */}
            {selectedPresetName && (
              <section className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '200ms' }}>
                <DatasetAnalysis presetName={selectedPresetName} />
              </section>
            )}

            {/* WORKFLOW STEP 6: Plots Gallery - Visual insights */}
            {selectedPresetName && (
              <section className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '250ms' }}>
                <PlotsGallery presetName={selectedPresetName} />
              </section>
            )}

          </div>
        </div>
      ) : currentView === "dashboard" ? (
        <div className="min-h-screen">
          {/* Top Bar with User Info */}
          <div className="bg-white border-b border-gray-100 px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
                <h1 className="text-xl font-['Poppins:SemiBold',sans-serif] text-slate-900">
                  Welcome, Data Scientist!
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <NotificationPanel 
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDismiss={handleDismiss}
                />
                <div className="size-8">
                  <img alt="User avatar" className="block size-full rounded-full" src={img} />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Content */}
          <div className="bg-gray-50 min-h-screen">
            <AnalyticsDashboard latestTrained={latestTrained} />
          </div>
        </div>
      ) : null}
      
      </div> {/* Close main content wrapper */}

      {/* Model Configuration Dialog */}
      <ModelConfigDialog 
        open={isConfigDialogOpen}
        onSave={handleSaveConfig}
        onOpenChange={setIsConfigDialogOpen}
      />
      
      {/* Create Preset Dialog */}
      <CreatePresetDialog
        open={isCreatePresetOpen}
        onOpenChange={setIsCreatePresetOpen}
        onPresetCreated={async (presetName) => {
          await reloadPresets();
          // Auto-select the newly created preset to trigger polling
          if (presetName) {
            setSelectedPresetName(presetName);
          }
        }}
      />

      {/* Edit Preset Config Dialog */}
      {selectedPresetName && presetConfig && (
        <EditPresetConfigDialog
          isOpen={isEditConfigOpen}
          onClose={() => setIsEditConfigOpen(false)}
          presetName={selectedPresetName}
          currentConfig={presetConfig}
          onConfigUpdated={reloadPresetConfig}
        />
      )}
    </div>
  );
}
