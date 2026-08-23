import { TagRepository } from '../repositories/tag.repository';
import { Tag } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId } from '../utils/objectId';

export interface CreateTagInput {
  name: string;
  color: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;

export class TagService {
  constructor(private readonly repo: TagRepository) {}

  async list(limit?: number, offset?: number): Promise<Tag[]> {
    return this.repo.findAll({}, limit, offset);
  }

  async getById(id: string): Promise<Tag> {
    const tag = await this.repo.findById(toObjectId(id));
    if (!tag) throw new NotFoundError('Tag', id);
    return tag;
  }

  async create(input: CreateTagInput): Promise<Tag> {
    if (!input.name || !input.color) {
      throw new ValidationError('name and color are required');
    }
    return this.repo.insert({
      name: input.name,
      color: input.color,
      createdAt: new Date()
    } as Tag);
  }

  async update(id: string, input: UpdateTagInput): Promise<Tag> {
    const updated = await this.repo.updateById(toObjectId(id), input);
    if (!updated) throw new NotFoundError('Tag', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('Tag', id);
  }
}
