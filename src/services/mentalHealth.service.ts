// Mental Health Records Service

import { apiClient } from '../lib/api';

export interface MentalHealthRecord {
  id: string;
  studentId: string;
  stressLevel: number;
  anxietyLevel: number;
  depressionLevel: number;
  sleepHours: number;
  sleepQuality: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  assessmentType: 'self' | 'professional' | 'ml_prediction';
  assessmentDate: string;
  notes?: string;
  predictedRisk?: number;
  modelVersion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthRecordInput {
  stressLevel: number;
  anxietyLevel: number;
  depressionLevel: number;
  sleepHours: number;
  sleepQuality: number;
  assessmentType: 'self' | 'professional' | 'ml_prediction';
  notes?: string;
  assessmentDate?: string;
  predictedRisk?: number;
  modelVersion?: string;
}

export interface UpdateHealthRecordInput {
  stressLevel?: number;
  anxietyLevel?: number;
  depressionLevel?: number;
  sleepHours?: number;
  sleepQuality?: number;
  notes?: string;
  assessmentDate?: string;
}

export interface ListHealthRecordsParams {
  from?: string;
  to?: string;
  limit?: number;
}

export const mentalHealthService = {
  async listByStudent(
    studentId: string,
    params?: ListHealthRecordsParams
  ): Promise<MentalHealthRecord[]> {
    const queryParams = new URLSearchParams();
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get<MentalHealthRecord[]>(
      `/students/${studentId}/health-records${query ? `?${query}` : ''}`
    );
  },

  async getById(id: string): Promise<MentalHealthRecord> {
    return apiClient.get<MentalHealthRecord>(`/health-records/${id}`);
  },

  async create(
    studentId: string,
    input: CreateHealthRecordInput
  ): Promise<MentalHealthRecord> {
    return apiClient.post<MentalHealthRecord>(
      `/students/${studentId}/health-records`,
      input
    );
  },

  async update(
    id: string,
    input: UpdateHealthRecordInput
  ): Promise<MentalHealthRecord> {
    return apiClient.patch<MentalHealthRecord>(`/health-records/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/health-records/${id}`);
  }
};

