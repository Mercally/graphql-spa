import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project, ListResult } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id name description customerId status createdAt updatedAt';

const LIST_QUERY = gql`
  query Projects($limit: Int, $offset: Int, $customerId: ID) {
    projects(limit: $limit, offset: $offset, customerId: $customerId) { ${FIELDS} }
  }
`;

const GET_QUERY = gql`
  query Project($id: ID!) {
    project(id: $id) { ${FIELDS} }
  }
`;

/** Read-only GraphQL client for Project (list + detail); no mutations required by the UI. */
@Injectable({ providedIn: 'root' })
export class ProjectsGraphqlService {
  private readonly apollo = inject(Apollo);

  list(params: ListParams & { customerId?: string } = {}): Observable<ListResult<Project>> {
    return this.apollo
      .query<{ projects: Project[] }>({
        query: LIST_QUERY,
        variables: { limit: params.limit ?? 20, offset: params.offset ?? 0, customerId: params.customerId ?? null }
      })
      .pipe(map((result) => normalizeList<Project>(result.data.projects)));
  }

  getById(id: string): Observable<Project> {
    return this.apollo
      .query<{ project: Project }>({ query: GET_QUERY, variables: { id } })
      .pipe(map((result) => result.data.project));
  }
}
