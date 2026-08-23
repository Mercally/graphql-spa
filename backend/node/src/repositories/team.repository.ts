import { Db, ObjectId } from 'mongodb';
import { Team } from '../models/entities';
import { BaseRepository } from './base.repository';

export class TeamRepository extends BaseRepository<Team> {
  constructor(db: Db) {
    super(db, 'teams');
  }

  async findByProjectId(projectId: ObjectId): Promise<Team[]> {
    return this.collection.find({ projectId }).toArray();
  }
}
