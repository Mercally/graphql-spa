import { CustomerRepository } from '../repositories/customer.repository';
import { Customer } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId } from '../utils/objectId';

export interface CreateCustomerInput {
  name: string;
  email: string;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export class CustomerService {
  constructor(private readonly repo: CustomerRepository) {}

  async list(limit?: number, offset?: number): Promise<Customer[]> {
    return this.repo.findAll({}, limit, offset);
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.repo.findById(toObjectId(id));
    if (!customer) throw new NotFoundError('Customer', id);
    return customer;
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    if (!input.name || !input.email) {
      throw new ValidationError('name and email are required');
    }
    return this.repo.insert({
      name: input.name,
      email: input.email,
      createdAt: new Date()
    } as Customer);
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const objectId = toObjectId(id);
    const updated = await this.repo.updateById(objectId, input);
    if (!updated) throw new NotFoundError('Customer', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('Customer', id);
  }
}
