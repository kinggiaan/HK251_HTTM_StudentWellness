export interface Notification {
  id: string;
  type: "model" | "student" | "system" | "alert";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  relatedTo?: string; // student name or model name
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "model",
    title: "ML Model Training Completed",
    message: "Mental health prediction model v2.3 has been successfully trained with 94.2% accuracy. Ready for deployment.",
    timestamp: "2025-11-09T08:30:00",
    isRead: false,
    priority: "high",
    relatedTo: "Model v2.3"
  },
  {
    id: "0",
    type: "model",
    title: "Model Performance Alert",
    message: "Model accuracy dropped to 92.1%. Dataset imbalance detected. Consider retraining with balanced sampling.",
    timestamp: "2025-11-09T09:00:00",
    isRead: false,
    priority: "high",
    relatedTo: "Model v2.2"
  },
  {
    id: "2",
    type: "student",
    title: "High Risk Student Identified",
    message: "Vo Duong Xuan Nguyen has been flagged as high risk. Immediate counseling session recommended.",
    timestamp: "2025-11-09T07:15:00",
    isRead: false,
    priority: "high",
    relatedTo: "Vo Duong Xuan Nguyen"
  },
  {
    id: "3",
    type: "student",
    title: "Student Profile Updated",
    message: "Mental health assessment for Duong Gia An has been updated. Stress level decreased from 4 to 3.",
    timestamp: "2025-11-08T16:45:00",
    isRead: false,
    priority: "medium",
    relatedTo: "Duong Gia An"
  },
  {
    id: "4",
    type: "system",
    title: "Weekly Report Available",
    message: "Your weekly mental health summary report for Nov 3-9 is now available for review.",
    timestamp: "2025-11-08T09:00:00",
    isRead: true,
    priority: "low"
  },
  {
    id: "5",
    type: "model",
    title: "Dataset Update Required",
    message: "New student data detected. Re-training model recommended to maintain accuracy.",
    timestamp: "2025-11-07T14:20:00",
    isRead: true,
    priority: "medium",
    relatedTo: "Model v2.3"
  },
  {
    id: "6",
    type: "alert",
    title: "Counseling Session Scheduled",
    message: "3 high-priority counseling sessions have been scheduled for this week.",
    timestamp: "2025-11-07T10:00:00",
    isRead: true,
    priority: "medium"
  },
  {
    id: "7",
    type: "student",
    title: "Student Progress Milestone",
    message: "Truong Van Tuan has completed 5 counseling sessions with positive improvement trends.",
    timestamp: "2025-11-06T15:30:00",
    isRead: true,
    priority: "low",
    relatedTo: "Truong Van Tuan"
  }
];
