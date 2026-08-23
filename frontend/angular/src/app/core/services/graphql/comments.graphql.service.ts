import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comment, ListResult } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id text taskId userId createdAt';

const LIST_QUERY = gql`
  query Comments($limit: Int, $offset: Int, $taskId: ID) {
    comments(limit: $limit, offset: $offset, taskId: $taskId) { ${FIELDS} }
  }
`;

/**
 * Read-only GraphQL client for Comment. .NET's schema does not expose a
 * singular `comment(id)` query (only the list field, see
 * backend/dotnet/src/WorkApi/GraphQL/Queries/QueryType.cs) — rather than send
 * a query that only works on one backend, `getById` always resolves via the
 * list field and finds the match client-side, which works identically on
 * both backends and is cheap at this PoC's data volume (~450 comments).
 */
@Injectable({ providedIn: 'root' })
export class CommentsGraphqlService {
  private readonly apollo = inject(Apollo);

  list(params: ListParams & { taskId?: string } = {}): Observable<ListResult<Comment>> {
    return this.apollo
      .query<{ comments: Comment[] }>({
        query: LIST_QUERY,
        variables: { limit: params.limit ?? 20, offset: params.offset ?? 0, taskId: params.taskId ?? null }
      })
      .pipe(map((result) => normalizeList<Comment>(result.data.comments)));
  }

  getById(id: string): Observable<Comment | undefined> {
    return this.list({ limit: 1000, offset: 0 }).pipe(
      map((result) => result.items.find((c) => c.id === id))
    );
  }
}
