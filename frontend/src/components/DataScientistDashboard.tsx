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
import { dataScientistNotifications } from "../data/mockNotificationsByRole";
import { DatasetManagement } from "./DatasetManagementSection";
import { listModels, createModel, trainModel, deployModel, type MLModel } from "../services/mlModels";
import { listDatasets } from "../services/datasets";
import { toast } from "sonner";
import { Users, AlertCircle, AlertTriangle, CheckCircle2, BarChart3, Target, Check, Search, Scale, Info, TrendingUp, Bot, Eye, Download, Trash2, Clock, FileText } from "lucide-react";

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
  latestTrained?: MLModel | null;
}

function AnalyticsDashboard({ latestTrained }: AnalyticsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"basic" | "mental" | "lifestyle" | "background" | "academic">("basic");
  const studentsPerPage = 5;
  
  // Calculate statistics from mock data
  const totalStudents = extendedMockStudents.length;
  const highRisk = mockMentalHealthRecords.filter(r => r.riskLevel === "high").length;
  const moderateRisk = mockMentalHealthRecords.filter(r => r.riskLevel === "moderate").length;
  const lowRisk = mockMentalHealthRecords.filter(r => r.riskLevel === "low").length;
  
  const avgStress = (mockMentalHealthRecords.reduce((sum, r) => sum + r.stressLevel, 0) / totalStudents).toFixed(1);
  const avgSleep = (mockMentalHealthRecords.reduce((sum, r) => sum + r.sleepHours, 0) / totalStudents).toFixed(1);

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

  const studentData: StudentDataRow[] = extendedMockStudents.map((student) => {
    const mentalHealth = mockMentalHealthRecords.find((record) => record.id === student.id);
    
    return {
      studentId: student.studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      age: mentalHealth?.age || 20,
      course: student.major,
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
          <div className="text-xs text-red-600 mt-1">{Math.round((highRisk / totalStudents) * 100)}% of total</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-orange-700" aria-hidden="true" />
            <div className="text-xs font-['Poppins:Medium',sans-serif] text-orange-700">Moderate Risk</div>
          </div>
          <div className="text-3xl font-['Poppins:Bold',sans-serif] text-orange-900">{moderateRisk}</div>
          <div className="text-xs text-orange-600 mt-1">{Math.round((moderateRisk / totalStudents) * 100)}% of total</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-700" aria-hidden="true" />
            <div className="text-xs font-['Poppins:Medium',sans-serif] text-green-700">Low Risk</div>
          </div>
          <div className="text-3xl font-['Poppins:Bold',sans-serif] text-green-900">{lowRisk}</div>
          <div className="text-xs text-green-600 mt-1">{Math.round((lowRisk / totalStudents) * 100)}% of total</div>
        </div>
      </div>

      {/* Model Performance Metrics - COMPLETELY REDESIGNED */}
      <div className="mb-8">
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
                {latestTrained?.accuracy ? `${(latestTrained.accuracy * 100).toFixed(1)}` : "94.2"}
              </p>
              <p className="text-2xl font-black text-blue-700 mt-1">%</p>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: latestTrained?.accuracy ? `${latestTrained.accuracy * 100}%` : '94.2%' }}
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
                {latestTrained?.precision ? `${(latestTrained.precision * 100).toFixed(1)}` : "91.8"}
              </p>
              <p className="text-2xl font-black text-purple-700 mt-1">%</p>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: latestTrained?.precision ? `${latestTrained.precision * 100}%` : '91.8%' }}
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
                {latestTrained?.recall ? `${(latestTrained.recall * 100).toFixed(1)}` : "89.5"}
              </p>
              <p className="text-2xl font-black text-green-700 mt-1">%</p>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: latestTrained?.recall ? `${latestTrained.recall * 100}%` : '89.5%' }}
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
                {latestTrained?.f1Score ? `${(latestTrained.f1Score * 100).toFixed(1)}` : "90.6"}
              </p>
              <p className="text-2xl font-black text-orange-700 mt-1">%</p>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: latestTrained?.f1Score ? `${latestTrained.f1Score * 100}%` : '90.6%' }}
                ></div>
              </div>
              <p className="text-xs text-orange-600 font-semibold mt-2">Balanced Performance</p>
            </div>
          </div>
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
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  type SavedConfig = {
    configName: string;
    trainTestRatio: number;
    hyperparameters: Record<string, any>;
    selectedFeatures: Record<string, boolean>;
  };
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [selectedConfigName, setSelectedConfigName] = useState<string | null>(null);
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

  async function reloadModels() {
    try {
      setIsLoadingModels(true);
      const res = await listModels({ page: 1, limit: 20, order: "desc", sortBy: "updatedAt" });
      setModels(res.items ?? []);
    } catch (e: any) {
      // Silently handle errors - show toast only if it's not a 404/500 (expected when backend is not ready)
      const status = e?.response?.status;
      if (status && status !== 404 && status !== 500) {
        toast.error(e?.message ?? "Failed to load models");
      }
      // Set empty array on error to prevent undefined issues
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  }

  useEffect(() => {
    if (hasPermission("mlModels.manage")) {
      reloadModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission]);
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
    return models.find(m => m.status === "deployed" || m.status === "trained") ?? models[0];
  }, [models]);

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
      const candidate = latestTrained;
      if (!candidate) {
        toast.error("No model available to deploy.");
        return;
      }
      await deployModel(candidate.id);
      toast.success("Model deployed");
      await reloadModels();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to deploy model");
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
                      onClick={handleRetrain}
                      disabled={!selectedConfigName}
                      className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      🔄 Re-Train
                    </button>
                    <button
                      onClick={handleDeployLatest}
                      disabled={isLoadingModels || !latestTrained}
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
            
            {/* Model Overview Section - COMPLETELY REDESIGNED */}
            <section className="mb-8">
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
                      {latestTrained?.accuracy ? `${(latestTrained.accuracy * 100).toFixed(1)}` : "—"}
                    </p>
                    <p className="text-2xl font-black text-blue-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: latestTrained?.accuracy ? `${latestTrained.accuracy * 100}%` : '0%' }}
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
                      {latestTrained?.precision ? `${(latestTrained.precision * 100).toFixed(1)}` : "—"}
                    </p>
                    <p className="text-2xl font-black text-purple-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: latestTrained?.precision ? `${latestTrained.precision * 100}%` : '0%' }}
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
                      {latestTrained?.recall ? `${(latestTrained.recall * 100).toFixed(1)}` : "—"}
                    </p>
                    <p className="text-2xl font-black text-green-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: latestTrained?.recall ? `${latestTrained.recall * 100}%` : '0%' }}
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
                      {latestTrained?.f1Score ? `${(latestTrained.f1Score * 100).toFixed(1)}` : "—"}
                    </p>
                    <p className="text-2xl font-black text-orange-700 mt-1">%</p>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: latestTrained?.f1Score ? `${latestTrained.f1Score * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-orange-600 font-semibold mt-2">Balanced Performance</p>
                  </div>
                </div>
              </div>

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
                        {latestTrained.sampleSize || mockStudents.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Configuration Section - COMPLETELY REDESIGNED */}
            {hasPermission("mlModels.manage") && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">Model Configuration</h2>
                      <p className="text-sm text-gray-500 mt-1">Customize training parameters</p>
                    </div>
                  </div>
                </div>
                
                {/* Configuration Container */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                  {/* Top Bar - Config Selector */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Active Configuration</label>
                        <select
                          value={selectedConfigName ?? ""}
                          onChange={(e) => {
                            const val = e.target.value || null;
                            setSelectedConfigName(val);
                            if (val) localStorage.setItem("ml:activeConfig", val);
                          }}
                          className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-all"
                        >
                          <option value="">Select a configuration...</option>
                          {configs.map(c => (
                            <option key={c.configName} value={c.configName} className="font-semibold">{c.configName}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={openConfigDialog}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Create / Edit</span>
                      </button>
                    </div>
                  </div>
                  
                  {selectedConfigName && (() => {
                    const cfg = configs.find(c => c.configName === selectedConfigName);
                    if (!cfg) return null;
                    return (
                      <div className="p-6 space-y-6">
                        {/* Hyperparameters Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                              <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Hyperparameters</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Train/Test Split */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Train/Test Split</p>
                              <p className="text-4xl font-black text-blue-900">{cfg.trainTestRatio}<span className="text-2xl">%</span></p>
                            </div>
                            
                            {/* Other Hyperparameters */}
                            {Object.entries(cfg.hyperparameters || {}).map(([key, value], idx) => (
                              <div key={key} className={`rounded-xl p-5 border-2 ${
                                idx % 4 === 0 ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' :
                                idx % 4 === 1 ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
                                idx % 4 === 2 ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' :
                                'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200'
                              }`}>
                                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                                  idx % 4 === 0 ? 'text-purple-600' :
                                  idx % 4 === 1 ? 'text-green-600' :
                                  idx % 4 === 2 ? 'text-orange-600' :
                                  'text-pink-600'
                                }`}>{key.replace(/([A-Z])/g, ' $1')}</p>
                                <p className={`text-4xl font-black ${
                                  idx % 4 === 0 ? 'text-purple-900' :
                                  idx % 4 === 1 ? 'text-green-900' :
                                  idx % 4 === 2 ? 'text-orange-900' :
                                  'text-pink-900'
                                }`}>{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Selected Features Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                              <Target className="w-5 h-5 text-indigo-600" aria-hidden="true" />
                            </div>
                              <h3 className="text-2xl font-black text-gray-900">Selected Features</h3>
                            </div>
                            <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full">
                              {Object.values(cfg.selectedFeatures || {}).filter(Boolean).length} Features
                            </span>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(cfg.selectedFeatures || {})
                                .filter(([, v]) => v)
                                .map(([key], idx) => (
                                  <span key={key} className={`px-4 py-2 text-white text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                                    idx % 6 === 0 ? 'bg-blue-600' :
                                    idx % 6 === 1 ? 'bg-purple-600' :
                                    idx % 6 === 2 ? 'bg-green-600' :
                                    idx % 6 === 3 ? 'bg-orange-600' :
                                    idx % 6 === 4 ? 'bg-pink-600' :
                                    'bg-indigo-600'
                                  }`}>
                                    {key}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>
            )}

            {/* Datasets & Artifacts Section */}
            {hasPermission("datasets.manage") && (
              <div className="mb-6">
                <DatasetManagement />
              </div>
            )}

            {/* Training History Section */}
            <section className="animate-in fade-in duration-700" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-['Poppins:Bold',sans-serif] text-gray-900">
                    Training History
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">{models.length} model(s) trained</p>
                </div>
              </div>
              <div className="bg-white border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">

              {models.length > 0 ? (
                <div className="space-y-4">
                  {models.slice(0, 5).map((model) => (
                    <div key={model.id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Bot className="w-5 h-5 text-gray-600" aria-hidden="true" />
                            <h3 className="font-bold text-gray-900 text-base">{model.modelName}</h3>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              model.status === 'deployed' ? 'bg-green-100 text-green-700 border border-green-300' :
                              model.status === 'trained' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                              model.status === 'training' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                              'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                model.status === 'deployed' ? 'bg-green-500 animate-pulse' :
                                model.status === 'trained' ? 'bg-blue-500' :
                                model.status === 'training' ? 'bg-yellow-500 animate-pulse' :
                                'bg-red-500'
                              }`}></span>
                              {model.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-3 text-sm">
                            {model.accuracy && (
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-3 h-3 text-gray-500" aria-hidden="true" />
                                <span className="text-gray-500 text-xs">Accuracy:</span>
                                <span className="font-bold text-blue-600">{(model.accuracy * 100).toFixed(1)}%</span>
                              </div>
                            )}
                            {model.precision && (
                              <div className="flex items-center gap-2">
                                <Target className="w-3 h-3 text-gray-500" aria-hidden="true" />
                                <span className="text-gray-500 text-xs">Precision:</span>
                                <span className="font-bold text-purple-600">{(model.precision * 100).toFixed(1)}%</span>
                              </div>
                            )}
                            {model.recall && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs">🔄 Recall:</span>
                                <span className="font-bold text-green-600">{(model.recall * 100).toFixed(1)}%</span>
                              </div>
                            )}
                            {model.f1Score && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-xs">⚡ F1:</span>
                                <span className="font-bold text-orange-600">{(model.f1Score * 100).toFixed(1)}%</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span>Trained: {new Date(model.updatedAt || model.createdAt).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button 
                            aria-label={`View details for model ${model.modelName}`}
                            className="px-4 py-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <Eye className="w-3 h-3" aria-hidden="true" />
                            <span>View</span>
                          </button>
                          {model.status === 'deployed' && (
                            <button 
                              aria-label={`Download model ${model.modelName}`}
                              className="px-4 py-2 text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              <Download className="w-3 h-3" aria-hidden="true" />
                              <span>Download</span>
                            </button>
                          )}
                          <button 
                            aria-label={`Delete model ${model.modelName}`}
                            className="px-4 py-2 text-xs border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            <Trash2 className="w-3 h-3" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-blue-500 mx-auto mb-3" aria-hidden="true" />
                  <p className="text-gray-600 font-medium">No training history yet</p>
                  <p className="text-sm text-gray-500 mt-2">Train your first model to see results here</p>
                </div>
              )}
              </div>
            </section>

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
    </div>
  );
}
