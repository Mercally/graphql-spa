import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { Tag } from '../../types/entities';
import { idLiteral } from './support';

const TAG_FIELDS = 'id name color createdAt';

export function useTagsListQuery(limit = 50, offset = 0, skip = false) {
  const doc = useMemo(
    () => gql(`query { tags(limit: ${limit}, offset: ${offset}) { ${TAG_FIELDS} } }`),
    [limit, offset]
  );
  const { data, loading, error, refetch } = useQuery<{ tags: Tag[] }>(doc, { skip });
  return { tags: data?.tags ?? [], loading, error, refetch };
}

export function useTagQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { tag(id: ${idLiteral(id ?? '')}) { ${TAG_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ tag: Tag | null }>(doc, {
    skip: !id || skip,
  });
  return { tag: data?.tag ?? null, loading, error, refetch };
}
