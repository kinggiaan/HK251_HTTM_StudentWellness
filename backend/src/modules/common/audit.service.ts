import { Prisma } from '@prisma/client';

import { prisma } from '../../config';

interface AuditLogInput {
  userId?: string;
  action: string;
  resource?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  success?: boolean;
}

export async function createAuditLog({
  userId,
  action,
  resource,
  metadata,
  ip,
  userAgent,
  success = true
}: AuditLogInput) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      metadata: metadata as Prisma.InputJsonValue | undefined,
      ip,
      userAgent,
      success
    }
  });
}

