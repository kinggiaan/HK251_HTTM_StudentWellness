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

        // Fetch latest health record for each student
        const studentsWithHealth = await Promise.all(
          (response.data || []).map(async (student) => {
            try {
              const healthRecords = await mentalHealthService.listByStudent(student.id, { limit: 1 });
              return {
                ...student,
                latestHealthRecord: healthRecords[0],
                healthRecords: healthRecords
              };
            } catch (err) {
              // If no health records, just return student without health data
              return {
                ...student,
                latestHealthRecord: undefined,
                healthRecords: []
              };
            }
          })
        );

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

