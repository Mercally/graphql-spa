/**
 * Generic REST resource: plain async CRUD functions plus TanStack Query hooks
 * built on top of them. Every entity file in this folder is a thin instance
 * of this factory, so the CRUD/query wiring is written once.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BackendKey } from '../../config/env';
import { getRestClient } from './client';
import { buildPageParams, normalizeList, type ListResult } from './pagination';

export function createRestResource<T, TCreate = Partial<T>, TUpdate = Partial<T>>(path: string) {
  async function list(
    backend: BackendKey,
    filters: Record<string, string | undefined> = {},
    page = 1,
    pageSize = 50
  ): Promise<ListResult<T>> {
    const client = getRestClient(backend);
    const { data } = await client.get(`/${path}`, {
      params: { ...filters, ...buildPageParams(backend, page, pageSize) },
    });
    return normalizeList<T>(data);
  }

  async function getById(backend: BackendKey, id: string): Promise<T> {
    const client = getRestClient(backend);
    const { data } = await client.get(`/${path}/${id}`);
    return data as T;
  }

  async function create(backend: BackendKey, payload: TCreate): Promise<T> {
    const client = getRestClient(backend);
    const { data } = await client.post(`/${path}`, payload);
    return data as T;
  }

  async function update(backend: BackendKey, id: string, payload: TUpdate): Promise<T> {
    const client = getRestClient(backend);
    const { data } = await client.put(`/${path}/${id}`, payload);
    return data as T;
  }

  async function remove(backend: BackendKey, id: string): Promise<void> {
    const client = getRestClient(backend);
    await client.delete(`/${path}/${id}`);
  }

  function useList(
    backend: BackendKey,
    filters: Record<string, string | undefined> = {},
    page = 1,
    pageSize = 50,
    enabled = true
  ) {
    return useQuery({
      queryKey: ['rest', path, 'list', backend, filters, page, pageSize],
      queryFn: () => list(backend, filters, page, pageSize),
      enabled,
    });
  }

  function useItem(backend: BackendKey, id: string | undefined, enabled = true) {
    return useQuery({
      queryKey: ['rest', path, 'item', backend, id],
      queryFn: () => getById(backend, id as string),
      enabled: Boolean(id) && enabled,
    });
  }

  function useCreate(backend: BackendKey) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: TCreate) => create(backend, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rest', path] }),
    });
  }

  function useUpdate(backend: BackendKey) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: TUpdate }) => update(backend, id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rest', path] }),
    });
  }

  function useRemove(backend: BackendKey) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => remove(backend, id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rest', path] }),
    });
  }

  return { list, getById, create, update, remove, useList, useItem, useCreate, useUpdate, useRemove };
}
