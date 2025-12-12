import React, { useState, useEffect, useMemo } from "react";
import { MentalHealthRecord } from "../data/mockMentalHealth";
import { teacherNotifications } from "../data/mockNotificationsByRole";
import { NotificationPanel } from "./NotificationPanel";
import { Users, Search as SearchIcon, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import svgPaths from "../imports/svg-ws6xw1un37";
import img from "figma:asset/b84a227f158a096d5fb31a5a5f2dd6c595e78767.png";
import { useAuth } from "../contexts/AuthContext";
import { usePermissions } from "../contexts/PermissionsContext";
import { useStudents } from "../hooks/useStudents";
import { transformStudentsToMentalHealthRecords } from "../utils/dataTransform";
import { toast } from "sonner";

interface TeacherSupervisorDashboardProps {
  mentalHealthRecords?: MentalHealthRecord[];
  onLogout: () => void;
}

function Welcome() {
  return (
    <div className="flex items-center gap-3 px-8 pt-6 text-slate-900 text-lg">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
      <p className="capitalize font-['Poppins:Regular',sans-serif]">Welcome, Mr. Nguyen!</p>
    </div>
  );
}

function Notification() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g id="notification">
        <path d={svgPaths.pddb2280} fill="var(--fill-0, #0C1E33)" id="Vector" />
        <path d={svgPaths.p628ea00} fill="var(--fill-0, #0C1E33)" id="Vector_2" />
      </g>
    </svg>
  );
}

interface HeaderProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

function Header({ notifications, onMarkAsRead, onDismiss }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center justify-end gap-6 h-[56px] px-8 border-b border-[rgba(206,216,229,0.97)]">
        <NotificationPanel 
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onDismiss={onDismiss}
        />
        <img alt="User avatar" className="h-[30px] w-[30px] rounded-full" height="30" src={img} width="30" />
      </div>
    </div>
  );
}

function WelcomeHelp() {
  return (
    <div className="px-8 mt-4">
      <div className="bg-[#f4f6f7] rounded-[6px] p-6">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-[19.727px] mb-2">
          Hope you have a good day!
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[13.151px]">
          We are here to support you. <span className="font-['Poppins:ExtraBold',sans-serif]">Learn more</span> to explore tips to understand and manage your students better!
        </p>
        <button className="mt-4 bg-[#0c1e33] text-white px-[13.151px] py-[9.863px] rounded-[4px] hover:bg-[#0c1e33]/90 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
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
          Supervisor Space
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Dashboard Button */}
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs font-['Poppins:Medium',sans-serif] transition-all bg-purple-500/20 font-semibold border-l-2 border-purple-400"
          aria-label="Navigate to Dashboard"
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
      </nav>

      {/* Bottom Section */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/20 pt-4">
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs font-['Poppins:Medium',sans-serif] hover:bg-red-500/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Logout from Supervisor Space"
        >
          <div className="shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p37611800} fill="white" />
              <path d={svgPaths.p28a1ad00} fill="white" />
            </svg>
          </div>
          <span>Logout</span>
        </button>

        {/* Help Button */}
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs font-['Poppins:Medium',sans-serif] hover:bg-white/5 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Get help"
        >
          <div className="shrink-0 size-4">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21">
              <path d={svgPaths.p1d4468f0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <span>Help</span>
        </button>
      </div>
    </div>
  );
}

export function TeacherSupervisorDashboard({ mentalHealthRecords = [], onLogout }: TeacherSupervisorDashboardProps) {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [notifications, setNotifications] = useState(teacherNotifications);
  const [isImporting, setIsImporting] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [activeTab, setActiveTab] = useState<"basic" | "mental" | "lifestyle" | "background" | "academic" | "other">("basic");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Detect screen size for responsive view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("card");
      } else {
        setViewMode("table");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const studentsPerPage = 10;

  // Load students if no records were provided
  // Fix: Increase limit to fetch all students (was 50, now 100)
  const { students, isLoading: isLoadingStudents } = useStudents({
    page: currentPage,
    limit: 100,
    search: searchQuery || undefined
  });
  const derivedRecords = transformStudentsToMentalHealthRecords(students || []);
  const allRecords = (mentalHealthRecords && mentalHealthRecords.length > 0) ? mentalHealthRecords : derivedRecords;
  
  async function handleImportFile(file: File) {
    try {
      setIsImporting(true);
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        toast.error("File rỗng hoặc không đúng định dạng");
        return;
      }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const required = ["studentname","age"];
      // Accept either 'degree' or 'course' column
      const hasDegreeOrCourse = headers.includes("degree") || headers.includes("course");
      const missing = required.filter(r => !headers.includes(r));
      if (missing.length || !hasDegreeOrCourse) {
        const allMissing = [...missing, ...(!hasDegreeOrCourse ? ["degree or course"] : [])];
        toast.error(`Thiếu cột: ${allMissing.join(", ")}`);
        return;
      }
      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",");
        const obj: Record<string,string> = {};
        headers.forEach((h, i) => { obj[h] = (cells[i] ?? "").trim(); });
        return obj;
      });
      const res = await fetch("/api/students/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: rows })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Import thành công");
    } catch (err:any) {
      toast.error("Import thất bại" + (err?.message ? `: ${err.message}` : ""));
    } finally {
      setIsImporting(false);
    }
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Transform to extended student format for tab display
  const extendedStudents = allRecords.map(record => {
    // Fix: Match by removing "-health" suffix, same as ConsultantDashboard
    const recordIdWithoutSuffix = record.id.toString().replace('-health', '');
    const actualStudent = (students || []).find(s => 
      s.id?.toString() === recordIdWithoutSuffix || 
      s.studentId === record.id ||
      s.id?.toString() === record.id
    );
    
    return {
      studentName: record.studentName,
      studentId: record.id.toString().replace('-health', ''),
      age: record.age,
      course: record.degree || record.course, // Prefer 'degree' from dataset, fallback to 'course'
      riskLevel: record.riskLevel === "has-depression" ? "Has Depression" : "No Depression",
      stressLevel: record.stressLevel,
      depressionScore: Math.floor(Math.random() * 5) + 1,
      anxietyScore: Math.floor(Math.random() * 5) + 1,
      moodRating: Math.floor(Math.random() * 5) + 1,
      sleepQuality: record.sleepQuality || "Good",
      sleepHours: record.sleepHours || 7,
      physicalActivity: record.physicalActivity || "Moderate",
      dietQuality: "Balanced",
      familyHistory: record.familyHistory || "No",
      financialStress: record.financialStress || 0,
      cgpa: record.cgpa || actualStudent?.cgpa,
      workStudyHours: record.workStudyHours || actualStudent?.work_study_hours,
      city: record.city || actualStudent?.city,
      workPressure: record.workPressure || actualStudent?.work_pressure,
      jobSatisfaction: record.jobSatisfaction || actualStudent?.job_satisfaction,
      prediction: record.prediction || (record.riskLevel === "has-depression" ? "Has Depression" : "No Depression"),
      validated: actualStudent?.validated || false
    };
  });

  const filteredStudents = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    if (!query) return extendedStudents;
    return extendedStudents.filter(student =>
      student.studentName.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query)
    );
  }, [extendedStudents, debouncedSearch]);

  // Fix: Remove double pagination - API already handles pagination
  const paginatedStudents = filteredStudents;
  const totalPages = 1; // Backend handles pagination

  return (
    <div className="min-h-screen bg-white">
      <Sidebar onLogout={onLogout}>
      </Sidebar>
      
      <div className="ml-[200px] min-h-screen pb-[100px]">
        <Header 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDismiss={handleDismiss}
        />
        <Welcome />
        <WelcomeHelp />

        {/* Students Tracker Table - Scrollable Version */}
        <div className="px-8 mt-6">
          {/* Title and Controls */}
          <div className="flex items-center justify-between mb-[24px]">
            <div className="flex items-center gap-[9.863px]">
              <div className="relative shrink-0 size-[19.727px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p2a321e00} fill="#0C1E33" />
                  <path d={svgPaths.p1e977b80} fill="#0C1E33" />
                </svg>
              </div>
              <div className="flex flex-col font-['Poppins:Medium',sans-serif] justify-center text-[#0c1e33] text-[13.151px]">
                <p>Students Tracker - Complete Data</p>
              </div>
            </div>

            <div className="flex items-center gap-[16px] flex-wrap">
              {hasPermission("students.import") && (
                <>
                  <input
                    id="import-csv-input"
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    aria-label="Import CSV file with student data"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportFile(file);
                      e.currentTarget.value = "";
                    }}
                  />
                  <button
                    disabled={isImporting}
                    onClick={() => document.getElementById("import-csv-input")?.click()}
                    aria-label={isImporting ? "Importing CSV file" : "Import CSV file with student data"}
                    className="font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[11.507px] bg-[#e9ebef] hover:bg-[#e1e3e8] transition-colors px-[12px] py-[8px] rounded-[4px] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isImporting ? "Đang import..." : "Import CSV"}
                  </button>
                </>
              )}
              {hasPermission("students.export") && (
              <button 
                aria-label="Export student data to file"
                className="font-['Poppins:Medium',sans-serif] text-[#2f80ed] text-[11.507px] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                Export Data
              </button>
              )}
              
              <div className="bg-[#f5f6f8] flex gap-[9.863px] items-center px-[13.151px] py-[6px] rounded-[4.932px] w-[300px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search......"
                  aria-label="Search students by name or degree"
                  className="flex-1 bg-transparent border-none text-[11.507px] font-['Poppins:Medium',sans-serif] text-[#495d72] placeholder:text-[rgba(73,93,114,0.6)] focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                />
                <div className="relative shrink-0 size-[16px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path d={svgPaths.p246ea500} fill="#495D72" />
                    <path d={svgPaths.p3f321470} fill="#495D72" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State - Skeleton Loaders */}
          {isLoadingStudents && filteredStudents.length === 0 && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-[#ced8e5] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoadingStudents && filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              {searchQuery ? (
                <SearchIcon className="w-16 h-16 text-gray-400" aria-hidden="true" />
              ) : (
                <Users className="w-16 h-16 text-gray-400" aria-hidden="true" />
              )}
              <div className="text-center">
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-lg mb-2">
                  {searchQuery ? 'No students match your search' : 'No students found'}
                </h3>
                <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-sm mb-4 max-w-md">
                  {searchQuery
                    ? 'Try adjusting your search terms or filters'
                    : allRecords.length === 0
                    ? 'No students in database. Please run seed or create students.'
                    : 'No students with health records found.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search and show all students"
                    className="px-4 py-2 bg-[#0c1e33] text-white rounded-lg hover:bg-[#0c1e33]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Student Data Table with Tabs */}
          {!isLoadingStudents && filteredStudents.length > 0 && (
            <div className="bg-white rounded-[8px] p-[16px] shadow-sm border border-gray-200">
              {/* Search Summary */}
              <div className="flex items-center justify-between mb-4">
                <p className="font-['Poppins:Medium',sans-serif] text-[#495d72] text-[12px]">
                  Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                  {debouncedSearch && <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]"> matching "{debouncedSearch}"</span>}
                </p>
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
                <button
                  onClick={() => setActiveTab("other")}
                  className={`px-4 py-2 text-sm font-['Poppins:Medium',sans-serif] border-b-2 transition-colors ${
                    activeTab === "other"
                      ? "border-purple-500 text-purple-600 bg-purple-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  📊 Other
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
                        <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Degree</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Risk Level</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Prediction</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Validated</th>
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
                            <span className={`font-['Poppins:Bold',sans-serif] text-[13px] px-[14px] py-[5px] rounded-full inline-flex items-center gap-1 ${
                              student.riskLevel === "Has Depression" ? "bg-red-100 text-red-700 border-2 border-red-400" :
                              "bg-green-100 text-green-700 border-2 border-green-400"
                            }`}>
                              {student.riskLevel === "Has Depression" ? "⚠️" : "✅"} {student.riskLevel}
                            </span>
                          </td>
                          <td className="py-[12px] px-[12px] text-center">
                            <span className={`font-['Poppins:Bold',sans-serif] text-[13px] px-[14px] py-[5px] rounded-full inline-flex items-center gap-1 ${
                              student.prediction === 'Has Depression' 
                                ? "bg-red-100 text-red-700 border-2 border-red-400" 
                                : student.prediction === 'No Depression'
                                ? "bg-green-100 text-green-700 border-2 border-green-400"
                                : "bg-gray-100 text-gray-600 border-2 border-gray-300"
                            }`}>
                              {student.prediction === 'Has Depression' && "⚠️"}
                              {student.prediction === 'No Depression' && "✅"}
                              {student.prediction || 'N/A'}
                            </span>
                          </td>
                          <td className="py-[12px] px-[12px] text-center">
                            {student.validated ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-['Poppins:Medium',sans-serif] text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                Validated
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-['Poppins:Regular',sans-serif] text-[11px]">
                                Pending
                              </span>
                            )}
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
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Academic Pressure</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Study Satisfaction</th>
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
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.sleepHours}</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.physicalActivity}</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.dietQuality}</td>
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
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Financial Stress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((student, idx) => (
                        <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                          <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.familyHistory}</td>
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
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">CGPA</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Work/Study Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((student, idx) => (
                        <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                          <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.cgpa?.toFixed(2) || 'N/A'}</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.workStudyHours != null ? `${student.workStudyHours}h/day` : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Other Tab */}
                {activeTab === "other" && (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e5e5e5] bg-[#f9fafb]">
                        <th className="text-left py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Student Name</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Work Pressure</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">Job Satisfaction</th>
                        <th className="text-center py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[12px]">City</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map((student, idx) => (
                        <tr key={student.studentId} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                          <td className="py-[12px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[13px]">{student.studentName}</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.workPressure || 0}/5</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[12px]">{student.jobSatisfaction || 0}/5</td>
                          <td className="py-[12px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[12px]">{student.city || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#e5e5e5]">
                <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">
                  Showing <span className="font-['Poppins:Bold',sans-serif]">{filteredStudents.length}</span> students {currentPage > 1 ? `(page ${currentPage})` : ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 text-[11px] font-['Poppins:Medium',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-blue-500 text-white rounded text-[11px] font-['Poppins:Bold',sans-serif]">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 text-[11px] font-['Poppins:Medium',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
