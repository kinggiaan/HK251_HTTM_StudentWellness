// API Client for Backend Communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.accessToken = localStorage.getItem('accessToken');
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw {
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status
          } as ApiError;
        }
        return undefined as T;
      }

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data?.message || data?.error || 'An error occurred',
          status: response.status,
          errors: (data as any)?.errors
        };
        throw error;
      }

      // Handle null or undefined data
      if (data === null || data === undefined) {
        return undefined as T;
      }

      // Return data.data if it exists, otherwise return the whole data object
      return (data.data !== undefined ? data.data : data) as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

