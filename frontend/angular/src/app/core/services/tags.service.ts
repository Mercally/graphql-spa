import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { TagsRestService } from './rest/tags.rest.service';
import { TagsGraphqlService } from './graphql/tags.graphql.service';
import { ListResult, Tag } from '../models/models';
import { ListParams } from './list.util';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly rest = inject(TagsRestService);
  private readonly gql = inject(TagsGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams = {}): Observable<ListResult<Tag>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  getById(id: string): Observable<Tag> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }
}
