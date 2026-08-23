import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { Comment } from '../../types/entities';
import { idLiteral } from './support';

const COMMENT_FIELDS = 'id text taskId userId createdAt';

export function useCommentsListQuery(taskId?: string, limit = 50, offset = 0, skip = false) {
  const doc = useMemo(() => {
    const taskFilter = taskId ? `, taskId: ${idLiteral(taskId)}` : '';
    return gql(`query { comments(limit: ${limit}, offset: ${offset}${taskFilter}) { ${COMMENT_FIELDS} } }`);
  }, [taskId, limit, offset]);
  const { data, loading, error, refetch } = useQuery<{ comments: Comment[] }>(doc, { skip });
  return { comments: data?.comments ?? [], loading, error, refetch };
}

export function useCommentQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { comment(id: ${idLiteral(id ?? '')}) { ${COMMENT_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ comment: Comment | null }>(doc, {
    skip: !id || skip,
  });
  return { comment: data?.comment ?? null, loading, error, refetch };
}
