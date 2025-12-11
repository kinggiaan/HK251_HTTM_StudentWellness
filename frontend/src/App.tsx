import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { ConsultantDashboard } from "./components/ConsultantDashboard";
import { TeacherSupervisorDashboard } from "./components/TeacherSupervisorDashboard";
import { DataScientistDashboard } from "./components/DataScientistDashboard";
import { Toaster } from "./components/ui/sonner";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Error handling - catch any rendering errors
  try {
    return <AppContent user={user} isAuthenticated={isAuthenticated} isLoading={isLoading} logout={logout} />;
  } catch (error) {
    console.error('App rendering error:', error);
    return <ErrorFallback error={error} />;
  }
}

function AppContent({ user, isAuthenticated, isLoading, logout }: {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}) {

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


  // Default fallback (should never reach here)
  return (
    <>
      <LoginPage />
      <Toaster />
    </>
  );
}

// Error fallback component
function ErrorFallback({ error }: { error: any }) {
  const handleReload = () => {
    window.location.href = '/';
  };

  const handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="font-['Poppins:SemiBold',sans-serif] text-3xl text-[#0c1e33] mb-2">
            Đã xảy ra lỗi
          </h1>
          <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] mb-6">
            Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="font-['Poppins:Medium',sans-serif] text-red-800 mb-2">
              Thông tin lỗi:
            </p>
            <code className="block text-sm text-red-700 font-mono overflow-x-auto">
              {error.toString()}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReload}
            className="flex-1 bg-[#0c1e33] hover:bg-[#152d47] text-white font-['Poppins:Medium',sans-serif] py-3 px-6 rounded-lg transition-colors"
          >
            Tải lại trang
          </button>
          <button
            onClick={handleClearStorage}
            className="flex-1 bg-white hover:bg-gray-50 text-[#0c1e33] border border-[#0c1e33] font-['Poppins:Medium',sans-serif] py-3 px-6 rounded-lg transition-colors"
          >
            Xóa dữ liệu & Tải lại
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-[#495d72] font-['Poppins:Regular',sans-serif] text-center">
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với bộ phận kỹ thuật
          </p>
        </div>
      </div>
    </div>
  );
}
