// Students Service

import { apiClient } from '../lib/api';

export interface Student {
  id: string;
  studentId: string;
  name: string; // Backend uses 'name' field
  firstName?: string; // For compatibility
  lastName?: string; // For compatibility
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  enrollmentDate?: string;
  major?: string;
  department?: string; // Backend uses 'department'
  year?: number; // Backend uses number, not string
  gpa?: number;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  avatar?: string;
  consultantId?: string;
  stressLevel?: number;
  sleepHours?: number;
  riskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  riskLevel?: string;
  consultantId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ListStudentsResponse {
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStudentInput {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  major: string;
  year: string;
  consultantId?: string;
}

export interface UpdateStudentInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  major?: string;
  year?: string;
  status?: 'active' | 'inactive' | 'graduated' | 'suspended';
  consultantId?: string;
}

export const studentsService = {
  async list(params?: ListStudentsParams): Promise<ListStudentsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);
    if (params?.consultantId) queryParams.append('consultantId', params.consultantId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const query = queryParams.toString();
    const response = await apiClient.get<{ data: Student[]; pagination: any }>(`/students${query ? `?${query}` : ''}`);
    
    // Handle case where response might be the full object or just the data
    if (response && 'data' in response && 'pagination' in response) {
      return response as ListStudentsResponse;
    }
    
    // Fallback: if response is just an array, wrap it
    return {
      data: Array.isArray(response) ? response : [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 50,
        total: Array.isArray(response) ? response.length : 0,
        totalPages: 1
      }
    };
  },

  async getById(id: string): Promise<Student> {
    return apiClient.get<Student>(`/students/${id}`);
  },

  async create(input: CreateStudentInput): Promise<Student> {
    return apiClient.post<Student>('/students', input);
  },

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    return apiClient.patch<Student>(`/students/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/students/${id}`);
  }
};

