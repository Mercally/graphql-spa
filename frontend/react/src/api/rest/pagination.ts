/**
 * The two backends genuinely paginate differently: the .NET API takes
 * page/pageSize and always wraps list responses in { items, totalCount, page,
 * pageSize }; the Node API takes limit/offset and returns a bare array for
 * most entities (only /tasks wraps as { items, total }). These helpers hide
 * that discrepancy from the rest of the app.
 */
import type { BackendKey } from '../../config/env';

export function buildPageParams(
  backend: BackendKey,
  page: number,
  pageSize: number
): Record<string, number> {
  if (backend === 'dotnet') return { page, pageSize };
  return { limit: pageSize, offset: (page - 1) * pageSize };
}

export interface ListResult<T> {
  items: T[];
  total: number;
}

export function normalizeList<T>(data: unknown): ListResult<T> {
  if (Array.isArray(data)) {
    return { items: data as T[], total: data.length };
  }
  const obj = (data ?? {}) as { items?: T[]; total?: number; totalCount?: number };
  const items = obj.items ?? [];
  const total = obj.total ?? obj.totalCount ?? items.length;
  return { items, total };
}
