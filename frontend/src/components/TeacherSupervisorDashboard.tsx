import React, { useState, useEffect, useMemo } from "react";
import { MentalHealthRecord } from "../data/mockMentalHealth";
import { teacherNotifications } from "../data/mockNotificationsByRole";
import { NotificationPanel } from "./NotificationPanel";
import { useTableColumns } from "../hooks/useTableColumns";
import { useTableSort } from "../hooks/useTableSort";
import { ColumnSelector } from "./ColumnSelector";
import { StudentTableCard } from "./StudentTableCard";
import { SortIcon } from "./SortIcon";
import { Users, Search as SearchIcon } from "lucide-react";
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
  const { columns, visibleColumns, toggleColumn, resetColumns, showAllColumns, hideAllColumns } = useTableColumns();

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

  const itemsPerPage = 10;

  // Load students if no records were provided
  const { students, isLoading: isLoadingStudents } = useStudents({
    page: currentPage,
    limit: 50,
    search: searchQuery || undefined
  });
  const derivedRecords = transformStudentsToMentalHealthRecords(students || []);
  const allRecords = (mentalHealthRecords && mentalHealthRecords.length > 0) ? mentalHealthRecords : derivedRecords;
  
  // Filter records based on search query
  const filteredRecords = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    if (!query) return allRecords;
    
    return allRecords.filter(record =>
      record.studentName.toLowerCase().includes(query) ||
      record.course.toLowerCase().includes(query) ||
      record.riskLevel.toLowerCase().includes(query) ||
      record.notes?.toLowerCase().includes(query)
    );
  }, [allRecords, debouncedSearch]);

  // Sort filtered records
  const { sortedData: sortedRecords, sortConfig, handleSort } = useTableSort(filteredRecords);
  
  async function handleImportFile(file: File) {
    try {
      setIsImporting(true);
      const text = await file.text();
      // Simple CSV parse (comma separated, first line headers)
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        toast.error("File rỗng hoặc không đúng định dạng");
        return;
      }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const required = ["studentname","age","course"];
      const missing = required.filter(r => !headers.includes(r));
      if (missing.length) {
        toast.error(`Thiếu cột: ${missing.join(", ")}`);
        return;
      }
      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",");
        const obj: Record<string,string> = {};
        headers.forEach((h, i) => { obj[h] = (cells[i] ?? "").trim(); });
        return obj;
      });
      // POST to backend (adjust URL if needed)
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

  const getStressLevelColor = (level: number) => {
    if (level <= 1) return "bg-[#cbe6f0]";
    if (level === 2) return "bg-[#cbe6f0]";
    if (level === 3) return "bg-[#f4bd50]";
    if (level === 4) return "bg-[#ffaa9f]";
    return "bg-[#ed6a5e]";
  };

  const getRiskLevelColor = (level: string) => {
    if (level === "low") return "text-[#27ae60]";
    if (level === "moderate") return "text-[#f2994a]";
    return "text-[#eb5757]";
  };

  // Helper function to get cell value by column key
  const getCellValue = <K extends keyof MentalHealthRecord>(
    record: MentalHealthRecord,
    key: K
  ): MentalHealthRecord[K] | '' => {
    return record[key] ?? '';
  };

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <ColumnSelector
                columns={columns}
                onToggle={toggleColumn}
                onReset={resetColumns}
                onShowAll={showAllColumns}
                onHideAll={hideAllColumns}
              />
              
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
                  aria-label="Search students by name or course"
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
          {isLoadingStudents && filteredRecords.length === 0 && (
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

          {/* Empty State - Improved */}
          {!isLoadingStudents && filteredRecords.length === 0 && (
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
        {/* Responsive View: Card on mobile, Table on desktop */}
        {!isLoadingStudents && filteredRecords.length > 0 && (
          <>
            {/* Mobile Card View */}
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedRecords.map((record) => (
                  <StudentTableCard
                    key={record.id}
                    record={record}
                    onSelect={(r) => {
                      // Navigate to detail page or show modal
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Desktop Table View */
              <div className="overflow-x-auto rounded-[4px] border border-[#ced8e5] hidden md:block">
                <table 
                  className="w-full" 
                  style={{ minWidth: `${visibleColumns.length * 150}px` }}
                  role="table" 
                  aria-label="Student mental health records"
                >
                  <thead className="sticky top-0 z-10 bg-[#f4f6f7] shadow-sm">
                    <tr className="border-b border-[#ced8e5]">
                      {visibleColumns.map((col) => (
                        <th
                          key={col.key}
                          onClick={() => col.sortable && handleSort(col.key)}
                          className={`py-[12px] px-[12px] font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap ${
                            col.key === 'studentName' || col.key === 'course' || col.key === 'notes'
                              ? 'text-left'
                              : 'text-center'
                          } ${
                            col.sortable
                              ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors'
                              : ''
                          }`}
                          aria-sort={
                            sortConfig?.key === col.key
                              ? sortConfig.direction === 'asc'
                                ? 'ascending'
                                : 'descending'
                              : 'none'
                          }
                          aria-label={
                            col.sortable
                              ? `Sort by ${col.label}. Currently ${
                                  sortConfig?.key === col.key
                                    ? sortConfig.direction === 'asc'
                                      ? 'ascending'
                                      : 'descending'
                                    : 'not sorted'
                                }`
                              : col.label
                          }
                        >
                          <div className="flex items-center gap-1 justify-center">
                            <span>{col.label}</span>
                            {col.sortable && (
                              <SortIcon
                                direction={sortConfig?.key === col.key ? sortConfig.direction : null}
                                className="w-3 h-3 text-[#495d72]"
                              />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record, idx) => (
                      <tr
                        key={record.id}
                        className={`${idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"} hover:bg-blue-50/50 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1`}
                        tabIndex={0}
                        role="row"
                        aria-label={`Student ${record.studentName}, ${record.riskLevel} risk`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            // TODO: Navigate to student detail page
                            // Example: navigate(`/student/${record.id}`);
                          }
                        }}
                      >
                        {visibleColumns.map((col) => {
                          const value = getCellValue(record, col.key);
                          return (
                            <td
                              key={col.key}
                              className={`py-[10px] px-[12px] font-['Poppins:Regular',sans-serif] text-[11px] ${
                                col.key === 'studentName' || col.key === 'course' || col.key === 'notes'
                                  ? 'text-left'
                                  : 'text-center'
                              } ${
                                col.key === 'studentName'
                                  ? "font-['Poppins:Medium',sans-serif] text-[#0c1e33] whitespace-nowrap"
                                  : col.key === 'notes'
                                  ? 'text-[#495d72] max-w-[250px] truncate'
                                  : 'text-[#0c1e33]'
                              }`}
                              title={col.key === 'notes' ? String(value) : undefined}
                            >
                              {col.key === 'stressLevel' ? (
                                <span className={`${getStressLevelColor(Number(value))} px-[8px] py-[2px] rounded-[4px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[10px] inline-block`}>
                                  {value}/5
                                </span>
                              ) : col.key === 'riskLevel' ? (
                                <span className={`${getRiskLevelColor(String(value))} font-['Poppins:SemiBold',sans-serif] text-[11px] capitalize`}>
                                  {value}
                                </span>
                              ) : col.key === 'sleepHours' ? (
                                `${value}h`
                              ) : (
                                value
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination - Only show if there are records */}
            {paginatedRecords.length > 0 && (
              <nav aria-label="Pagination navigation" className="flex items-center justify-center gap-[8px] mt-[20px]">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label={`Go to previous page, currently on page ${currentPage}`}
                  aria-disabled={currentPage === 1}
                  className="relative shrink-0 size-[19.727px] disabled:opacity-50 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20" aria-hidden="true">
                    <path d={svgPaths.p23330400} stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.23292" />
                  </svg>
                </button>
                <div className="flex items-center gap-[4px] font-['Poppins:Medium',sans-serif] text-[10px]" aria-current="page">
                  <span className="text-[rgba(12,30,51,0.4)]">Page</span>
                  <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]">{currentPage}</span>
                  <span className="text-[rgba(12,30,51,0.4)]">of</span>
                  <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]">{totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  aria-label={`Go to next page, currently on page ${currentPage} of ${totalPages}`}
                  aria-disabled={currentPage === totalPages}
                  className="relative shrink-0 size-[19.727px] disabled:opacity-50 hover:opacity-70 transition-opacity rotate-180 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20" aria-hidden="true">
                    <path d={svgPaths.p24249800} stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.23292" />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}

        </div>
      </div>
    </div>
  );
}
