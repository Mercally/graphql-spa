import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { Tag } from '../../models/models';

interface CreateTagInput {
  name: string;
  color: string;
}
type UpdateTagInput = Partial<CreateTagInput>;

@Injectable({ providedIn: 'root' })
export class TagsRestService extends BaseRestService<Tag, CreateTagInput, UpdateTagInput> {
  protected readonly path = 'tags';
}
