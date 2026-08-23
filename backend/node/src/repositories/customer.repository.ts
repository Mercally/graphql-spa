import { Db } from 'mongodb';
import { Customer } from '../models/entities';
import { BaseRepository } from './base.repository';

export class CustomerRepository extends BaseRepository<Customer> {
  constructor(db: Db) {
    super(db, 'customers');
  }
}
