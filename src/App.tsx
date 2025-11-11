import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { ConsultantDashboard } from "./components/ConsultantDashboard";
import { TeacherSupervisorDashboard } from "./components/TeacherSupervisorDashboard";
import { DataScientistDashboard } from "./components/DataScientistDashboard";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c1e33] mx-auto mb-4"></div>
          <p className="font-['Poppins:Regular',sans-serif] text-[#495d72]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  // Map backend roles to frontend role types
  const roleMap: Record<string, "consultant" | "teacher" | "dataScientist"> = {
    consultant: "consultant",
    teacher_supervisor: "teacher",
    data_scientist: "dataScientist",
    admin: "consultant" // Admin can access consultant dashboard
  };

  const frontendRole = roleMap[user.role] || "consultant";

  // Show Consultant Dashboard if user is a consultant or admin
  if (frontendRole === "consultant") {
    return (
      <>
        <ConsultantDashboard onLogout={logout} />
        <Toaster />
      </>
    );
  }

  // Show Teacher/Supervisor Dashboard if user is a teacher
  if (frontendRole === "teacher") {
    return (
      <>
        <TeacherSupervisorDashboard onLogout={logout} />
        <Toaster />
      </>
    );
  }

  // Show Data Scientist Dashboard if user is a data scientist
  if (frontendRole === "dataScientist") {
    return (
      <>
        <DataScientistDashboard onLogout={logout} />
        <Toaster />
      </>
    );
  }

  // Default fallback (should never reach here)
  return (
    <>
      <LoginPage />
      <Toaster />
    </>
  );
}
