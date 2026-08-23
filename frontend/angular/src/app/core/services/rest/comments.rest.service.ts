import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { Comment } from '../../models/models';

interface CreateCommentInput {
  text: string;
  taskId: string;
  userId: string;
}
type UpdateCommentInput = Partial<Pick<CreateCommentInput, 'text'>>;

@Injectable({ providedIn: 'root' })
export class CommentsRestService extends BaseRestService<
  Comment,
  CreateCommentInput,
  UpdateCommentInput
> {
  protected readonly path = 'comments';
}
