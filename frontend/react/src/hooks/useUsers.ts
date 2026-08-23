import { useSettings } from '../config/SettingsContext';
import { usersResource } from '../api/rest/resources';
import { useUserQuery, useUsersListQuery } from '../api/graphql/users';
import type { User } from '../types/entities';

export function useUsersList(page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const rest = usersResource.useList(backend, {}, page, pageSize, mode === 'rest');
  const graphql = useUsersListQuery(pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.users,
    total: graphql.users.length,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useUser(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = usersResource.useItem(backend, id, mode === 'rest');
  const graphql = useUserQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as User | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.user, loading: graphql.loading, error: graphql.error?.message };
}
