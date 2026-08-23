import { useSettings } from '../config/SettingsContext';
import { tasksResource } from '../api/rest/resources';
import { useTaskQuery, useTasksListQuery, createTask, updateTask, deleteTask } from '../api/graphql/tasks';
import type { TaskMutationInput } from '../api/graphql/tasks';
import { useAsyncMutation } from './useAsyncMutation';
import type { Task, TaskListFilters } from '../types/entities';

export function useTasksList(filters: TaskListFilters = {}, page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const restFilters = { status: filters.status, projectId: filters.projectId };
  const rest = tasksResource.useList(backend, restFilters, page, pageSize, mode === 'rest');
  const graphql = useTasksListQuery(backend, filters, pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.tasks,
    total: graphql.total,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useTask(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = tasksResource.useItem(backend, id, mode === 'rest');
  const graphql = useTaskQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as Task | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.task, loading: graphql.loading, error: graphql.error?.message };
}

export function useTaskMutations() {
  const { backend, mode } = useSettings();
  const restCreate = tasksResource.useCreate(backend);
  const restUpdate = tasksResource.useUpdate(backend);
  const restRemove = tasksResource.useRemove(backend);
  const graphqlCreate = useAsyncMutation((input: TaskMutationInput) => createTask(backend, input));
  const graphqlUpdate = useAsyncMutation((id: string, input: TaskMutationInput) => updateTask(backend, id, input));
  const graphqlRemove = useAsyncMutation((id: string) => deleteTask(backend, id));

  if (mode === 'rest') {
    return {
      create: (input: TaskMutationInput) => restCreate.mutateAsync(input),
      update: (id: string, input: TaskMutationInput) => restUpdate.mutateAsync({ id, payload: input }),
      remove: (id: string) => restRemove.mutateAsync(id),
      loading: restCreate.isPending || restUpdate.isPending || restRemove.isPending,
      error:
        (restCreate.error ?? restUpdate.error ?? restRemove.error) instanceof Error
          ? ((restCreate.error ?? restUpdate.error ?? restRemove.error) as Error).message
          : undefined,
    };
  }
  return {
    create: graphqlCreate.mutate,
    update: graphqlUpdate.mutate,
    remove: graphqlRemove.mutate,
    loading: graphqlCreate.loading || graphqlUpdate.loading || graphqlRemove.loading,
    error: (graphqlCreate.error ?? graphqlUpdate.error ?? graphqlRemove.error)?.message,
  };
}
