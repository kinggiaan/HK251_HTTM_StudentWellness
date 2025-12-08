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
    // Strapi uses pagination[page], pagination[pageSize] format
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('pagination[page]', params.page.toString());
    if (params?.limit) queryParams.append('pagination[pageSize]', params.limit.toString());
    
    // Strapi uses filters[field][$contains] format for search
    if (params?.search) {
      queryParams.append('filters[name][$containsi]', params.search);
    }
    if (params?.status) queryParams.append('filters[status][$eq]', params.status);
    if (params?.riskLevel) queryParams.append('filters[riskLevel][$eq]', params.riskLevel);
    if (params?.consultantId) queryParams.append('filters[consultantId][$eq]', params.consultantId);
    
    // Strapi uses sort format: sort=field:asc or sort=field:desc
    if (params?.sortBy) {
      const order = params?.sortOrder || 'asc';
      queryParams.append('sort', `${params.sortBy}:${order}`);
    }

    const query = queryParams.toString();
    const response = await apiClient.get<{ data: any[]; meta: { pagination: any } }>(`/api/students${query ? `?${query}` : ''}`);
    
    // Strapi returns { data: [], meta: { pagination: {...} } }
    if (response && 'data' in response) {
      const students = Array.isArray(response.data) ? response.data.map((item: any) => ({
        id: item.id || item.documentId,
        documentId: item.documentId,
        ...item.attributes,
        ...(typeof item !== 'object' || !item.attributes ? item : {})
      })) : [];
      
      const pagination = response.meta?.pagination || {};
      return {
        data: students as Student[],
        pagination: {
          page: pagination.page || params?.page || 1,
          limit: pagination.pageSize || params?.limit || 50,
          total: pagination.total || students.length,
          totalPages: pagination.pageCount || 1
        }
      };
    }
    
    // Fallback
    return {
      data: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 50,
        total: 0,
        totalPages: 1
      }
    };
  },

  async getById(id: string): Promise<Student> {
    return apiClient.get<Student>(`/api/students/${id}`);
  },

  async create(input: CreateStudentInput): Promise<Student> {
    return apiClient.post<Student>('/api/students', input);
  },

  async update(id: string, input: UpdateStudentInput): Promise<Student> {
    return apiClient.patch<Student>(`/api/students/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/api/students/${id}`);
  }
};

