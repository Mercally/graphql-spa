import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListResult, Team, User } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id name projectId memberUserIds createdAt';

const LIST_QUERY = gql`
  query Teams($limit: Int, $offset: Int, $projectId: ID) {
    teams(limit: $limit, offset: $offset, projectId: $projectId) { ${FIELDS} }
  }
`;

const GET_QUERY = gql`
  query Team($id: ID!) {
    team(id: $id) {
      ${FIELDS}
      users { id name email role }
    }
  }
`;

/** Read-only GraphQL client for Team (list + detail with nested member users). */
@Injectable({ providedIn: 'root' })
export class TeamsGraphqlService {
  private readonly apollo = inject(Apollo);

  list(params: ListParams & { projectId?: string } = {}): Observable<ListResult<Team>> {
    return this.apollo
      .query<{ teams: Team[] }>({
        query: LIST_QUERY,
        variables: { limit: params.limit ?? 20, offset: params.offset ?? 0, projectId: params.projectId ?? null }
      })
      .pipe(map((result) => normalizeList<Team>(result.data.teams)));
  }

  getById(id: string): Observable<Team & { users: User[] }> {
    return this.apollo
      .query<{ team: Team & { users: User[] } }>({ query: GET_QUERY, variables: { id } })
      .pipe(map((result) => result.data.team));
  }
}
