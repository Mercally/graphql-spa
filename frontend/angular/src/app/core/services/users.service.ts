import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { UsersRestService } from './rest/users.rest.service';
import { UsersGraphqlService } from './graphql/users.graphql.service';
import { ListResult, User } from '../models/models';
import { ListParams } from './list.util';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly rest = inject(UsersRestService);
  private readonly gql = inject(UsersGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams = {}): Observable<ListResult<User>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  getById(id: string): Observable<User> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }
}
