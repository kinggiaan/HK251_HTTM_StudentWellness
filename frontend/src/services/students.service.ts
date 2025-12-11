// Students Service

import { apiClient } from '../lib/api';

export interface Student {
  id: string;
  documentId?: string;
  studentId?: string;
  name: string; // Backend uses 'name' field
  age?: number;
  cgpa?: number;
  validated?: boolean;
  city?: string;
  academic_pressure?: number;
  study_satisfaction?: number;
  sleep_duration?: string;
  dietary_habits?: string;
  degree?: string; // First year, Second year, etc.
  work_study_hours?: number;
  gender?: string;
  financial_stress?: number;
  family_his_of_mental_illness?: string;
  depression_truth?: number;
  depression_predicting?: number;
  // Legacy fields for compatibility
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  enrollmentDate?: string;
  major?: string;
  department?: string;
  year?: number;
  gpa?: number;
  status?: 'active' | 'inactive' | 'graduated' | 'suspended';
  avatar?: string;
  consultantId?: string;
  stressLevel?: number;
  sleepHours?: number;
  riskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
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

// Helper functions to parse API data
function parseSleepHours(sleepDuration: string): number {
  if (!sleepDuration) return 7;
  
  const lowerDuration = sleepDuration.toLowerCase();
  if (lowerDuration.includes('less than 5')) return 4;
  if (lowerDuration.includes('5-6')) return 5.5;
  if (lowerDuration.includes('7-8')) return 7.5;
  if (lowerDuration.includes('more than 8')) return 9;
  
  // Try to extract number
  const match = sleepDuration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 7;
}

function getRiskLevelFromDepression(depressionScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (depressionScore === 0) return 'low';
  if (depressionScore === 1) return 'medium';
  return 'high';
}

function parseYear(degree: string): number {
  if (!degree) return 1;
  
  const lowerDegree = degree.toLowerCase();
  if (lowerDegree.includes('first')) return 1;
  if (lowerDegree.includes('second')) return 2;
  if (lowerDegree.includes('third')) return 3;
  if (lowerDegree.includes('fourth') || lowerDegree.includes('final')) return 4;
  
  return 1;
}

export const studentsService = {
  async list(params?: ListStudentsParams): Promise<ListStudentsResponse> {
    console.log('📚 Fetching students with params:', params);
    
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
      const students = Array.isArray(response.data) ? response.data.map((item: any) => {
        // Handle both flat structure and nested attributes structure
        const flatData = item.attributes || item;
        return {
          id: String(item.id || item.documentId),
          documentId: item.documentId,
          studentId: flatData.studentId || String(item.id || item.documentId),
          name: flatData.name || 'Unknown',
          age: flatData.age,
          cgpa: flatData.cgpa,
          gpa: flatData.cgpa, // Map cgpa to gpa for compatibility
          validated: flatData.validated,
          city: flatData.city,
          academic_pressure: flatData.academic_pressure,
          study_satisfaction: flatData.study_satisfaction,
          sleep_duration: flatData.sleep_duration,
          dietary_habits: flatData.dietary_habits,
          degree: flatData.degree,
          work_study_hours: flatData.work_study_hours,
          gender: flatData.gender,
          financial_stress: flatData.financial_stress,
          family_his_of_mental_illness: flatData.family_his_of_mental_illness,
          depression_truth: flatData.depression_truth,
          depression_predicting: flatData.depression_predicting,
          createdAt: flatData.createdAt || item.createdAt || new Date().toISOString(),
          updatedAt: flatData.updatedAt || item.updatedAt || new Date().toISOString(),
          publishedAt: flatData.publishedAt || item.publishedAt,
          // Map to legacy fields
          stressLevel: flatData.academic_pressure || flatData.financial_stress,
          sleepHours: flatData.sleep_duration ? parseSleepHours(flatData.sleep_duration) : undefined,
          riskLevel: flatData.depression_predicting ? getRiskLevelFromDepression(flatData.depression_predicting) : 'low',
          year: flatData.degree ? parseYear(flatData.degree) : undefined,
          status: flatData.validated ? 'active' : 'inactive'
        };
      }) : [];
      
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
  },

  // Consultant-specific: Validate a student
  async validateStudent(documentId: string, validated: boolean): Promise<Student> {
    const response = await apiClient.put(`/api/students/${documentId}`, {
      data: { validated }
    });
    return response;
  },

  // Consultant-specific: Set depression truth and prediction
  async updateDepressionStatus(
    documentId: string, 
    depressionTruth: number, 
    depressionPredicting?: number
  ): Promise<Student> {
    const data: any = { depression_truth: depressionTruth };
    if (depressionPredicting !== undefined) {
      data.depression_predicting = depressionPredicting;
    }
    const response = await apiClient.put(`/api/students/${documentId}`, {
      data
    });
    return response;
  }
};

