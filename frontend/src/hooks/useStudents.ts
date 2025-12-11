// Hook for fetching and managing students data

import { useState, useEffect } from 'react';
import { studentsService, type Student } from '../services/students.service';
import { mentalHealthService, type MentalHealthRecord } from '../services/mentalHealth.service';
import { toast } from 'sonner';

export interface StudentWithHealthData extends Student {
  latestHealthRecord?: MentalHealthRecord;
  healthRecords?: MentalHealthRecord[];
}

export function useStudents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  riskLevel?: string;
}) {
  const [students, setStudents] = useState<StudentWithHealthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await studentsService.list(params);
        
        if (!response || !response.data) {
          setStudents([]);
          setPagination({
            page: 1,
            limit: 50,
            total: 0,
            totalPages: 0
          });
          return;
        }
        
        setPagination(response.pagination || {
          page: 1,
          limit: 50,
          total: response.data.length,
          totalPages: 1
        });

        // Map student data to include health info from existing fields
        // No need to fetch health-records API (doesn't exist yet)
        const studentsWithHealth = (response.data || []).map((student) => {
          // Calculate risk level from depression prediction (2-level system)
          let calculatedRiskLevel: 'no-depression' | 'has-depression' = 'no-depression';
          if (student.depression_predicting !== undefined && student.depression_predicting !== null) {
            calculatedRiskLevel = student.depression_predicting === 1 ? 'has-depression' : 'no-depression';
          } else if (student.depression_truth !== undefined && student.depression_truth !== null) {
            calculatedRiskLevel = student.depression_truth === 1 ? 'has-depression' : 'no-depression';
          } else {
            // Default: no depression for new students
            calculatedRiskLevel = 'no-depression';
          }
          
          // Create health record from student's depression data
          const latestHealthRecord: MentalHealthRecord | undefined = 
            student.depression_predicting !== undefined || student.depression_truth !== undefined
              ? {
                  id: `${student.id}-health`,
                  studentId: student.id,
                  stressLevel: student.academic_pressure || student.financial_stress || 0,
                  anxietyLevel: 0,
                  depressionLevel: student.depression_predicting ?? student.depression_truth ?? 0,
                  sleepHours: student.sleepHours || 7,
                  sleepQuality: 3,
                  riskScore: student.riskScore || (student.depression_predicting === 1 ? 0.7 : 0.3),
                  riskLevel: calculatedRiskLevel,
                  assessmentType: student.depression_predicting !== undefined ? 'ml_prediction' : 'self',
                  assessmentDate: student.updatedAt,
                  createdAt: student.createdAt,
                  updatedAt: student.updatedAt
                }
              : undefined;

          return {
            ...student,
            riskLevel: calculatedRiskLevel, // Add calculated risk level to student
            latestHealthRecord,
            healthRecords: latestHealthRecord ? [latestHealthRecord] : []
          };
        });

        setStudents(studentsWithHealth);
      } catch (err: any) {
        setError(err);
        toast.error(err.message || 'Failed to fetch students');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    students,
    isLoading,
    error,
    pagination,
    refetch: () => {
      // Trigger refetch by updating a dependency
      setStudents([]);
      setIsLoading(true);
    }
  };
}

