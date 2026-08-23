import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { TasksRestService } from './rest/tasks.rest.service';
import { TasksGraphqlService } from './graphql/tasks.graphql.service';
import { CreateTaskInput, ListResult, Task, UpdateTaskInput } from '../models/models';
import { ListParams } from './list.util';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly rest = inject(TasksRestService);
  private readonly gql = inject(TasksGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams & { status?: string; projectId?: string } = {}): Observable<ListResult<Task>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  getById(id: string): Observable<Task> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }

  create(input: CreateTaskInput): Observable<Task> {
    return this.settings.mode() === 'rest' ? this.rest.create(input) : this.gql.create(input);
  }

  /** `title` is always supplied by the edit form, satisfying both backends' required-arg dialects. */
  update(id: string, input: UpdateTaskInput & { title: string }): Observable<Task> {
    return this.settings.mode() === 'rest' ? this.rest.update(id, input) : this.gql.update(id, input);
  }

  remove(id: string): Observable<void> {
    return this.settings.mode() === 'rest'
      ? this.rest.remove(id)
      : (this.gql.remove(id) as unknown as Observable<void>);
  }
}
