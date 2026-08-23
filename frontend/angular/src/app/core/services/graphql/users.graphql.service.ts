import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListResult, User } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id name email role createdAt';

const LIST_QUERY = gql`
  query Users($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) { ${FIELDS} }
  }
`;

const GET_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) { ${FIELDS} }
  }
`;

/** Read-only GraphQL client for User (list + detail). */
@Injectable({ providedIn: 'root' })
export class UsersGraphqlService {
  private readonly apollo = inject(Apollo);

  list(params: ListParams = {}): Observable<ListResult<User>> {
    return this.apollo
      .query<{ users: User[] }>({
        query: LIST_QUERY,
        variables: { limit: params.limit ?? 20, offset: params.offset ?? 0 }
      })
      .pipe(map((result) => normalizeList<User>(result.data.users)));
  }

  getById(id: string): Observable<User> {
    return this.apollo
      .query<{ user: User }>({ query: GET_QUERY, variables: { id } })
      .pipe(map((result) => result.data.user));
  }
}
