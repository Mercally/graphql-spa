import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { CommentsRestService } from './rest/comments.rest.service';
import { CommentsGraphqlService } from './graphql/comments.graphql.service';
import { Comment, ListResult } from '../models/models';
import { ListParams } from './list.util';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly rest = inject(CommentsRestService);
  private readonly gql = inject(CommentsGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams & { taskId?: string } = {}): Observable<ListResult<Comment>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  getById(id: string): Observable<Comment | undefined> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }
}
