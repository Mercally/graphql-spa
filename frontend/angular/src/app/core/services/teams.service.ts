import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { TeamsRestService } from './rest/teams.rest.service';
import { TeamsGraphqlService } from './graphql/teams.graphql.service';
import { ListResult, Team, User } from '../models/models';
import { ListParams } from './list.util';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly rest = inject(TeamsRestService);
  private readonly gql = inject(TeamsGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams & { projectId?: string } = {}): Observable<ListResult<Team>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  /** GraphQL mode returns the team's member users nested in one call; REST mode returns just the team. */
  getById(id: string): Observable<Team & { users?: User[] }> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }
}
