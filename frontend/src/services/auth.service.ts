// Authentication Service

import { apiClient } from '../lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string; // Maps from backend fullName
  fullName?: string; // Backend field
  role: 'admin' | 'consultant' | 'teacher_supervisor' | 'data_scientist';
  avatar?: string;
  avatarUrl?: string; // Backend field
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  user: User;
  token: AuthTokens;
}

export interface RefreshResponse {
  user: User;
  token: AuthTokens;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<{
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
        avatarUrl?: string;
      };
      token: AuthTokens;
    }>('/auth/login', credentials);
    
    if (!response) {
      throw new Error('Login failed: No response from server');
    }
    
    // Map backend user to frontend format
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.fullName, // Map fullName to name
      fullName: response.user.fullName,
      role: response.user.role as User['role'],
      avatar: response.user.avatarUrl,
      avatarUrl: response.user.avatarUrl
    };
    
    if (response.token?.accessToken) {
      apiClient.setAccessToken(response.token.accessToken);
    }
    
    return {
      user,
      token: response.token
    };
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post<{
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
        avatarUrl?: string;
      };
      token: AuthTokens;
    }>('/auth/refresh', {
      refreshToken
    });
    
    if (!response) {
      throw new Error('Token refresh failed: No response from server');
    }
    
    // Map backend user to frontend format
    const user: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.fullName, // Map fullName to name
      fullName: response.user.fullName,
      role: response.user.role as User['role'],
      avatar: response.user.avatarUrl,
      avatarUrl: response.user.avatarUrl
    };
    
    if (response.token?.accessToken) {
      apiClient.setAccessToken(response.token.accessToken);
    }
    
    return {
      user,
      token: response.token
    };
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      apiClient.setAccessToken(null);
      localStorage.removeItem('refreshToken');
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  setStoredRefreshToken(token: string | null) {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }
};

