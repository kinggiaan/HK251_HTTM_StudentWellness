import { RiskLevel, UserRole } from '@prisma/client';
import dayjs from 'dayjs';

import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import type { GetOverviewQuery, GetStudentStatsQuery, GetTrendsQuery } from './analytics.schema';

interface RequestContext {
  userId: string;
  role: UserRole;
}

function getDateRange(period: string) {
  const now = dayjs();
  let start: dayjs.Dayjs;

  switch (period) {
    case '7d':
      start = now.subtract(7, 'day');
      break;
    case '30d':
      start = now.subtract(30, 'day');
      break;
    case '90d':
      start = now.subtract(90, 'day');
      break;
    case '1y':
      start = now.subtract(1, 'year');
      break;
    default:
      start = now.subtract(30, 'day');
  }

  return { start: start.toDate(), end: now.toDate() };
}

function buildStudentWhere(consultantId?: string, contextRole?: UserRole, contextUserId?: string) {
  const where: { consultantId?: string } = {};

  if (contextRole === 'consultant') {
    where.consultantId = contextUserId;
  } else if (consultantId) {
    where.consultantId = consultantId;
  }

  return where;
}

export async function getOverview(query: GetOverviewQuery, context: RequestContext) {
  const studentWhere = buildStudentWhere(query.consultantId, context.role, context.userId);

  const [
    totalStudents,
    highRiskStudents,
    scheduledSessions,
    completedSessionsThisWeek,
    averageStressLevel,
    previousWeekAverageStress,
    previousWeekHighRiskCount
  ] = await Promise.all([
    // Total students
    prisma.student.count({
      where: studentWhere
    }),

    // High risk students (high + critical)
    prisma.student.count({
      where: {
        ...studentWhere,
        riskLevel: {
          in: ['high', 'critical']
        }
      }
    }),

    // Scheduled sessions
    prisma.counselingSession.count({
      where: {
        status: 'scheduled',
        ...(context.role === 'consultant' ? { consultantId: context.userId } : {})
      }
    }),

    // Completed sessions this week
    prisma.counselingSession.count({
      where: {
        status: 'completed',
        sessionDate: {
          gte: dayjs().startOf('week').toDate(),
          lte: dayjs().endOf('week').toDate()
        },
        ...(context.role === 'consultant' ? { consultantId: context.userId } : {})
      }
    }),

    // Average stress level
    prisma.mentalHealthRecord.aggregate({
      where: {
        student: studentWhere,
        assessmentDate: {
          gte: dayjs().subtract(30, 'day').toDate()
        }
      },
      _avg: {
        stressLevel: true
      }
    }),

    // Previous week average stress
    prisma.mentalHealthRecord.aggregate({
      where: {
        student: studentWhere,
        assessmentDate: {
          gte: dayjs().subtract(37, 'day').toDate(),
          lte: dayjs().subtract(30, 'day').toDate()
        }
      },
      _avg: {
        stressLevel: true
      }
    }),

    // Previous week high risk count
    prisma.student.count({
      where: {
        ...studentWhere,
        riskLevel: {
          in: ['high', 'critical']
        },
        updatedAt: {
          gte: dayjs().subtract(37, 'day').toDate(),
          lte: dayjs().subtract(30, 'day').toDate()
        }
      }
    })
  ]);

  const currentAvg = averageStressLevel._avg.stressLevel ?? 0;
  const previousAvg = previousWeekAverageStress._avg.stressLevel ?? 0;
  const stressLevelChange =
    previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0;

  const highRiskChange =
    previousWeekHighRiskCount > 0
      ? ((highRiskStudents - previousWeekHighRiskCount) / previousWeekHighRiskCount) * 100
      : 0;

  return {
    totalStudents,
    highRiskStudents,
    scheduledSessions,
    completedSessionsThisWeek,
    averageStressLevel: currentAvg,
    trends: {
      stressLevelChange: Math.round(stressLevelChange * 10) / 10,
      highRiskChange: Math.round(highRiskChange * 10) / 10
    }
  };
}

export async function getDistribution(query: GetOverviewQuery, context: RequestContext) {
  const studentWhere = buildStudentWhere(query.consultantId, context.role, context.userId);

  const [byRiskLevel, byDepartment] = await Promise.all([
    // Distribution by risk level
    prisma.student.groupBy({
      by: ['riskLevel'],
      where: {
        ...studentWhere,
        riskLevel: {
          not: null
        }
      },
      _count: {
        id: true
      }
    }),

    // Distribution by department
    prisma.student.groupBy({
      by: ['department'],
      where: {
        ...studentWhere,
        department: {
          not: null
        }
      },
      _count: {
        id: true
      }
    })
  ]);

  const riskLevelDistribution: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };

  byRiskLevel.forEach((item) => {
    if (item.riskLevel) {
      riskLevelDistribution[item.riskLevel] = item._count.id;
    }
  });

  const departmentDistribution: Record<string, number> = {};
  byDepartment.forEach((item) => {
    if (item.department) {
      departmentDistribution[item.department] = item._count.id;
    }
  });

  return {
    byRiskLevel: riskLevelDistribution,
    byDepartment: departmentDistribution
  };
}

export async function getTrends(query: GetTrendsQuery, context: RequestContext) {
  const { start, end } = getDateRange(query.period ?? '30d');
  const metric = query.metric ?? 'stress';
  const groupBy = query.groupBy ?? 'day';
  const studentWhere = buildStudentWhere(query.consultantId, context.role, context.userId);

  // Map metric to field
  const fieldMap: Record<string, 'stressLevel' | 'anxietyLevel' | 'depressionLevel' | 'sleepHours'> = {
    stress: 'stressLevel',
    anxiety: 'anxietyLevel',
    depression: 'depressionLevel',
    sleep: 'sleepHours'
  };

  const field = fieldMap[metric];

  // Get all records in period
  const records = await prisma.mentalHealthRecord.findMany({
    where: {
      student: studentWhere,
      assessmentDate: {
        gte: start,
        lte: end
      }
    },
    select: {
      assessmentDate: true,
      [field]: true
    },
    orderBy: {
      assessmentDate: 'asc'
    }
  });

  // Group by period
  const grouped: Record<string, number[]> = {};

  records.forEach((record) => {
    let key: string;
    const date = dayjs(record.assessmentDate);

    switch (groupBy) {
      case 'day':
        key = date.format('YYYY-MM-DD');
        break;
      case 'week':
        key = date.format('YYYY-[W]WW');
        break;
      case 'month':
        key = date.format('YYYY-MM');
        break;
      default:
        key = date.format('YYYY-MM-DD');
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }

    const value = record[field];
    if (value !== null && value !== undefined) {
      if (typeof value === 'number') {
        grouped[key].push(value);
      } else {
        // For Decimal type
        grouped[key].push(Number(value));
      }
    }
  });

  // Calculate averages
  const dataPoints = Object.entries(grouped)
    .map(([date, values]) => {
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return {
        date,
        average: Math.round(avg * 10) / 10,
        min,
        max,
        samples: values.length
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    metric,
    period: query.period ?? '30d',
    dataPoints
  };
}

export async function getStudentStats(query: GetStudentStatsQuery, context: RequestContext) {
  const { start, end } = getDateRange(query.period ?? '30d');

  // Check if student exists and user has access
  const student = await prisma.student.findUnique({
    where: { id: query.studentId }
  });

  if (!student) {
    throw new AppError('Student not found', HTTP_STATUS.NOT_FOUND);
  }

  // RBAC: Consultant chỉ thấy students của mình
  if (context.role === 'consultant' && student.consultantId !== context.userId) {
    throw new AppError('Forbidden', HTTP_STATUS.FORBIDDEN);
  }

  const [records, sessions] = await Promise.all([
    // Mental health records
    prisma.mentalHealthRecord.findMany({
      where: {
        studentId: query.studentId,
        assessmentDate: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        assessmentDate: 'asc'
      }
    }),

    // Counseling sessions
    prisma.counselingSession.findMany({
      where: {
        studentId: query.studentId,
        sessionDate: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        sessionDate: 'asc'
      }
    })
  ]);

  // Calculate statistics
  const stressLevels = records.map((r) => Number(r.stressLevel));
  const anxietyLevels = records.map((r) => Number(r.anxietyLevel));
  const depressionLevels = records.map((r) => Number(r.depressionLevel));
  const sleepHours = records.map((r) => Number(r.sleepHours));

  const calculateStats = (values: number[]) => {
    if (values.length === 0) {
      return { mean: 0, min: 0, max: 0, trend: 0 };
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate trend (first half vs second half)
    const mid = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, mid);
    const secondHalf = values.slice(mid);

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const trend = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    return {
      mean: Math.round(mean * 10) / 10,
      min,
      max,
      trend: Math.round(trend * 10) / 10
    };
  };

  return {
    studentId: query.studentId,
    period: query.period ?? '30d',
    records: {
      total: records.length,
      stress: calculateStats(stressLevels),
      anxiety: calculateStats(anxietyLevels),
      depression: calculateStats(depressionLevels),
      sleep: calculateStats(sleepHours)
    },
    sessions: {
      total: sessions.length,
      completed: sessions.filter((s) => s.status === 'completed').length,
      scheduled: sessions.filter((s) => s.status === 'scheduled').length
    }
  };
}

