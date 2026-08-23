import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { Task, CreateTaskInput, UpdateTaskInput } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class TasksRestService extends BaseRestService<Task, CreateTaskInput, UpdateTaskInput> {
  protected readonly path = 'tasks';
}
