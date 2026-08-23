import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { User } from '../../types/entities';
import { idLiteral } from './support';

const USER_FIELDS = 'id name email role createdAt';

export function useUsersListQuery(limit = 50, offset = 0, skip = false) {
  const doc = useMemo(
    () => gql(`query { users(limit: ${limit}, offset: ${offset}) { ${USER_FIELDS} } }`),
    [limit, offset]
  );
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(doc, { skip });
  return { users: data?.users ?? [], loading, error, refetch };
}

export function useUserQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { user(id: ${idLiteral(id ?? '')}) { ${USER_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ user: User | null }>(doc, {
    skip: !id || skip,
  });
  return { user: data?.user ?? null, loading, error, refetch };
}
