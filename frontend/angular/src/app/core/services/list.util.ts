import { ListResult } from '../models/models';

export interface ListParams {
  limit?: number;
  offset?: number;
  [key: string]: string | number | undefined;
}

/**
 * Normalizes list responses across both paradigms and both backends:
 * - .NET REST: { items, totalCount, page, pageSize }
 * - Node REST: bare array (or { items, total } for /api/tasks)
 * - GraphQL: bare array (or { items, total } for Node's `tasks` field, which
 *   returns a TaskPage; .NET's `tasks` field is a bare list)
 */
export function normalizeList<T>(raw: unknown): ListResult<T> {
  if (Array.isArray(raw)) {
    return { items: raw as T[], total: raw.length };
  }
  const obj = raw as { items?: T[]; total?: number; totalCount?: number } | null | undefined;
  if (obj && Array.isArray(obj.items)) {
    return { items: obj.items, total: obj.total ?? obj.totalCount ?? obj.items.length };
  }
  return { items: [], total: 0 };
}

/** .NET REST paginates with page/pageSize; convert our offset/limit convention to it. */
export function toDotnetParams(params: ListParams): Record<string, string> {
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const page = Math.floor(offset / limit) + 1;
  const out: Record<string, string> = { page: String(page), pageSize: String(limit) };
  for (const [key, value] of Object.entries(params)) {
    if (key === 'limit' || key === 'offset' || value == null) continue;
    out[key] = String(value);
  }
  return out;
}

/** Node REST already speaks limit/offset natively. */
export function toNodeParams(params: ListParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    out[key] = String(value);
  }
  return out;
}
