import { useState } from "react";
import { MentalHealthRecord } from "../data/mockMentalHealth";
import { consultantNotifications } from "../data/mockNotificationsByRole";
import { NotificationPanel } from "./NotificationPanel";
import { useStudents } from "../hooks/useStudents";
import { transformStudentsToMentalHealthRecords } from "../utils/dataTransform";
import { useAuth } from "../contexts/AuthContext";
import svgPaths from "../imports/svg-695504e5jy";
import img from "figma:asset/b84a227f158a096d5fb31a5a5f2dd6c595e78767.png";
import { imgGroup } from "../imports/svg-tct91";

interface ConsultantDashboardProps {
  onLogout: () => void;
}

function Welcome({ userName }: { userName?: string }) {
  return (
    <div className="flex items-center gap-3 px-8 pt-6 text-[#0c1e33] text-[19.727px]">
      <span className="font-['Rubik:Bold',sans-serif]">👋</span>
      <p className="capitalize font-['Poppins:Regular',sans-serif]">Welcome, {userName || 'User'}!</p>
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
    <div className="fixed h-full left-0 top-0 w-[275.351px] bg-[#0c1e33] z-50">
      {/* Logo */}
      <div className="absolute box-border content-stretch flex gap-[4.932px] inset-[5%_8.96%_92.35%_17.91%] items-center p-[4.932px] rounded-[9.863px]">
        <div className="relative shrink-0 size-[17.261px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.p8fcdd00} fill="white" />
            <path d={svgPaths.p147ecfb0} fill="white" />
          </svg>
        </div>
        <div className="capitalize flex flex-col font-['Alumni_Sans_Inline_One:Regular',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white w-[118px]">
          <p className="leading-[normal]">Consultant Space</p>
        </div>
      </div>

      {/* Divider */}
      <div className="absolute bottom-[83.45%] left-0 right-0 top-[16.55%]">
        <div className="absolute inset-[-0.41px_-0.15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 277 1">
            <path d="M0.410972 0.410972H275.762" opacity="0.48" stroke="white" strokeLinecap="round" strokeWidth="0.821944" />
          </svg>
        </div>
      </div>

      {/* Dashboard Button */}
      <div className="absolute bg-gradient-to-r box-border content-stretch flex from-[8.571%] from-[rgba(255,255,255,0.1)] gap-[9.863px] items-center left-[49.32px] px-[13.151px] py-[9.863px] rounded-bl-[4.932px] rounded-tl-[4.932px] to-[rgba(255,255,255,0)] top-[123.29px] w-[201.376px]">
        <div aria-hidden="true" className="absolute border-[0px_0px_0px_4.932px] border-solid border-white inset-0 pointer-events-none rounded-bl-[4.932px] rounded-tl-[4.932px]" />
        <div className="relative shrink-0 size-[19.727px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p16a2c600} fill="white" />
            <path d={svgPaths.p2e95ef80} fill="white" />
            <path d={svgPaths.p2d8edc00} fill="white" />
            <path d={svgPaths.p15dc2100} fill="white" />
          </svg>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:SemiBold',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">Dashboard</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[202px] w-[201.376px] hover:bg-white/10 transition-colors cursor-pointer"
      >
        <div className="relative shrink-0 size-[19.727px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p37611800} fill="white" />
            <path d={svgPaths.p28a1ad00} fill="white" />
          </svg>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">logout</p>
        </div>
      </button>

      {/* Help Button */}
      <div className="absolute box-border content-stretch flex gap-[9.863px] h-[39.453px] items-center left-[47px] overflow-clip px-[13.151px] py-[9.863px] top-[240px] w-[201.376px]">
        <div className="h-[20px] overflow-clip relative shrink-0 w-[19px]">
          <div className="absolute inset-[8.333%]">
            <div className="absolute inset-[-12%_-12.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21">
                <path d={svgPaths.p1d4468f0} stroke="#D9D9D9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="basis-0 capitalize flex flex-col font-['Poppins:Medium',sans-serif] grow h-full justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[11.507px] text-white">
          <p className="leading-[normal]">help</p>
        </div>
      </div>
    </div>
  );
}

export function ConsultantDashboard({ onLogout }: ConsultantDashboardProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(consultantNotifications);

  // Fetch students with health data
  const { students, isLoading: isLoadingStudents } = useStudents({
    page: currentPage,
    limit: 50,
    search: searchQuery || undefined
  });

  // Transform students to mental health records format
  // Only show students that have been successfully transformed (have data)
  const mentalHealthRecords = transformStudentsToMentalHealthRecords(students || []);

  const itemsPerPage = 10;

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

  const filteredRecords = mentalHealthRecords.filter(record =>
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      <Sidebar onLogout={onLogout} />
      
      <div className="ml-[275.351px] min-h-screen pb-[100px]">
        <Header 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDismiss={handleDismiss}
        />
        <Welcome userName={user?.name} />
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

            <div className="flex items-center gap-[16px]">
              <button className="font-['Poppins:Medium',sans-serif] text-[#2f80ed] text-[11.507px] hover:opacity-80 transition-opacity">
                Export Data
              </button>
              
              <div className="bg-[#f5f6f8] flex gap-[9.863px] items-center px-[13.151px] py-[6px] rounded-[4.932px] w-[300px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search......"
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
          </div>

          {/* Loading State */}
          {isLoadingStudents && (
            <div className="flex items-center justify-center py-[40px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c1e33]"></div>
              <span className="ml-3 font-['Poppins:Regular',sans-serif] text-[#495d72]">Loading students...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingStudents && (mentalHealthRecords.length === 0 || students.length === 0) && (
            <div className="flex flex-col items-center justify-center py-[40px] gap-[12px]">
              <span className="font-['Poppins:Regular',sans-serif] text-[#495d72]">No students found</span>
              <span className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] opacity-70">
                {students.length === 0 
                  ? 'No students in database. Please run seed or create students.' 
                  : 'No students with health records found.'}
              </span>
            </div>
          )}

          {/* Scrollable Table Container */}
          {!isLoadingStudents && mentalHealthRecords.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-[4px] border border-[#ced8e5]">
                <table className="w-full min-w-[2400px]">
                  <thead>
                    <tr className="bg-[#f4f6f7] border-b border-[#ced8e5]">
                      <th className="py-[12px] px-[12px] text-left font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Student Name</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Age</th>
                      <th className="py-[12px] px-[12px] text-left font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Course</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Stress Level</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Mood Rating</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Sleep Hours</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Counseling Sessions</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Risk Level</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Depression Score</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Anxiety Score</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Sleep Quality</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Physical Activity</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Diet Quality</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Social Support</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Substance Use</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Family History</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Chronic Illness</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Financial Stress</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Credit Load</th>
                      <th className="py-[12px] px-[12px] text-center font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Last Check-In</th>
                      <th className="py-[12px] px-[12px] text-left font-['Poppins:SemiBold',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record, idx) => (
                      <tr key={record.id} className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-white"}>
                        <td className="py-[10px] px-[12px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[11px] whitespace-nowrap">{record.studentName}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.age}</td>
                        <td className="py-[10px] px-[12px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{record.course}</td>
                        <td className="py-[10px] px-[12px] text-center">
                          <span className={`${getStressLevelColor(record.stressLevel)} px-[8px] py-[2px] rounded-[4px] font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-[10px] inline-block`}>
                            {record.stressLevel}/5
                          </span>
                        </td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.moodRating}/5</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.sleepHours}h</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.counselingSessions}</td>
                        <td className="py-[10px] px-[12px] text-center">
                          <span className={`${getRiskLevelColor(record.riskLevel)} font-['Poppins:SemiBold',sans-serif] text-[11px] capitalize`}>
                            {record.riskLevel}
                          </span>
                        </td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.depressionScore}/5</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.anxietyScore}/5</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{record.sleepQuality}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{record.physicalActivity}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{record.dietQuality}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.socialSupport}/5</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{record.substanceUse}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">{record.familyHistory}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px]">{record.chronicIllness}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.financialStress}/5</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-[11px]">{record.semesterCreditLoad}</td>
                        <td className="py-[10px] px-[12px] text-center font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] whitespace-nowrap">{record.lastCheckIn}</td>
                        <td className="py-[10px] px-[12px] font-['Poppins:Regular',sans-serif] text-[#495d72] text-[11px] max-w-[250px] truncate" title={record.notes}>{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-[8px] mt-[20px]">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative shrink-0 size-[19.727px] disabled:opacity-50 hover:opacity-70 transition-opacity"
                >
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path d={svgPaths.p23330400} stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.23292" />
                  </svg>
                </button>
                <div className="flex items-center gap-[4px] font-['Poppins:Medium',sans-serif] text-[10px]">
                  <span className="text-[rgba(12,30,51,0.4)]">Page</span>
                  <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]">{currentPage}</span>
                  <span className="text-[rgba(12,30,51,0.4)]">of</span>
                  <span className="font-['Poppins:Bold',sans-serif] text-[#0c1e33]">{totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative shrink-0 size-[19.727px] disabled:opacity-50 hover:opacity-70 transition-opacity rotate-180"
                >
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path d={svgPaths.p24249800} stroke="#292D32" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.23292" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
