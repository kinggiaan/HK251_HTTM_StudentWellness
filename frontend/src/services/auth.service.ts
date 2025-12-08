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
    // Strapi uses /api/auth/local for login with users-permissions plugin
    const response = await apiClient.post<{
      jwt: string;
      user: {
        id: number;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        createdAt: string;
        updatedAt: string;
        role?: {
          id: number;
          name: string;
          type: string;
        };
      };
    }>('/api/auth/local', {
      identifier: credentials.email, // Strapi uses 'identifier' instead of 'email'
      password: credentials.password
    });
    
    if (!response || !response.jwt) {
      throw new Error('Login failed: No JWT token received');
    }
    
    // Get user with role populated
    apiClient.setAccessToken(response.jwt);
    
    // Strapi 5 uses different populate syntax - try multiple approaches
    let userWithRole: any;
    try {
      // Try with populate[role][populate]=* to get nested relations
      userWithRole = await apiClient.get('/api/users/me?populate[role][populate]=*');
    } catch (e1) {
      try {
        // Try populate=*
        userWithRole = await apiClient.get('/api/users/me?populate=*');
      } catch (e2) {
        // Fallback to basic call
        userWithRole = await apiClient.get('/api/users/me');
      }
    }
    
    // DEBUG: Log to console to see what role is returned
    console.log('=== AUTH DEBUG ===');
    console.log('Full response:', userWithRole);
    console.log('Full response JSON:', JSON.stringify(userWithRole, null, 2));
    console.log('Username:', userWithRole.username);
    console.log('Email:', userWithRole.email);
    console.log('RoleName field:', userWithRole.roleName);
    console.log('Role object:', userWithRole.role);
    console.log('Role name:', userWithRole.role?.name);
    console.log('Role type:', userWithRole.role?.type);
    console.log('All keys:', Object.keys(userWithRole));
    console.log('================');
    
    // Map Strapi role name to frontend role
    const roleMapping: Record<string, User['role']> = {
      'Consultant': 'consultant',
      'Teacher Supervisor': 'teacher_supervisor',
      'Data Scientist': 'data_scientist',
      'Admin': 'admin',
      'Authenticated': 'consultant',
      // Lowercase versions
      'consultant': 'consultant',
      'teacher supervisor': 'teacher_supervisor',
      'data scientist': 'data_scientist',
      'admin': 'admin',
      'authenticated': 'consultant',
      // Username-based mapping (since backend doesn't return role field)
      'engineer': 'data_scientist',
      'supervisor': 'teacher_supervisor',
      'scientist': 'data_scientist',
      'datascientist': 'data_scientist',
      'data_scientist': 'data_scientist',
      'teacher': 'teacher_supervisor',
      'teacher_supervisor': 'teacher_supervisor',
      'teachersupervisor': 'teacher_supervisor'
    };
    
    // Backend doesn't return role field - use username as fallback
    let roleName = userWithRole.roleName  
      || userWithRole.role?.name 
      || userWithRole.role?.type
      || userWithRole.username  // Use username as role identifier
      || 'Authenticated';
    
    const mappedRole = roleMapping[roleName.toLowerCase()] || 'consultant';
    
    console.log('Role name used:', roleName);
    console.log('Mapped role:', mappedRole);
    console.log('================');
    
    // Map Strapi user to frontend format
    const user: User = {
      id: String(userWithRole.id),
      email: userWithRole.email,
      name: userWithRole.username,
      fullName: userWithRole.username,
      role: mappedRole,
      avatar: undefined,
      avatarUrl: undefined
    };
    
    return {
      user,
      token: {
        accessToken: response.jwt,
        refreshToken: response.jwt, // Strapi doesn't have separate refresh token by default
        expiresIn: '7d'
      }
    };
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    // Strapi doesn't have a refresh token endpoint by default
    // We'll just validate the existing token by fetching user info
    try {
      apiClient.setAccessToken(refreshToken);
      const userWithRole = await apiClient.get<{
        id: number;
        username: string;
        email: string;
        role: {
          id: number;
          name: string;
          type: string;
        };
      }>('/api/users/me?populate=role');
      
      // Map Strapi role name to frontend role
      const roleMapping: Record<string, User['role']> = {
        'Consultant': 'consultant',
        'Teacher Supervisor': 'teacher_supervisor',
        'Data Scientist': 'data_scientist',
        'Admin': 'admin',
        'Authenticated': 'consultant'
      };
      
      const roleName = userWithRole.role?.name || 'Authenticated';
      const mappedRole = roleMapping[roleName] || 'consultant';
      
      const user: User = {
        id: String(userWithRole.id),
        email: userWithRole.email,
        name: userWithRole.username,
        fullName: userWithRole.username,
        role: mappedRole,
        avatar: undefined,
        avatarUrl: undefined
      };
      
      return {
        user,
        token: {
          accessToken: refreshToken,
          refreshToken: refreshToken,
          expiresIn: '7d'
        }
      };
    } catch (error) {
      throw new Error('Session expired. Please login again.');
    }
  },

  async refreshOld(refreshToken: string): Promise<RefreshResponse> {
    // Old implementation - keeping for reference
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

