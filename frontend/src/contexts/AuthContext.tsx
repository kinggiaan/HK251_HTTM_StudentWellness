// Authentication Context

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type User, type LoginCredentials } from '../services/auth.service';
import { apiClient } from '../lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore session on mount
    const restoreSession = async () => {
      // Check if we're in development mode and should reset to login
      const forceLogout = sessionStorage.getItem('forceLogout');
      if (forceLogout === 'true') {
        sessionStorage.removeItem('forceLogout');
        authService.setStoredRefreshToken(null);
        apiClient.setAccessToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const refreshToken = authService.getStoredRefreshToken();
      if (refreshToken) {
        try {
          // Just validate token by setting it and fetching user info
          apiClient.setAccessToken(refreshToken);
          const response = await authService.refresh(refreshToken);
          setUser(response.user);
          authService.setStoredRefreshToken(response.token.refreshToken);
        } catch (error) {
          // Refresh failed, clear tokens and go to login
          console.warn('Session restore failed:', error);
          authService.setStoredRefreshToken(null);
          apiClient.setAccessToken(null);
          setUser(null);
          toast.info('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      authService.setStoredRefreshToken(response.token.refreshToken);
      toast.success(`Welcome back, ${response.user.name || response.user.email}!`);
    } catch (error: any) {
      // Format error message for better visibility
      let errorMsg = 'Login failed. Please check your credentials.';
      
      if (typeof error?.message === 'string') {
        errorMsg = error.message;
      } else if (error?.status === 400) {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (error?.status === 401) {
        errorMsg = 'Authentication failed. Please check your credentials.';
      } else if (error?.status === 404) {
        errorMsg = 'Account not found. Please contact administrator.';
      } else if (error?.status >= 500) {
        errorMsg = 'Server error. Please try again later.';
      }
      
      toast.error(errorMsg, {
        duration: 5000,
        description: error?.status ? `Error code: ${error.status}` : undefined
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = authService.getStoredRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear all auth state
      setUser(null);
      authService.setStoredRefreshToken(null);
      apiClient.setAccessToken(null);
      // Clear any other stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast.success('Logged out successfully');
    }
  };

  const refreshAuth = async () => {
    const refreshToken = authService.getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    try {
      const response = await authService.refresh(refreshToken);
      setUser(response.user);
      authService.setStoredRefreshToken(response.token.refreshToken);
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

