import { UserRepository } from '../repositories/user.repository';
import { User, UserRole } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId } from '../utils/objectId';

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async list(limit?: number, offset?: number): Promise<User[]> {
    return this.repo.findAll({}, limit, offset);
  }

  async getById(id: string): Promise<User> {
    const user = await this.repo.findById(toObjectId(id));
    if (!user) throw new NotFoundError('User', id);
    return user;
  }

  async create(input: CreateUserInput): Promise<User> {
    if (!input.name || !input.email || !input.role) {
      throw new ValidationError('name, email and role are required');
    }
    return this.repo.insert({
      name: input.name,
      email: input.email,
      role: input.role,
      createdAt: new Date()
    } as User);
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const updated = await this.repo.updateById(toObjectId(id), input);
    if (!updated) throw new NotFoundError('User', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('User', id);
  }
}
