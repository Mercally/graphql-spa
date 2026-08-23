import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { User } from '../../models/models';

interface CreateUserInput {
  name: string;
  email: string;
  role: string;
}
type UpdateUserInput = Partial<CreateUserInput>;

@Injectable({ providedIn: 'root' })
export class UsersRestService extends BaseRestService<User, CreateUserInput, UpdateUserInput> {
  protected readonly path = 'users';
}
