// Utility functions to transform backend data to frontend format

import type { StudentWithHealthData } from '../hooks/useStudents';
import type { MentalHealthRecord as FrontendMentalHealthRecord } from '../data/mockMentalHealth';

export function transformStudentToMentalHealthRecord(
  student: StudentWithHealthData
): FrontendMentalHealthRecord | null {
  console.log('🔍 Transforming student:', student);
  
  // Use health record if available, otherwise use student's own data
  const healthRecord = student.latestHealthRecord;
  
  // Always create a record - we have at least basic student info
  // Only skip if student object is completely empty
  if (!student || !student.id) {
    console.log('⚠️ Skipping - invalid student:', student);
    return null;
  }
  
  console.log('✅ Student has data, transforming...');

  // Map backend risk levels to frontend format (2-level system)
  const riskLevelMap: Record<string, 'no-depression' | 'has-depression'> = {
    low: 'no-depression',
    medium: 'no-depression',
    high: 'has-depression',
    critical: 'has-depression',
    'no-depression': 'no-depression',
    'has-depression': 'has-depression'
  };

  // Map sleep quality from duration string to quality
  const getSleepQuality = (duration?: string): 'Poor' | 'Fair' | 'Good' | 'Excellent' => {
    if (!duration) return 'Fair';
    const lower = duration.toLowerCase();
    if (lower.includes('less than 5')) return 'Poor';
    if (lower.includes('5-6')) return 'Fair';
    if (lower.includes('7-8')) return 'Good';
    if (lower.includes('more than 8')) return 'Excellent';
    return 'Fair';
  };

  // Map dietary habits to diet quality
  const getDietQuality = (habits?: string): 'Poor' | 'Fair' | 'Good' | 'Excellent' => {
    if (!habits) return 'Fair';
    const lower = habits.toLowerCase();
    if (lower.includes('healthy') || lower.includes('excellent')) return 'Excellent';
    if (lower.includes('moderate') || lower.includes('balanced')) return 'Good';
    if (lower.includes('unhealthy') || lower.includes('poor')) return 'Poor';
    return 'Fair';
  };

  // Use health record data if available, otherwise use student's own data
  const stressLevel = student.academic_pressure ?? healthRecord?.stressLevel ?? student.stressLevel ?? 3;
  const sleepHours = student.sleepHours ?? healthRecord?.sleepHours ?? 7;
  
  // Calculate risk level from depression_predicting (ML prediction)
  // Simple 2-level system: depression_predicting = 1 → Has Depression, else → No Depression
  let riskLevel: 'no-depression' | 'has-depression' = 'no-depression';
  if (student.depression_predicting !== undefined && student.depression_predicting !== null) {
    // Use ML prediction to determine depression status
    riskLevel = student.depression_predicting === 1 ? 'has-depression' : 'no-depression';
  } else if (student.depression_truth !== undefined && student.depression_truth !== null) {
    // Fallback to validated truth if no prediction
    riskLevel = student.depression_truth === 1 ? 'has-depression' : 'no-depression';
  } else {
    // Default: no depression (for new students without prediction)
    riskLevel = 'no-depression';
  }
  
  const depressionScore = student.depression_predicting ?? student.depression_truth ?? healthRecord?.depressionLevel ?? 0;
  const financialStress = student.financial_stress ?? 2;

  // Parse student name
  const studentName = student.name || `${(student as any).firstName || ''} ${(student as any).lastName || ''}`.trim() || 'Unknown';
  const course = student.major || student.department || student.degree || 'Unknown';
  
  // Get age from student data or calculate from dateOfBirth
  let age = student.age ?? 20;
  if (!student.age && (student as any).dateOfBirth) {
    age = new Date().getFullYear() - new Date((student as any).dateOfBirth).getFullYear();
  }

  return {
    id: healthRecord?.id || student.studentId || student.id,
    studentName,
    age,
    course,
    stressLevel: Number(stressLevel),
    moodRating: student.study_satisfaction ?? 3,
    sleepHours: Number(sleepHours),
    counselingSessions: 0,
    lastCheckIn: healthRecord?.assessmentDate || student.lastAssessment || student.updatedAt || new Date().toISOString(),
    riskLevel: riskLevelMap[riskLevel] || 'low',
    notes: healthRecord?.notes || '',
    depressionScore: Number(depressionScore),
    anxietyScore: Number(stressLevel), // Use academic pressure as proxy for anxiety
    sleepQuality: getSleepQuality(student.sleep_duration),
    physicalActivity: student.work_study_hours && student.work_study_hours > 6 ? 'Low' : 'Moderate',
    dietQuality: getDietQuality(student.dietary_habits),
    socialSupport: 5 - Number(stressLevel), // Inverse relationship
    substanceUse: 'Never',
    familyHistory: student.family_his_of_mental_illness || 'No',
    chronicIllness: 'No',
    financialStress: Number(financialStress),
    semesterCreditLoad: student.work_study_hours ?? 15
  };
}

export function transformStudentsToMentalHealthRecords(
  students: StudentWithHealthData[]
): FrontendMentalHealthRecord[] {
  return students
    .map(transformStudentToMentalHealthRecord)
    .filter((record): record is FrontendMentalHealthRecord => record !== null);
}

