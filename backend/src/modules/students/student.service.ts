import type { Prisma, UserRole } from '@prisma/client';
import { SessionStatus } from '@prisma/client';

import type {
  CreateStudentInput,
  ListStudentsQuery,
  UpdateStudentInput,
  ImportStudentsQuery
} from './student.schema';
import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { buildPaginationMeta, parsePagination } from '../../utils/pagination';
import { createAuditLog, toStudentResponse } from '../common';

interface RequestContext {
  userId: string;
  role: UserRole;
  ip?: string;
  userAgent?: string;
}

const consultantSelect = {
  id: true,
  fullName: true,
  email: true
} as const;

type StudentWithConsultant = Prisma.StudentGetPayload<{
  include: { consultant: { select: typeof consultantSelect } };
}>;

function canManageStudent(role: UserRole): boolean {
  return role === 'admin' || role === 'consultant';
}

function canEditStudent(role: UserRole, ownsStudent: boolean): boolean {
  if (role === 'admin') return true;
  if (role === 'consultant' && ownsStudent) return true;
  return false;
}

export async function listStudents(query: ListStudentsQuery, context: RequestContext) {
  const { page, limit } = parsePagination(query);

  const where: Prisma.StudentWhereInput = {};

  if (query.riskLevel) {
    where.riskLevel = query.riskLevel;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    const searchFilter = {
      contains: query.search,
      mode: 'insensitive' as const
    };

    where.OR = [
      { name: searchFilter },
      { studentId: searchFilter },
      { email: searchFilter }
    ];
  }

  if (context.role === 'consultant') {
    where.consultantId = context.userId;
  } else if (!['teacher_supervisor', 'data_scientist', 'admin'].includes(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  let orderBy: Prisma.StudentOrderByWithRelationInput = { createdAt: 'desc' };
  const direction: 'asc' | 'desc' = query.order ?? 'desc';
  switch (query.sortBy) {
    case 'name':
      orderBy = { name: query.order ?? 'asc' };
      break;
    case 'riskScore':
      orderBy = { riskScore: direction };
      break;
    case 'lastAssessment':
      orderBy = { lastAssessment: direction };
      break;
    default:
      break;
  }

  const [students, total] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      include: {
        consultant: {
          select: consultantSelect
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy
    }),
    prisma.student.count({ where })
  ]);

  const studentsWithConsultant = students as StudentWithConsultant[];

  return {
    students: studentsWithConsultant.map((student) => ({
      ...toStudentResponse(student),
      consultant: student.consultant
        ? {
            id: student.consultant.id,
            fullName: student.consultant.fullName,
            email: student.consultant.email
          }
        : null
    })),
    pagination: buildPaginationMeta(total, { page, limit })
  };
}

export async function getStudentById(id: string, context: RequestContext) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      consultant: {
        select: consultantSelect
      }
    }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  const studentWithConsultant = student as StudentWithConsultant;

  if (context.role === 'consultant' && student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  if (!['admin', 'consultant', 'teacher_supervisor', 'data_scientist'].includes(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const [recentRecords, upcomingSessions] = await prisma.$transaction([
    prisma.mentalHealthRecord.findMany({
      where: { studentId: id },
      orderBy: { assessmentDate: 'desc' },
      take: 5
    }),
    prisma.counselingSession.findMany({
      where: {
        studentId: id,
        sessionDate: {
          gte: new Date()
        },
        status: SessionStatus.scheduled
      },
      orderBy: { sessionDate: 'asc' },
      take: 5
    })
  ]);

  return {
    ...toStudentResponse(studentWithConsultant),
    consultant: studentWithConsultant.consultant
      ? {
          id: studentWithConsultant.consultant.id,
          fullName: studentWithConsultant.consultant.fullName,
          email: studentWithConsultant.consultant.email
        }
      : null,
    recentRecords,
    upcomingSessions
  };
}

async function ensureConsultant(consultantId: string) {
  const consultant = await prisma.user.findFirst({
    where: {
      id: consultantId,
      role: 'consultant'
    }
  });

  if (!consultant) {
    throw new AppError('Consultant not found', HTTP_STATUS.BAD_REQUEST);
  }
}

export async function createStudent(input: CreateStudentInput, context: RequestContext) {
  if (!canManageStudent(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const [existingStudentId, existingEmail] = await prisma.$transaction([
    prisma.student.findUnique({ where: { studentId: input.studentId } }),
    prisma.student.findUnique({ where: { email: input.email } })
  ]);

  if (existingStudentId) {
    throw new AppError('studentId already exists', HTTP_STATUS.CONFLICT);
  }

  if (existingEmail) {
    throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
  }

  const data = { ...input };

  if (context.role === 'consultant') {
    data.consultantId = context.userId;
  } else if (data.consultantId) {
    await ensureConsultant(data.consultantId);
  }

  const student = await prisma.student.create({
    data
  });

  await createAuditLog({
    userId: context.userId,
    action: 'student.create',
    resource: student.id,
    metadata: { studentId: student.studentId },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return toStudentResponse(student);
}

export async function updateStudent(
  id: string,
  input: UpdateStudentInput,
  context: RequestContext
) {
  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  if (!canEditStudent(context.role, student.consultantId === context.userId)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  if (input.email && input.email !== student.email) {
    const existingEmail = await prisma.student.findFirst({
      where: {
        email: input.email,
        NOT: { id }
      }
    });
    if (existingEmail) {
      throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
    }
  }

  if (input.consultantId) {
    if (context.role !== 'admin') {
      throw new AppError('Only admins can reassign consultant', HTTP_STATUS.FORBIDDEN);
    }
    await ensureConsultant(input.consultantId);
  } else if (input.consultantId === null) {
    if (context.role !== 'admin') {
      throw new AppError('Only admins can unassign consultant', HTTP_STATUS.FORBIDDEN);
    }
  }

  const updated = await prisma.student.update({
    where: { id },
    data: input
  });

  await createAuditLog({
    userId: context.userId,
    action: 'student.update',
    resource: id,
    ip: context.ip,
    userAgent: context.userAgent,
    metadata: { updatedFields: Object.keys(input) }
  });

  return toStudentResponse(updated);
}

export async function deleteStudent(id: string, context: RequestContext) {
  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  if (!canEditStudent(context.role, student.consultantId === context.userId)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  await prisma.student.delete({
    where: { id }
  });

  await createAuditLog({
    userId: context.userId,
    action: 'student.delete',
    resource: id,
    ip: context.ip,
    userAgent: context.userAgent
  });
}

function parseCsv(content: string): Array<Record<string, string>> {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0]
    .split(',')
    .map((h) => h.trim().replace(/^\uFEFF/, '')); // strip BOM if present
  const rows: Array<Record<string, string>> = [];
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    const cols = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < raw.length; c++) {
      const ch = raw[c];
      if (ch === '"' && raw[c + 1] === '"') {
        current += '"';
        c++;
      } else if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current);
    const record: Record<string, string> = {};
    header.forEach((h, idx) => {
      record[h] = (cols[idx] ?? '').trim();
    });
    rows.push(record);
  }
  return rows;
}

export async function importStudentsFromCsv(
  fileBuffer: Buffer,
  query: ImportStudentsQuery,
  context: RequestContext
) {
  if (!canManageStudent(context.role)) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const csvText = fileBuffer.toString('utf8');
  const rows = parseCsv(csvText);

  const result = {
    total: rows.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [] as Array<{ row: number; error: string }>
  };

  const wantUpsert = query.upsert ?? true;
  const assignConsultantId =
    context.role === 'consultant' ? context.userId : query.consultantId ?? null;

  if (assignConsultantId && context.role === 'admin' && query.consultantId) {
    await ensureConsultant(query.consultantId);
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    try {
      const studentId = r.studentId || r.student_id || r.mssv;
      const name = r.name || `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim();
      const email = r.email;

      if (!studentId || !name || !email) {
        throw new Error('Missing required fields: studentId, name, email');
      }

      const toInt = (v?: string) =>
        v && v.length > 0 ? Number.parseInt(v, 10) : undefined;
      const toFloat = (v?: string) =>
        v && v.length > 0 ? Number.parseFloat(v) : undefined;

      const payload: Prisma.StudentUncheckedCreateInput = {
        studentId,
        name,
        email,
        phone: r.phone || r.phoneNumber || undefined,
        department: r.department || r.major || undefined,
        year: toInt(r.year),
        avatarUrl: r.avatarUrl || undefined,
        stressLevel: toInt(r.stressLevel),
        sleepHours: toFloat(r.sleepHours) as any,
        riskScore: toInt(r.riskScore),
        riskLevel: (r.riskLevel as any) ?? undefined,
        status: (r.status as any) ?? undefined,
        consultantId: assignConsultantId ?? undefined
      };

      if (wantUpsert) {
        const existing =
          (await prisma.student.findUnique({ where: { studentId } })) ||
          (await prisma.student.findUnique({ where: { email } }));
        if (existing) {
          await prisma.student.update({
            where: { id: existing.id },
            data: {
              ...payload,
              // Do not change consultantId if current user is consultant
              consultantId:
                context.role === 'consultant'
                  ? context.userId
                  : payload.consultantId
            }
          });
          result.updated++;
          continue;
        }
      } else {
        const dupById = await prisma.student.findUnique({
          where: { studentId }
        });
        const dupByEmail = await prisma.student.findUnique({
          where: { email }
        });
        if (dupById || dupByEmail) {
          throw new Error('Duplicate studentId or email');
        }
      }

      await prisma.student.create({ data: payload });
      result.created++;
    } catch (e: any) {
      result.failed++;
      result.errors.push({ row: i + 2, error: e?.message ?? 'Unknown error' }); // +2 accounts for header and 1-based
    }
  }

  await createAuditLog({
    userId: context.userId,
    action: 'student.import',
    resource: 'students',
    metadata: {
      total: result.total,
      created: result.created,
      updated: result.updated,
      failed: result.failed
    },
    ip: context.ip,
    userAgent: context.userAgent
  });

  return result;
}

