import { Db } from 'mongodb';
import { User } from '../models/entities';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> {
  constructor(db: Db) {
    super(db, 'users');
  }
}
