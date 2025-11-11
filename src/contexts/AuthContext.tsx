// Authentication Context

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type User, type LoginCredentials } from '../services/auth.service';
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
      const refreshToken = authService.getStoredRefreshToken();
      if (refreshToken) {
        try {
          const response = await authService.refresh(refreshToken);
          setUser(response.user);
          authService.setStoredRefreshToken(response.token.refreshToken);
        } catch (error) {
          // Refresh failed, clear tokens
          authService.setStoredRefreshToken(null);
          apiClient.setAccessToken(null);
          setUser(null);
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
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
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

import { apiClient } from '../lib/api';

