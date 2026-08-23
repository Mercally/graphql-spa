import { Db, ObjectId } from 'mongodb';
import { Comment } from '../models/entities';
import { BaseRepository } from './base.repository';

export class CommentRepository extends BaseRepository<Comment> {
  constructor(db: Db) {
    super(db, 'comments');
  }

  async findByTaskId(taskId: ObjectId): Promise<Comment[]> {
    return this.collection.find({ taskId }).toArray();
  }
}
