export interface MentalHealthRecord {
  id: string;
  studentName: string;
  age: number;
  course: string;
  stressLevel: number; // 0-5
  moodRating: number; // 1-5
  sleepHours: number;
  counselingSessions: number;
  lastCheckIn: string;
  riskLevel: "low" | "moderate" | "high";
  notes: string;
  // Extended mental health metrics
  depressionScore: number; // 0-5
  anxietyScore: number; // 0-5
  sleepQuality: "Poor" | "Fair" | "Good" | "Excellent";
  physicalActivity: "Low" | "Moderate" | "High";
  dietQuality: "Poor" | "Fair" | "Good" | "Excellent";
  socialSupport: number; // 0-5
  substanceUse: "Never" | "Occasionally" | "Frequently";
  familyHistory: "Yes" | "No";
  chronicIllness: "Yes" | "No";
  financialStress: number; // 0-5
  semesterCreditLoad: number; // 15-30
}

export interface WellnessActivity {
  id: string;
  title: string;
  category: string;
  participants: number;
  nextSession: string;
}

export interface SupportResource {
  id: string;
  title: string;
  type: string;
  availability: string;
  contact: string;
}

export const mockMentalHealthRecords: MentalHealthRecord[] = [
  {
    id: "1",
    studentName: "Duong Gia An",
    age: 24,
    course: "Computer Science",
    stressLevel: 4,
    moodRating: 3,
    sleepHours: 5.5,
    counselingSessions: 2,
    lastCheckIn: "2025-10-28",
    riskLevel: "moderate",
    notes: "Exam stress, recommended mindfulness sessions",
    depressionScore: 3,
    anxietyScore: 4,
    sleepQuality: "Fair",
    physicalActivity: "Low",
    dietQuality: "Fair",
    socialSupport: 3,
    substanceUse: "Occasionally",
    familyHistory: "Yes",
    chronicIllness: "No",
    financialStress: 4,
    semesterCreditLoad: 18
  },
  {
    id: "2",
    studentName: "Huynh Duc Nham",
    age: 23,
    course: "Computer Science",
    stressLevel: 3,
    moodRating: 4,
    sleepHours: 7,
    counselingSessions: 1,
    lastCheckIn: "2025-10-30",
    riskLevel: "low",
    notes: "Positive progress, maintaining wellness routine",
    depressionScore: 1,
    anxietyScore: 2,
    sleepQuality: "Good",
    physicalActivity: "Moderate",
    dietQuality: "Good",
    socialSupport: 4,
    substanceUse: "Never",
    familyHistory: "No",
    chronicIllness: "No",
    financialStress: 2,
    semesterCreditLoad: 16
  },
  {
    id: "3",
    studentName: "Vo Duong Xuan Nguyen",
    age: 23,
    course: "Computer Science",
    stressLevel: 5,
    moodRating: 2,
    sleepHours: 4,
    counselingSessions: 3,
    lastCheckIn: "2025-11-01",
    riskLevel: "high",
    notes: "Academic pressure, recommended weekly counseling",
    depressionScore: 4,
    anxietyScore: 5,
    sleepQuality: "Poor",
    physicalActivity: "Low",
    dietQuality: "Poor",
    socialSupport: 2,
    substanceUse: "Frequently",
    familyHistory: "Yes",
    chronicIllness: "Yes",
    financialStress: 5,
    semesterCreditLoad: 21
  },
  {
    id: "4",
    studentName: "Nguyen Van Teo",
    age: 21,
    course: "Mechanical",
    stressLevel: 2,
    moodRating: 4,
    sleepHours: 8,
    counselingSessions: 0,
    lastCheckIn: "2025-10-25",
    riskLevel: "low",
    notes: "Excellent mental health, engaged in sports",
    depressionScore: 0,
    anxietyScore: 1,
    sleepQuality: "Excellent",
    physicalActivity: "High",
    dietQuality: "Excellent",
    socialSupport: 5,
    substanceUse: "Never",
    familyHistory: "No",
    chronicIllness: "No",
    financialStress: 1,
    semesterCreditLoad: 15
  },
  {
    id: "5",
    studentName: "Le Thi Be",
    age: 22,
    course: "Electrical",
    stressLevel: 4,
    moodRating: 3,
    sleepHours: 6,
    counselingSessions: 2,
    lastCheckIn: "2025-11-02",
    riskLevel: "moderate",
    notes: "Social anxiety, participating in group therapy",
    depressionScore: 3,
    anxietyScore: 4,
    sleepQuality: "Fair",
    physicalActivity: "Moderate",
    dietQuality: "Good",
    socialSupport: 2,
    substanceUse: "Occasionally",
    familyHistory: "No",
    chronicIllness: "No",
    financialStress: 3,
    semesterCreditLoad: 17
  },
  {
    id: "6",
    studentName: "Truong Van Tuan",
    age: 25,
    course: "Electrical",
    stressLevel: 2,
    moodRating: 5,
    sleepHours: 7.5,
    counselingSessions: 1,
    lastCheckIn: "2025-11-03",
    riskLevel: "low",
    notes: "Improved significantly, peer mentor",
    depressionScore: 1,
    anxietyScore: 1,
    sleepQuality: "Good",
    physicalActivity: "High",
    dietQuality: "Excellent",
    socialSupport: 5,
    substanceUse: "Never",
    familyHistory: "No",
    chronicIllness: "No",
    financialStress: 1,
    semesterCreditLoad: 16
  },
  {
    id: "7",
    studentName: "Huynh Thi Ngoc",
    age: 23,
    course: "Environmental",
    stressLevel: 4,
    moodRating: 3,
    sleepHours: 5,
    counselingSessions: 2,
    lastCheckIn: "2025-11-04",
    riskLevel: "moderate",
    notes: "Work-life balance issues, recommended time management",
    depressionScore: 3,
    anxietyScore: 3,
    sleepQuality: "Fair",
    physicalActivity: "Low",
    dietQuality: "Fair",
    socialSupport: 3,
    substanceUse: "Occasionally",
    familyHistory: "Yes",
    chronicIllness: "No",
    financialStress: 4,
    semesterCreditLoad: 19
  }
];

export const wellnessActivities: WellnessActivity[] = [
  {
    id: "1",
    title: "Meditation & Mindfulness",
    category: "Stress Relief",
    participants: 24,
    nextSession: "Nov 5, 2025 - 2:00 PM"
  },
  {
    id: "2",
    title: "Yoga for Students",
    category: "Physical Wellness",
    participants: 18,
    nextSession: "Nov 6, 2025 - 9:00 AM"
  },
  {
    id: "3",
    title: "Art Therapy Workshop",
    category: "Creative Expression",
    participants: 15,
    nextSession: "Nov 7, 2025 - 3:00 PM"
  },
  {
    id: "4",
    title: "Peer Support Circle",
    category: "Community",
    participants: 22,
    nextSession: "Nov 5, 2025 - 5:00 PM"
  }
];

export const supportResources: SupportResource[] = [
  {
    id: "1",
    title: "24/7 Crisis Hotline",
    type: "Emergency",
    availability: "Available 24/7",
    contact: "1-800-MENTAL-H"
  },
  {
    id: "2",
    title: "Campus Counseling Center",
    type: "Professional Support",
    availability: "Mon-Fri, 9AM-5PM",
    contact: "counseling@university.edu"
  },
  {
    id: "3",
    title: "Online Therapy Platform",
    type: "Digital Support",
    availability: "Schedule anytime",
    contact: "therapy.university.edu"
  },
  {
    id: "4",
    title: "Student Wellness App",
    type: "Self-Help",
    availability: "24/7 Access",
    contact: "Download from app store"
  }
];
