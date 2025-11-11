import { UserRole } from '@prisma/client';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    role: z.nativeEnum(UserRole).optional()
  })
});

export const getUserSchema = idParamSchema;

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(UserRole),
    fullName: z.string().min(1),
    avatarUrl: z.string().url().optional()
  })
});

export const updateUserSchema = z
  .object({
    body: z
      .object({
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
        role: z.nativeEnum(UserRole).optional(),
        fullName: z.string().min(1).optional(),
        avatarUrl: z.string().url().nullable().optional()
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided'
      })
  })
  .merge(idParamSchema);

export const deleteUserSchema = idParamSchema;

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];

