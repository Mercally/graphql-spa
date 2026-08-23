import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { Team } from '../../models/models';

interface CreateTeamInput {
  name: string;
  projectId: string;
  memberUserIds?: string[];
}
type UpdateTeamInput = Partial<CreateTeamInput>;

@Injectable({ providedIn: 'root' })
export class TeamsRestService extends BaseRestService<Team, CreateTeamInput, UpdateTeamInput> {
  protected readonly path = 'teams';
}
