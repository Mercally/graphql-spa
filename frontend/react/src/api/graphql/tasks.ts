import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { BackendKey } from '../../config/env';
import type { Task, TaskListFilters } from '../../types/entities';
import { getApolloClient } from './client';
import { enumLiteral, idLiteral } from './support';
import { buildCreateMutation, buildDeleteMutation, buildUpdateMutation } from './mutationBuilder';

const TASK_FIELDS =
  'id title description projectId status assignedUserId tagIds createdAt updatedAt';

function buildFilterArgs(backend: BackendKey, filters: TaskListFilters): string {
  const parts: string[] = [];
  if (filters.status) parts.push(`status: ${enumLiteral(backend, filters.status)}`);
  if (filters.projectId) parts.push(`projectId: ${idLiteral(filters.projectId)}`);
  return parts.map((p) => `, ${p}`).join('');
}

/**
 * Node's `tasks` field returns a `TaskPage { items, total }` wrapper; .NET's
 * returns a flat list with no total count. The hook normalizes both to the
 * same { tasks, total } shape.
 */
export function useTasksListQuery(
  backend: BackendKey,
  filters: TaskListFilters = {},
  limit = 50,
  offset = 0,
  skip = false
) {
  const doc = useMemo(() => {
    const filterArgs = buildFilterArgs(backend, filters);
    const selection = backend === 'node' ? `items { ${TASK_FIELDS} } total` : TASK_FIELDS;
    return gql(`query { tasks(limit: ${limit}, offset: ${offset}${filterArgs}) { ${selection} } }`);
  }, [backend, filters.status, filters.projectId, limit, offset]);

  const { data, loading, error, refetch } = useQuery<{ tasks: Task[] | { items: Task[]; total: number } }>(
    doc,
    { skip }
  );

  const raw = data?.tasks;
  const tasks = raw ? (Array.isArray(raw) ? raw : raw.items) : [];
  const total = raw ? (Array.isArray(raw) ? raw.length : raw.total) : 0;

  return { tasks, total, loading, error, refetch };
}

export function useTaskQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { task(id: ${idLiteral(id ?? '')}) { ${TASK_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ task: Task | null }>(doc, {
    skip: !id || skip,
  });
  return { task: data?.task ?? null, loading, error, refetch };
}

export interface TaskMutationInput {
  title: string;
  description?: string;
  projectId: string;
  status: string;
  assignedUserId?: string | null;
  tagIds?: string[];
}

export async function createTask(backend: BackendKey, input: TaskMutationInput): Promise<Task> {
  const doc = buildCreateMutation(
    backend,
    'createTask',
    [
      { name: 'title', kind: 'string', value: input.title },
      { name: 'description', kind: 'string', value: input.description ?? '' },
      { name: 'projectId', kind: 'id', value: input.projectId },
      { name: 'status', kind: 'enum', value: input.status },
      { name: 'assignedUserId', kind: 'id', value: input.assignedUserId ?? null },
      { name: 'tagIds', kind: 'idList', value: input.tagIds ?? [] },
    ],
    TASK_FIELDS
  );
  const result = await getApolloClient(backend).mutate<{ createTask: Task }>({ mutation: doc });
  if (!result.data) throw new Error('createTask returned no data');
  return result.data.createTask;
}

export async function updateTask(
  backend: BackendKey,
  id: string,
  input: TaskMutationInput
): Promise<Task> {
  const doc = buildUpdateMutation(
    backend,
    'updateTask',
    id,
    [
      { name: 'title', kind: 'string', value: input.title },
      { name: 'description', kind: 'string', value: input.description ?? '' },
      { name: 'status', kind: 'enum', value: input.status },
      { name: 'assignedUserId', kind: 'id', value: input.assignedUserId ?? null },
      { name: 'tagIds', kind: 'idList', value: input.tagIds ?? [] },
    ],
    TASK_FIELDS
  );
  const result = await getApolloClient(backend).mutate<{ updateTask: Task }>({ mutation: doc });
  if (!result.data) throw new Error('updateTask returned no data');
  return result.data.updateTask;
}

export async function deleteTask(backend: BackendKey, id: string): Promise<void> {
  const doc = buildDeleteMutation(backend, 'deleteTask', id);
  await getApolloClient(backend).mutate({ mutation: doc });
}
