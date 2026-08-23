import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { Project, CreateProjectInput, UpdateProjectInput } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class ProjectsRestService extends BaseRestService<
  Project,
  CreateProjectInput,
  UpdateProjectInput
> {
  protected readonly path = 'projects';
}
