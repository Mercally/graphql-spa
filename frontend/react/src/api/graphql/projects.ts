import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { Project } from '../../types/entities';
import { idLiteral } from './support';

const PROJECT_FIELDS = 'id name description customerId status createdAt updatedAt';

export function useProjectsListQuery(customerId?: string, limit = 50, offset = 0, skip = false) {
  const doc = useMemo(() => {
    const customerFilter = customerId ? `, customerId: ${idLiteral(customerId)}` : '';
    return gql(`query { projects(limit: ${limit}, offset: ${offset}${customerFilter}) { ${PROJECT_FIELDS} } }`);
  }, [customerId, limit, offset]);
  const { data, loading, error, refetch } = useQuery<{ projects: Project[] }>(doc, { skip });
  return { projects: data?.projects ?? [], loading, error, refetch };
}

export function useProjectQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { project(id: ${idLiteral(id ?? '')}) { ${PROJECT_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ project: Project | null }>(doc, {
    skip: !id || skip,
  });
  return { project: data?.project ?? null, loading, error, refetch };
}
