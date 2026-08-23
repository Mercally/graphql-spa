import { ProjectRepository } from '../repositories/project.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { Project, ProjectStatus } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId } from '../utils/objectId';

export interface CreateProjectInput {
  name: string;
  description: string;
  customerId: string;
  status: ProjectStatus;
}

export type UpdateProjectInput = Partial<Omit<CreateProjectInput, 'customerId'>> & {
  customerId?: string;
};

export interface ProjectListFilter {
  customerId?: string;
}

export class ProjectService {
  constructor(
    private readonly repo: ProjectRepository,
    private readonly customerRepo: CustomerRepository
  ) {}

  async list(filter: ProjectListFilter = {}, limit?: number, offset?: number): Promise<Project[]> {
    if (filter.customerId) {
      return this.repo.findByCustomerId(toObjectId(filter.customerId, 'customerId'));
    }
    return this.repo.findAll({}, limit, offset);
  }

  async getById(id: string): Promise<Project> {
    const project = await this.repo.findById(toObjectId(id));
    if (!project) throw new NotFoundError('Project', id);
    return project;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    if (!input.name || !input.customerId || !input.status) {
      throw new ValidationError('name, customerId and status are required');
    }
    const customerId = toObjectId(input.customerId, 'customerId');
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) throw new NotFoundError('Customer', input.customerId);

    const now = new Date();
    return this.repo.insert({
      name: input.name,
      description: input.description ?? '',
      customerId,
      status: input.status,
      createdAt: now,
      updatedAt: now
    } as Project);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const objectId = toObjectId(id);
    const update: Partial<Project> = { updatedAt: new Date() };
    if (input.name !== undefined) update.name = input.name;
    if (input.description !== undefined) update.description = input.description;
    if (input.status !== undefined) update.status = input.status;
    if (input.customerId !== undefined) {
      const customerId = toObjectId(input.customerId, 'customerId');
      const customer = await this.customerRepo.findById(customerId);
      if (!customer) throw new NotFoundError('Customer', input.customerId);
      update.customerId = customerId;
    }
    const updated = await this.repo.updateById(objectId, update);
    if (!updated) throw new NotFoundError('Project', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('Project', id);
  }
}
