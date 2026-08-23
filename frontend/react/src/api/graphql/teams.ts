import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { Team } from '../../types/entities';
import { idLiteral } from './support';

const TEAM_FIELDS = 'id name projectId memberUserIds createdAt';

export function useTeamsListQuery(projectId?: string, limit = 50, offset = 0, skip = false) {
  const doc = useMemo(() => {
    const projectFilter = projectId ? `, projectId: ${idLiteral(projectId)}` : '';
    return gql(`query { teams(limit: ${limit}, offset: ${offset}${projectFilter}) { ${TEAM_FIELDS} } }`);
  }, [projectId, limit, offset]);
  const { data, loading, error, refetch } = useQuery<{ teams: Team[] }>(doc, { skip });
  return { teams: data?.teams ?? [], loading, error, refetch };
}

export function useTeamQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { team(id: ${idLiteral(id ?? '')}) { ${TEAM_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ team: Team | null }>(doc, {
    skip: !id || skip,
  });
  return { team: data?.team ?? null, loading, error, refetch };
}
