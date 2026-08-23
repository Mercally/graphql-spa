import { TaskRepository, TaskFilter } from '../repositories/task.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { UserRepository } from '../repositories/user.repository';
import { TagRepository } from '../repositories/tag.repository';
import { Task, TaskStatus } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId, toObjectIds } from '../utils/objectId';
import { ObjectId } from 'mongodb';

export interface CreateTaskInput {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  assignedUserId?: string | null;
  tagIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedUserId?: string | null;
  tagIds?: string[];
}

export interface TaskListFilter {
  projectId?: string;
  status?: TaskStatus;
}

export class TaskService {
  constructor(
    private readonly repo: TaskRepository,
    private readonly projectRepo: ProjectRepository,
    private readonly userRepo: UserRepository,
    private readonly tagRepo: TagRepository
  ) {}

  async list(filter: TaskListFilter = {}, limit = 50, offset = 0): Promise<{ items: Task[]; total: number }> {
    const repoFilter: TaskFilter = {};
    if (filter.projectId) repoFilter.projectId = toObjectId(filter.projectId, 'projectId');
    if (filter.status) repoFilter.status = filter.status;
    const [items, total] = await Promise.all([
      this.repo.findFiltered(repoFilter, limit, offset),
      this.repo.countFiltered(repoFilter)
    ]);
    return { items, total };
  }

  async getById(id: string): Promise<Task> {
    const task = await this.repo.findById(toObjectId(id));
    if (!task) throw new NotFoundError('Task', id);
    return task;
  }

  private async validateAssignedUser(assignedUserId: string | null | undefined): Promise<ObjectId | null> {
    if (!assignedUserId) return null;
    const userId = toObjectId(assignedUserId, 'assignedUserId');
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User', assignedUserId);
    return userId;
  }

  private async validateTags(tagIds: string[] | undefined): Promise<ObjectId[]> {
    const objectIds = toObjectIds(tagIds, 'tagIds');
    if (objectIds.length === 0) return [];
    const tags = await this.tagRepo.findByIds(objectIds);
    if (tags.length !== objectIds.length) {
      throw new ValidationError('One or more tagIds do not exist');
    }
    return objectIds;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    if (!input.title || !input.projectId || !input.status) {
      throw new ValidationError('title, projectId and status are required');
    }
    const projectId = toObjectId(input.projectId, 'projectId');
    const project = await this.projectRepo.findById(projectId);
    if (!project) throw new NotFoundError('Project', input.projectId);

    const assignedUserId = await this.validateAssignedUser(input.assignedUserId);
    const tagIds = await this.validateTags(input.tagIds);

    const now = new Date();
    return this.repo.insert({
      title: input.title,
      description: input.description ?? '',
      projectId,
      status: input.status,
      assignedUserId,
      tagIds,
      createdAt: now,
      updatedAt: now
    } as Task);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const objectId = toObjectId(id);
    const update: Partial<Task> = { updatedAt: new Date() };
    if (input.title !== undefined) update.title = input.title;
    if (input.description !== undefined) update.description = input.description;
    if (input.status !== undefined) update.status = input.status;
    if (input.assignedUserId !== undefined) {
      update.assignedUserId = await this.validateAssignedUser(input.assignedUserId);
    }
    if (input.tagIds !== undefined) {
      update.tagIds = await this.validateTags(input.tagIds);
    }
    const updated = await this.repo.updateById(objectId, update);
    if (!updated) throw new NotFoundError('Task', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('Task', id);
  }
}
