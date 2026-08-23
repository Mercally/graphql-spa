import { Db } from 'mongodb';
import { Tag } from '../models/entities';
import { BaseRepository } from './base.repository';

export class TagRepository extends BaseRepository<Tag> {
  constructor(db: Db) {
    super(db, 'tags');
  }
}
