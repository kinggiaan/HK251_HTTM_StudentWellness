import { SessionStatus, UserRole } from '@prisma/client';
import dayjs from 'dayjs';

import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { createAuditLog, toSessionResponse } from '../common';
import type { CreateSessionInput, ListSessionsQuery, UpdateSessionInput } from './sessions.schema';

interface RequestContext {
  userId: string;
  role: UserRole;
  ip?: string;
  userAgent?: string;
}

function canManageSessions(role: UserRole): boolean {
  return role === 'admin' || role === 'consultant';
}

export async function listSessions(query: ListSessionsQuery, context: RequestContext) {
  const where: {
    studentId?: string;
    consultantId?: string;
    status?: SessionStatus;
    sessionDate?: {
      gte?: Date;
      lte?: Date;
    };
  } = {};

  // RBAC: Consultant chỉ thấy sessions của mình
  if (context.role === 'consultant') {
    where.consultantId = context.userId;
  } else if (query.consultantId) {
    where.consultantId = query.consultantId;
  }

  if (query.studentId) {
    where.studentId = query.studentId;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.from || query.to) {
    where.sessionDate = {};
    if (query.from) {
      where.sessionDate.gte = dayjs(query.from).startOf('day').toDate();
    }
    if (query.to) {
      where.sessionDate.lte = dayjs(query.to).endOf('day').toDate();
    }
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    prisma.counselingSession.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            name: true,
            email: true
          }
        },
        consultant: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        sessionDate: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.counselingSession.count({ where })
  ]);

  return {
    data: sessions.map((session) => ({
      ...toSessionResponse(session),
      student: session.student,
      consultant: session.consultant
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getSessionById(id: string, context: RequestContext) {
  const session = await prisma.counselingSession.findUnique({
    where: { id },
    include: {
      student: true,
      consultant: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });

  if (!session) {
    throw new AppError('Session not found', HTTP_STATUS.NOT_FOUND);
  }

  // RBAC: Consultant chỉ thấy sessions của mình
  if (context.role === 'consultant' && session.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  return {
    ...toSessionResponse(session),
    student: session.student,
    consultant: session.consultant
  };
}

export async function createSession(input: CreateSessionInput, context: RequestContext) {
  if (!canManageSessions(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { id: input.studentId }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  // RBAC: Consultant chỉ có thể tạo sessions cho students được assign
  const consultantId = input.consultantId ?? context.userId;
  if (context.role === 'consultant' && consultantId !== context.userId) {
    throw new AppError('Forbidden: Cannot assign session to another consultant', HTTP_STATUS.FORBIDDEN);
  }

  if (context.role === 'consultant' && student.consultantId !== context.userId) {
    throw new AppError('Forbidden: Not assigned to this student', HTTP_STATUS.FORBIDDEN);
  }

  // Check if consultant exists
  const consultant = await prisma.user.findUnique({
    where: { id: consultantId }
  });

  if (!consultant || (consultant.role !== 'consultant' && consultant.role !== 'admin')) {
    throw new AppError('Invalid consultant', HTTP_STATUS.BAD_REQUEST);
  }

  const session = await prisma.counselingSession.create({
    data: {
      studentId: input.studentId,
      consultantId,
      sessionDate: input.sessionDate,
      duration: input.duration,
      sessionType: input.sessionType,
      status: 'scheduled',
      topic: input.topic,
      notes: input.notes,
      followUpRequired: input.followUpRequired ?? false,
      followUpDate: input.followUpDate,
      preSessionStress: input.preSessionStress,
      postSessionStress: input.postSessionStress,
      sessionOutcome: input.sessionOutcome
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'session.create',
    resource: session.id,
    metadata: { studentId: input.studentId, consultantId },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return toSessionResponse(session);
}

export async function updateSession(id: string, input: UpdateSessionInput, context: RequestContext) {
  if (!canManageSessions(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const session = await prisma.counselingSession.findUnique({
    where: { id },
    include: {
      student: true
    }
  });

  if (!session) {
    throw new AppError('Session not found', HTTP_STATUS.NOT_FOUND);
  }

  // RBAC: Consultant chỉ có thể update sessions của mình
  if (context.role === 'consultant' && session.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const updatedSession = await prisma.counselingSession.update({
    where: { id },
    data: {
      sessionDate: input.sessionDate,
      duration: input.duration,
      sessionType: input.sessionType,
      status: input.status,
      topic: input.topic,
      notes: input.notes,
      followUpRequired: input.followUpRequired,
      followUpDate: input.followUpDate,
      preSessionStress: input.preSessionStress,
      postSessionStress: input.postSessionStress,
      sessionOutcome: input.sessionOutcome
    }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'session.update',
    resource: id,
    metadata: input,
    ip: context.ip,
    userAgent: context.userAgent
  });

  return toSessionResponse(updatedSession);
}

export async function deleteSession(id: string, context: RequestContext) {
  if (!canManageSessions(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const session = await prisma.counselingSession.findUnique({
    where: { id }
  });

  if (!session) {
    throw new AppError('Session not found', HTTP_STATUS.NOT_FOUND);
  }

  // RBAC: Consultant chỉ có thể delete sessions của mình
  if (context.role === 'consultant' && session.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  await prisma.counselingSession.delete({
    where: { id }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'session.delete',
    resource: id,
    metadata: { studentId: session.studentId },
    ip: context.ip,
    userAgent: context.userAgent
  });
}

