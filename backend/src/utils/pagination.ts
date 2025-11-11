import { z } from 'zod';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  return paginationSchema.parse({
    page: query.page,
    limit: query.limit
  });
}

export function buildPaginationMeta(total: number, { page, limit }: PaginationParams) {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    total,
    page,
    limit,
    totalPages
  };
}

