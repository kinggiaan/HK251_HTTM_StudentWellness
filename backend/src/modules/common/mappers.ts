import type {
  CounselingSession,
  MentalHealthRecord,
  Notification,
  Student,
  User
} from '@prisma/client';

export function toUserResponse(user: User) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin
  };
}

export function toStudentResponse(student: Student) {
  return {
    id: student.id,
    studentId: student.studentId,
    name: student.name,
    email: student.email,
    phone: student.phone,
    department: student.department,
    year: student.year,
    avatarUrl: student.avatarUrl,
    stressLevel: student.stressLevel,
    sleepHours: student.sleepHours,
    riskScore: student.riskScore,
    riskLevel: student.riskLevel,
    status: student.status,
    consultantId: student.consultantId,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
    lastAssessment: student.lastAssessment
  };
}

export function toMentalHealthRecordResponse(record: MentalHealthRecord) {
  return {
    id: record.id,
    studentId: record.studentId,
    stressLevel: record.stressLevel,
    anxietyLevel: record.anxietyLevel,
    depressionLevel: record.depressionLevel,
    sleepHours: record.sleepHours,
    sleepQuality: record.sleepQuality,
    riskScore: record.riskScore,
    riskLevel: record.riskLevel,
    assessmentDate: record.assessmentDate,
    assessmentType: record.assessmentType,
    notes: record.notes,
    predictedRisk: record.predictedRisk,
    modelVersion: record.modelVersion,
    createdAt: record.createdAt
  };
}

export function toSessionResponse(session: CounselingSession) {
  return {
    id: session.id,
    studentId: session.studentId,
    consultantId: session.consultantId,
    sessionDate: session.sessionDate,
    duration: session.duration,
    sessionType: session.sessionType,
    status: session.status,
    topic: session.topic,
    notes: session.notes,
    followUpRequired: session.followUpRequired,
    followUpDate: session.followUpDate,
    preSessionStress: session.preSessionStress,
    postSessionStress: session.postSessionStress,
    sessionOutcome: session.sessionOutcome,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt
  };
}

export function toNotificationResponse(notification: Notification) {
  return {
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    category: notification.category,
    title: notification.title,
    message: notification.message,
    priority: notification.priority,
    relatedStudentId: notification.relatedStudentId,
    relatedSessionId: notification.relatedSessionId,
    read: notification.read,
    dismissed: notification.dismissed,
    createdAt: notification.createdAt,
    readAt: notification.readAt
  };
}

