import { Db, ObjectId } from 'mongodb';
import { Project } from '../models/entities';
import { BaseRepository } from './base.repository';

export class ProjectRepository extends BaseRepository<Project> {
  constructor(db: Db) {
    super(db, 'projects');
  }

  async findByCustomerId(customerId: ObjectId): Promise<Project[]> {
    return this.collection.find({ customerId }).toArray();
  }
}
