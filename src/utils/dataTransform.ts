// Utility functions to transform backend data to frontend format

import type { StudentWithHealthData } from '../hooks/useStudents';
import type { MentalHealthRecord as FrontendMentalHealthRecord } from '../data/mockMentalHealth';

export function transformStudentToMentalHealthRecord(
  student: StudentWithHealthData
): FrontendMentalHealthRecord | null {
  // Use health record if available, otherwise use student's own data
  const healthRecord = student.latestHealthRecord;
  
  // If no health record, still create a record from student data
  if (!healthRecord && !student.stressLevel) {
    return null; // Skip students with no data at all
  }

  // Map backend risk levels to frontend format
  const riskLevelMap: Record<string, 'low' | 'moderate' | 'high'> = {
    low: 'low',
    medium: 'moderate',
    high: 'high',
    critical: 'high'
  };

  // Map sleep quality number to string
  const sleepQualityMap: Record<number, 'Poor' | 'Fair' | 'Good' | 'Excellent'> = {
    1: 'Poor',
    2: 'Poor',
    3: 'Fair',
    4: 'Fair',
    5: 'Fair',
    6: 'Good',
    7: 'Good',
    8: 'Good',
    9: 'Excellent',
    10: 'Excellent'
  };

  // Use health record data if available, otherwise use student's own data
  const stressLevel = healthRecord?.stressLevel ?? student.stressLevel ?? 0;
  const sleepHours = healthRecord?.sleepHours ?? student.sleepHours ?? 0;
  const riskLevel = healthRecord?.riskLevel ?? student.riskLevel ?? 'low';
  const riskScore = healthRecord?.riskScore ?? student.riskScore ?? 0;
  const depressionLevel = healthRecord?.depressionLevel ?? 0;
  const anxietyLevel = healthRecord?.anxietyLevel ?? 0;
  const sleepQuality = healthRecord?.sleepQuality ?? 5;

  // Parse student name (backend uses 'name' field, not firstName/lastName)
  const studentName = student.name || `${(student as any).firstName || ''} ${(student as any).lastName || ''}`.trim() || 'Unknown';
  const course = student.major || student.department || 'Unknown';
  
  // Calculate age from dateOfBirth if available, otherwise use default
  let age = 20; // Default age
  if ((student as any).dateOfBirth) {
    age = new Date().getFullYear() - new Date((student as any).dateOfBirth).getFullYear();
  }

  return {
    id: healthRecord?.id || student.id,
    studentName,
    age,
    course,
    stressLevel,
    moodRating: 3, // Default, backend doesn't have this field yet
    sleepHours: Number(sleepHours),
    counselingSessions: 0, // Will need to fetch from counseling sessions
    lastCheckIn: healthRecord?.assessmentDate || student.lastAssessment || new Date().toISOString(),
    riskLevel: riskLevelMap[riskLevel] || 'low',
    notes: healthRecord?.notes || '',
    depressionScore: depressionLevel,
    anxietyScore: anxietyLevel,
    sleepQuality: sleepQualityMap[sleepQuality] || 'Fair',
    physicalActivity: 'Moderate', // Default, backend doesn't have this field yet
    dietQuality: 'Good', // Default, backend doesn't have this field yet
    socialSupport: 3, // Default, backend doesn't have this field yet
    substanceUse: 'Never', // Default, backend doesn't have this field yet
    familyHistory: 'No', // Default, backend doesn't have this field yet
    chronicIllness: 'No', // Default, backend doesn't have this field yet
    financialStress: 2, // Default, backend doesn't have this field yet
    semesterCreditLoad: 15 // Default, backend doesn't have this field yet
  };
}

export function transformStudentsToMentalHealthRecords(
  students: StudentWithHealthData[]
): FrontendMentalHealthRecord[] {
  return students
    .map(transformStudentToMentalHealthRecord)
    .filter((record): record is FrontendMentalHealthRecord => record !== null);
}

