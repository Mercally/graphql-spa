import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListResult, Tag } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id name color createdAt';

const LIST_QUERY = gql`
  query Tags($limit: Int, $offset: Int) {
    tags(limit: $limit, offset: $offset) { ${FIELDS} }
  }
`;

const GET_QUERY = gql`
  query Tag($id: ID!) {
    tag(id: $id) { ${FIELDS} }
  }
`;

/** Read-only GraphQL client for Tag (list + detail). */
@Injectable({ providedIn: 'root' })
export class TagsGraphqlService {
  private readonly apollo = inject(Apollo);

  list(params: ListParams = {}): Observable<ListResult<Tag>> {
    return this.apollo
      .query<{ tags: Tag[] }>({
        query: LIST_QUERY,
        variables: { limit: params.limit ?? 20, offset: params.offset ?? 0 }
      })
      .pipe(map((result) => normalizeList<Tag>(result.data.tags)));
  }

  getById(id: string): Observable<Tag> {
    return this.apollo
      .query<{ tag: Tag }>({ query: GET_QUERY, variables: { id } })
      .pipe(map((result) => result.data.tag));
  }
}
