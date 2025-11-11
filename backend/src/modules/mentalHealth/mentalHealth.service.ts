import type { RiskLevel, UserRole } from '@prisma/client';

import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { createAuditLog, toMentalHealthRecordResponse } from '../common';
import type {
  CreateHealthRecordInput,
  ListHealthRecordsQuery,
  UpdateHealthRecordInput
} from './mentalHealth.schema';

interface RequestContext {
  userId: string;
  role: UserRole;
  ip?: string;
  userAgent?: string;
}

function calculateRiskScore(
  stressLevel: number,
  anxietyLevel: number,
  depressionLevel: number,
  sleepHours: number,
  sleepQuality: number
): { riskScore: number; riskLevel: RiskLevel } {
  // Weighted calculation
  const stressWeight = 0.3;
  const anxietyWeight = 0.25;
  const depressionWeight = 0.25;
  const sleepHoursWeight = 0.1;
  const sleepQualityWeight = 0.1;

  const sleepHoursScore = Math.max(0, (8 - sleepHours) * 2); // Penalty for less sleep
  const sleepQualityScore = 10 - sleepQuality; // Lower quality = higher risk

  const riskScore = Math.round(
    stressLevel * stressWeight * 10 +
      anxietyLevel * anxietyWeight * 10 +
      depressionLevel * depressionWeight * 10 +
      sleepHoursScore * sleepHoursWeight * 10 +
      sleepQualityScore * sleepQualityWeight * 10
  );

  let riskLevel: RiskLevel;
  if (riskScore >= 80) {
    riskLevel = 'critical';
  } else if (riskScore >= 60) {
    riskLevel = 'high';
  } else if (riskScore >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  return { riskScore: Math.min(100, Math.max(0, riskScore)), riskLevel };
}

function canManageHealthRecord(role: UserRole): boolean {
  return role === 'admin' || role === 'consultant';
}

export async function listHealthRecords(
  studentId: string,
  query: ListHealthRecordsQuery,
  context: RequestContext
) {
  // Check if student exists and user has access
  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check access permissions
  if (context.role === 'consultant' && student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  if (!['admin', 'consultant', 'teacher_supervisor', 'data_scientist'].includes(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const where: {
    studentId: string;
    assessmentDate?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    studentId
  };

  if (query.from || query.to) {
    where.assessmentDate = {};
    if (query.from) {
      where.assessmentDate.gte = query.from;
    }
    if (query.to) {
      where.assessmentDate.lte = query.to;
    }
  }

  const limit = query.limit ?? 50;

  const records = await prisma.mentalHealthRecord.findMany({
    where,
    orderBy: {
      assessmentDate: 'desc'
    },
    take: limit
  });

  return records.map(toMentalHealthRecordResponse);
}

export async function getHealthRecordById(
  id: string,
  context: RequestContext
) {
  const record = await prisma.mentalHealthRecord.findUnique({
    where: { id },
    include: {
      student: true
    }
  });

  if (!record) {
    throw new AppError('Health record not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check access permissions
  if (context.role === 'consultant' && record.student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  if (!['admin', 'consultant', 'teacher_supervisor', 'data_scientist'].includes(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  return toMentalHealthRecordResponse(record);
}

export async function createHealthRecord(
  studentId: string,
  input: CreateHealthRecordInput,
  context: RequestContext
) {
  if (!canManageHealthRecord(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  // Check if student exists and consultant has access
  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  if (context.role === 'consultant' && student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  // Calculate risk score and level
  const { riskScore, riskLevel } = calculateRiskScore(
    input.stressLevel,
    input.anxietyLevel,
    input.depressionLevel,
    Number(input.sleepHours),
    input.sleepQuality
  );

  const assessmentDate = input.assessmentDate ?? new Date();

  const record = await prisma.mentalHealthRecord.create({
    data: {
      studentId,
      stressLevel: input.stressLevel,
      anxietyLevel: input.anxietyLevel,
      depressionLevel: input.depressionLevel,
      sleepHours: input.sleepHours,
      sleepQuality: input.sleepQuality,
      riskScore,
      riskLevel,
      assessmentDate,
      assessmentType: input.assessmentType,
      notes: input.notes,
      predictedRisk: input.predictedRisk,
      modelVersion: input.modelVersion
    }
  });

  // Update student's latest metrics
  await prisma.student.update({
    where: { id: studentId },
    data: {
      stressLevel: input.stressLevel,
      sleepHours: input.sleepHours,
      riskScore,
      riskLevel,
      lastAssessment: assessmentDate
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'mental_health_record.create',
    resource: record.id,
    ip: context.ip,
    userAgent: context.userAgent
  });

  return toMentalHealthRecordResponse(record);
}

export async function updateHealthRecord(
  id: string,
  input: UpdateHealthRecordInput,
  context: RequestContext
) {
  if (!canManageHealthRecord(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const existingRecord = await prisma.mentalHealthRecord.findUnique({
    where: { id },
    include: {
      student: true
    }
  });

  if (!existingRecord) {
    throw new AppError('Health record not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check access permissions
  if (context.role === 'consultant' && existingRecord.student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  // Recalculate risk if metrics changed
  const stressLevel = input.stressLevel ?? existingRecord.stressLevel;
  const anxietyLevel = input.anxietyLevel ?? existingRecord.anxietyLevel;
  const depressionLevel = input.depressionLevel ?? existingRecord.depressionLevel;
  const sleepHours = input.sleepHours ?? Number(existingRecord.sleepHours);
  const sleepQuality = input.sleepQuality ?? existingRecord.sleepQuality;

  const { riskScore, riskLevel } = calculateRiskScore(
    stressLevel,
    anxietyLevel,
    depressionLevel,
    Number(sleepHours),
    sleepQuality
  );

  const updateData: Record<string, unknown> = {
    ...(input.stressLevel !== undefined && { stressLevel: input.stressLevel }),
    ...(input.anxietyLevel !== undefined && { anxietyLevel: input.anxietyLevel }),
    ...(input.depressionLevel !== undefined && { depressionLevel: input.depressionLevel }),
    ...(input.sleepHours !== undefined && { sleepHours: input.sleepHours }),
    ...(input.sleepQuality !== undefined && { sleepQuality: input.sleepQuality }),
    ...(input.assessmentType !== undefined && { assessmentType: input.assessmentType }),
    ...(input.assessmentDate !== undefined && { assessmentDate: input.assessmentDate }),
    ...(input.notes !== undefined && { notes: input.notes }),
    ...(input.predictedRisk !== undefined && { predictedRisk: input.predictedRisk }),
    ...(input.modelVersion !== undefined && { modelVersion: input.modelVersion }),
    riskScore,
    riskLevel
  };

  const record = await prisma.mentalHealthRecord.update({
    where: { id },
    data: updateData
  });

  // Update student's latest metrics if this is the most recent record
  const latestRecord = await prisma.mentalHealthRecord.findFirst({
    where: { studentId: existingRecord.studentId },
    orderBy: { assessmentDate: 'desc' }
  });

  if (latestRecord?.id === id) {
    await prisma.student.update({
      where: { id: existingRecord.studentId },
      data: {
        stressLevel: stressLevel,
        sleepHours: sleepHours,
        riskScore,
        riskLevel,
        lastAssessment: input.assessmentDate ?? existingRecord.assessmentDate
      }
    });
  }

  await createAuditLog({
    userId: context.userId,
    action: 'mental_health_record.update',
    resource: id,
    ip: context.ip,
    userAgent: context.userAgent
  });

  return toMentalHealthRecordResponse(record);
}

export async function deleteHealthRecord(id: string, context: RequestContext) {
  if (!canManageHealthRecord(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const record = await prisma.mentalHealthRecord.findUnique({
    where: { id },
    include: {
      student: true
    }
  });

  if (!record) {
    throw new AppError('Health record not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check access permissions
  if (context.role === 'consultant' && record.student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  await prisma.mentalHealthRecord.delete({
    where: { id }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'mental_health_record.delete',
    resource: id,
    ip: context.ip,
    userAgent: context.userAgent
  });
}

