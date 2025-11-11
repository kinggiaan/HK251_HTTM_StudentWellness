import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { ConsultantDashboard } from "./components/ConsultantDashboard";
import { TeacherSupervisorDashboard } from "./components/TeacherSupervisorDashboard";
import { DataScientistDashboard } from "./components/DataScientistDashboard";
import { AdminConsole } from "./components/AdminConsole";
import { Toaster } from "./components/ui/sonner";
import { PermissionsProvider } from "./contexts/PermissionsContext";

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
  const roleMap: Record<string, "consultant" | "teacher" | "dataScientist" | "admin"> = {
    consultant: "consultant",
    teacher_supervisor: "teacher",
    data_scientist: "dataScientist",
    admin: "admin" // Route admins to hidden Admin Console
  };

  const frontendRole = roleMap[user.role] || "consultant";

  // Show Consultant Dashboard if user is a consultant
  if (frontendRole === "consultant") {
    return (
      <PermissionsProvider>
        <ConsultantDashboard onLogout={logout} />
        <Toaster />
      </PermissionsProvider>
    );
  }

  // Show Teacher/Supervisor Dashboard if user is a teacher
  if (frontendRole === "teacher") {
    return (
      <PermissionsProvider>
        <TeacherSupervisorDashboard onLogout={logout} />
        <Toaster />
      </PermissionsProvider>
    );
  }

  // Show Data Scientist Dashboard if user is a data scientist
  if (frontendRole === "dataScientist") {
    return (
      <PermissionsProvider>
        <DataScientistDashboard onLogout={logout} />
        <Toaster />
      </PermissionsProvider>
    );
  }

  // Hidden Admin Console (developer-only; no public navigation)
  if (frontendRole === "admin") {
    return (
      <PermissionsProvider>
        <AdminConsole />
        <Toaster />
      </PermissionsProvider>
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
