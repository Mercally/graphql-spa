import { CommentRepository } from '../repositories/comment.repository';
import { TaskRepository } from '../repositories/task.repository';
import { UserRepository } from '../repositories/user.repository';
import { Comment } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId } from '../utils/objectId';

export interface CreateCommentInput {
  text: string;
  taskId: string;
  userId: string;
}

export interface UpdateCommentInput {
  text?: string;
}

export interface CommentListFilter {
  taskId?: string;
}

export class CommentService {
  constructor(
    private readonly repo: CommentRepository,
    private readonly taskRepo: TaskRepository,
    private readonly userRepo: UserRepository
  ) {}

  async list(filter: CommentListFilter = {}, limit?: number, offset?: number): Promise<Comment[]> {
    if (filter.taskId) {
      return this.repo.findByTaskId(toObjectId(filter.taskId, 'taskId'));
    }
    return this.repo.findAll({}, limit, offset);
  }

  async getById(id: string): Promise<Comment> {
    const comment = await this.repo.findById(toObjectId(id));
    if (!comment) throw new NotFoundError('Comment', id);
    return comment;
  }

  async create(input: CreateCommentInput): Promise<Comment> {
    if (!input.text || !input.taskId || !input.userId) {
      throw new ValidationError('text, taskId and userId are required');
    }
    const taskId = toObjectId(input.taskId, 'taskId');
    const task = await this.taskRepo.findById(taskId);
    if (!task) throw new NotFoundError('Task', input.taskId);

    const userId = toObjectId(input.userId, 'userId');
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User', input.userId);

    return this.repo.insert({
      text: input.text,
      taskId,
      userId,
      createdAt: new Date()
    } as Comment);
  }

  async update(id: string, input: UpdateCommentInput): Promise<Comment> {
    const updated = await this.repo.updateById(toObjectId(id), input);
    if (!updated) throw new NotFoundError('Comment', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('Comment', id);
  }
}
