import { useSettings } from '../config/SettingsContext';
import { projectsResource } from '../api/rest/resources';
import { useProjectQuery, useProjectsListQuery } from '../api/graphql/projects';
import type { Project } from '../types/entities';

export function useProjectsList(customerId?: string, page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const rest = projectsResource.useList(backend, { customerId }, page, pageSize, mode === 'rest');
  const graphql = useProjectsListQuery(customerId, pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.projects,
    total: graphql.projects.length,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useProject(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = projectsResource.useItem(backend, id, mode === 'rest');
  const graphql = useProjectQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as Project | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.project, loading: graphql.loading, error: graphql.error?.message };
}
