import { useSettings } from '../config/SettingsContext';
import { commentsResource } from '../api/rest/resources';
import { useCommentQuery, useCommentsListQuery } from '../api/graphql/comments';
import type { Comment } from '../types/entities';

export function useCommentsList(taskId?: string, page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const rest = commentsResource.useList(backend, { taskId }, page, pageSize, mode === 'rest');
  const graphql = useCommentsListQuery(taskId, pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.comments,
    total: graphql.comments.length,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useComment(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = commentsResource.useItem(backend, id, mode === 'rest');
  const graphql = useCommentQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as Comment | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.comment, loading: graphql.loading, error: graphql.error?.message };
}
