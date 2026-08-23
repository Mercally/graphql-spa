import { useSettings } from '../config/SettingsContext';
import { teamsResource } from '../api/rest/resources';
import { useTeamQuery, useTeamsListQuery } from '../api/graphql/teams';
import type { Team } from '../types/entities';

export function useTeamsList(projectId?: string, page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const rest = teamsResource.useList(backend, { projectId }, page, pageSize, mode === 'rest');
  const graphql = useTeamsListQuery(projectId, pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.teams,
    total: graphql.teams.length,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useTeam(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = teamsResource.useItem(backend, id, mode === 'rest');
  const graphql = useTeamQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as Team | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.team, loading: graphql.loading, error: graphql.error?.message };
}
