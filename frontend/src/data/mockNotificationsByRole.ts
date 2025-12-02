import { Notification } from "./mockNotifications";

// Notifications specific to each role
export const consultantNotifications: Notification[] = [
  {
    id: "c1",
    type: "student",
    title: "Urgent: High Risk Student Alert",
    message: "Vo Duong Xuan Nguyen shows signs of severe stress and anxiety. Immediate intervention recommended.",
    timestamp: "2025-11-09T08:30:00",
    isRead: false,
    priority: "high",
    relatedTo: "Vo Duong Xuan Nguyen"
  },
  {
    id: "c2",
    type: "alert",
    title: "Counseling Session Reminder",
    message: "You have 2 scheduled counseling sessions today at 2:00 PM and 4:00 PM.",
    timestamp: "2025-11-09T07:00:00",
    isRead: false,
    priority: "medium"
  },
  {
    id: "c3",
    type: "student",
    title: "Positive Progress Update",
    message: "Duong Gia An has completed 4 consecutive sessions with improved stress management scores.",
    timestamp: "2025-11-08T16:45:00",
    isRead: false,
    priority: "low",
    relatedTo: "Duong Gia An"
  },
  {
    id: "c4",
    type: "system",
    title: "Monthly Report Available",
    message: "Your October mental health consultation summary is ready for review.",
    timestamp: "2025-11-08T09:00:00",
    isRead: true,
    priority: "low"
  },
  {
    id: "c5",
    type: "student",
    title: "Follow-up Required",
    message: "Huynh Thi Ngoc missed her last scheduled appointment. Please follow up.",
    timestamp: "2025-11-07T14:20:00",
    isRead: true,
    priority: "medium",
    relatedTo: "Huynh Thi Ngoc"
  }
];

export const teacherNotifications: Notification[] = [
  {
    id: "t1",
    type: "model",
    title: "ML Model Update Notification",
    message: "Mental health prediction model v2.3 has been deployed. Review updated risk assessments for your students.",
    timestamp: "2025-11-09T09:15:00",
    isRead: false,
    priority: "high",
    relatedTo: "Model v2.3"
  },
  {
    id: "t2",
    type: "student",
    title: "Student Risk Level Changed",
    message: "Vo Duong Xuan Nguyen's risk level increased from Moderate to High. Counseling referral recommended.",
    timestamp: "2025-11-09T08:00:00",
    isRead: false,
    priority: "high",
    relatedTo: "Vo Duong Xuan Nguyen"
  },
  {
    id: "t3",
    type: "system",
    title: "Weekly Student Summary",
    message: "7 students under your supervision. 1 high risk, 3 moderate risk, 3 low risk. View detailed report.",
    timestamp: "2025-11-09T06:00:00",
    isRead: false,
    priority: "medium"
  },
  {
    id: "t4",
    type: "alert",
    title: "Attendance Alert",
    message: "3 students have shown decreased attendance patterns that may indicate mental health concerns.",
    timestamp: "2025-11-08T15:30:00",
    isRead: true,
    priority: "medium"
  },
  {
    id: "t5",
    type: "student",
    title: "Student Profile Updated",
    message: "Mental health data has been updated for Truong Van Tuan. Review latest assessment.",
    timestamp: "2025-11-07T11:20:00",
    isRead: true,
    priority: "low",
    relatedTo: "Truong Van Tuan"
  }
];

export const dataScientistNotifications: Notification[] = [
  {
    id: "d1",
    type: "model",
    title: "Model Training Completed Successfully",
    message: "Mental health prediction model v2.3 training finished. Accuracy: 94.2%, Precision: 91.8%, Recall: 89.5%.",
    timestamp: "2025-11-09T08:30:00",
    isRead: false,
    priority: "high",
    relatedTo: "Model v2.3"
  },
  {
    id: "d2",
    type: "system",
    title: "New Dataset Available",
    message: "52 new student records added to the database. Recommend model retraining for improved accuracy.",
    timestamp: "2025-11-09T07:00:00",
    isRead: false,
    priority: "high"
  },
  {
    id: "d3",
    type: "model",
    title: "Feature Importance Update",
    message: "Sleep hours and financial stress now show highest correlation with mental health risk. Update feature weights.",
    timestamp: "2025-11-08T16:00:00",
    isRead: false,
    priority: "medium",
    relatedTo: "Model v2.3"
  },
  {
    id: "d4",
    type: "alert",
    title: "Data Quality Warning",
    message: "15% of recent entries have missing values for 'counseling sessions'. Data cleaning recommended.",
    timestamp: "2025-11-08T14:30:00",
    isRead: true,
    priority: "medium"
  },
  {
    id: "d5",
    type: "system",
    title: "Model Deployment Request",
    message: "Teachers have requested deployment of model v2.3. Review performance metrics before approval.",
    timestamp: "2025-11-07T10:00:00",
    isRead: true,
    priority: "medium"
  }
];

// Function to get notifications by role
export function getNotificationsByRole(role: string): Notification[] {
  switch (role.toLowerCase()) {
    case "consultant":
      return consultantNotifications;
    case "teacher":
    case "supervisor":
      return teacherNotifications;
    case "data scientist":
    case "datascientist":
      return dataScientistNotifications;
    default:
      return consultantNotifications;
  }
}
