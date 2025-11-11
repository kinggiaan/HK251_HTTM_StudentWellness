import type { Prisma, UserRole } from '@prisma/client';

import { createAuditLog, toUserResponse } from '../common';
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput
} from './user.schema';
import { prisma } from '../../config';
import AppError from '../../utils/appError';
import { HTTP_STATUS } from '../../utils/httpStatus';
import { buildPaginationMeta, parsePagination } from '../../utils/pagination';
import { hashPassword } from '../../utils/password';

export async function listUsers(query: ListUsersQuery) {
  const { page, limit } = parsePagination(query);
  const where: Prisma.UserWhereInput = {};

  if (query.role) {
    where.role = query.role;
  }

  if (query.search) {
    const searchFilter = {
      contains: query.search,
      mode: 'insensitive' as const
    };
    where.OR = [
      { email: searchFilter },
      { fullName: searchFilter }
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.user.count({ where })
  ]);

  return {
    users: users.map(toUserResponse),
    pagination: buildPaginationMeta(total, { page, limit })
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return toUserResponse(user);
}

export async function createUser(
  input: CreateUserInput,
  context: { actorId: string; ip?: string; userAgent?: string }
) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existing) {
    throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: passwordHash,
      role: input.role,
      fullName: input.fullName,
      avatarUrl: input.avatarUrl
    }
  });

  await createAuditLog({
    userId: context.actorId,
    action: 'user.create',
    resource: user.id,
    ip: context.ip,
    userAgent: context.userAgent,
    metadata: { createdUserId: user.id }
  });

  return toUserResponse(user);
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
  context: { actorId: string; ip?: string; userAgent?: string }
) {
  if (input.email) {
    const existing = await prisma.user.findFirst({
      where: {
        email: input.email,
        NOT: { id }
      }
    });

    if (existing) {
      throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
    }
  }

  const data: Record<string, unknown> = { ...input };

  if (input.password) {
    data.password = await hashPassword(input.password);
  }

  const user = await prisma.user.update({
    where: { id },
    data
  });

  await createAuditLog({
    userId: context.actorId,
    action: 'user.update',
    resource: user.id,
    ip: context.ip,
    userAgent: context.userAgent,
    metadata: { updatedFields: Object.keys(input) }
  });

  return toUserResponse(user);
}

export async function deleteUser(
  id: string,
  context: { actorId: string; ip?: string; userAgent?: string }
) {
  if (id === context.actorId) {
    throw new AppError('You cannot delete your own account', HTTP_STATUS.FORBIDDEN);
  }

  await prisma.user.delete({
    where: { id }
  });

  await createAuditLog({
    userId: context.actorId,
    action: 'user.delete',
    resource: id,
    ip: context.ip,
    userAgent: context.userAgent
  });
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return toUserResponse(user);
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

