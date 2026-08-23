import { useSettings } from '../config/SettingsContext';
import { tagsResource } from '../api/rest/resources';
import { useTagQuery, useTagsListQuery } from '../api/graphql/tags';
import type { Tag } from '../types/entities';

export function useTagsList(page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const rest = tagsResource.useList(backend, {}, page, pageSize, mode === 'rest');
  const graphql = useTagsListQuery(pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.tags,
    total: graphql.tags.length,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useTag(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = tagsResource.useItem(backend, id, mode === 'rest');
  const graphql = useTagQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as Tag | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.tag, loading: graphql.loading, error: graphql.error?.message };
}
