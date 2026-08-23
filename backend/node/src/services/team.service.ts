import { TeamRepository } from '../repositories/team.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { UserRepository } from '../repositories/user.repository';
import { Team } from '../models/entities';
import { NotFoundError, ValidationError } from '../errors';
import { toObjectId, toObjectIds } from '../utils/objectId';

export interface CreateTeamInput {
  name: string;
  projectId: string;
  memberUserIds?: string[];
}

export interface UpdateTeamInput {
  name?: string;
  memberUserIds?: string[];
}

export interface TeamListFilter {
  projectId?: string;
}

export class TeamService {
  constructor(
    private readonly repo: TeamRepository,
    private readonly projectRepo: ProjectRepository,
    private readonly userRepo: UserRepository
  ) {}

  async list(filter: TeamListFilter = {}, limit?: number, offset?: number): Promise<Team[]> {
    if (filter.projectId) {
      return this.repo.findByProjectId(toObjectId(filter.projectId, 'projectId'));
    }
    return this.repo.findAll({}, limit, offset);
  }

  async getById(id: string): Promise<Team> {
    const team = await this.repo.findById(toObjectId(id));
    if (!team) throw new NotFoundError('Team', id);
    return team;
  }

  async create(input: CreateTeamInput): Promise<Team> {
    if (!input.name || !input.projectId) {
      throw new ValidationError('name and projectId are required');
    }
    const projectId = toObjectId(input.projectId, 'projectId');
    const project = await this.projectRepo.findById(projectId);
    if (!project) throw new NotFoundError('Project', input.projectId);

    const memberUserIds = toObjectIds(input.memberUserIds, 'memberUserIds');
    if (memberUserIds.length > 0) {
      const users = await this.userRepo.findByIds(memberUserIds);
      if (users.length !== memberUserIds.length) {
        throw new ValidationError('One or more memberUserIds do not exist');
      }
    }

    return this.repo.insert({
      name: input.name,
      projectId,
      memberUserIds,
      createdAt: new Date()
    } as Team);
  }

  async update(id: string, input: UpdateTeamInput): Promise<Team> {
    const objectId = toObjectId(id);
    const update: Partial<Team> = {};
    if (input.name !== undefined) update.name = input.name;
    if (input.memberUserIds !== undefined) {
      const memberUserIds = toObjectIds(input.memberUserIds, 'memberUserIds');
      if (memberUserIds.length > 0) {
        const users = await this.userRepo.findByIds(memberUserIds);
        if (users.length !== memberUserIds.length) {
          throw new ValidationError('One or more memberUserIds do not exist');
        }
      }
      update.memberUserIds = memberUserIds;
    }
    const updated = await this.repo.updateById(objectId, update);
    if (!updated) throw new NotFoundError('Team', id);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repo.deleteById(toObjectId(id));
    if (!deleted) throw new NotFoundError('Team', id);
  }
}
