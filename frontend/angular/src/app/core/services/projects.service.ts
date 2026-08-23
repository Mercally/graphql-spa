import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { ProjectsRestService } from './rest/projects.rest.service';
import { ProjectsGraphqlService } from './graphql/projects.graphql.service';
import { ListResult, Project } from '../models/models';
import { ListParams } from './list.util';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly rest = inject(ProjectsRestService);
  private readonly gql = inject(ProjectsGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams & { customerId?: string } = {}): Observable<ListResult<Project>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  getById(id: string): Observable<Project> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }
}
