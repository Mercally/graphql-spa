import { Db, Filter, ObjectId } from 'mongodb';
import { Task, TaskStatus } from '../models/entities';
import { BaseRepository } from './base.repository';

export interface TaskFilter {
  projectId?: ObjectId;
  status?: TaskStatus;
}

export class TaskRepository extends BaseRepository<Task> {
  constructor(db: Db) {
    super(db, 'tasks');
  }

  async findByProjectId(projectId: ObjectId): Promise<Task[]> {
    return this.collection.find({ projectId }).toArray();
  }

  async findFiltered(filter: TaskFilter, limit = 50, offset = 0): Promise<Task[]> {
    const query: Filter<Task> = {};
    if (filter.projectId) query.projectId = filter.projectId;
    if (filter.status) query.status = filter.status;
    return this.collection.find(query).skip(offset).limit(limit).toArray();
  }

  async countFiltered(filter: TaskFilter): Promise<number> {
    const query: Filter<Task> = {};
    if (filter.projectId) query.projectId = filter.projectId;
    if (filter.status) query.status = filter.status;
    return this.collection.countDocuments(query);
  }
}
