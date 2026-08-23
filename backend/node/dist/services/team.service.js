"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class TeamService {
    repo;
    projectRepo;
    userRepo;
    constructor(repo, projectRepo, userRepo) {
        this.repo = repo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
    }
    async list(filter = {}, limit, offset) {
        if (filter.projectId) {
            return this.repo.findByProjectId((0, objectId_1.toObjectId)(filter.projectId, 'projectId'));
        }
        return this.repo.findAll({}, limit, offset);
    }
    async getById(id) {
        const team = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!team)
            throw new errors_1.NotFoundError('Team', id);
        return team;
    }
    async create(input) {
        if (!input.name || !input.projectId) {
            throw new errors_1.ValidationError('name and projectId are required');
        }
        const projectId = (0, objectId_1.toObjectId)(input.projectId, 'projectId');
        const project = await this.projectRepo.findById(projectId);
        if (!project)
            throw new errors_1.NotFoundError('Project', input.projectId);
        const memberUserIds = (0, objectId_1.toObjectIds)(input.memberUserIds, 'memberUserIds');
        if (memberUserIds.length > 0) {
            const users = await this.userRepo.findByIds(memberUserIds);
            if (users.length !== memberUserIds.length) {
                throw new errors_1.ValidationError('One or more memberUserIds do not exist');
            }
        }
        return this.repo.insert({
            name: input.name,
            projectId,
            memberUserIds,
            createdAt: new Date()
        });
    }
    async update(id, input) {
        const objectId = (0, objectId_1.toObjectId)(id);
        const update = {};
        if (input.name !== undefined)
            update.name = input.name;
        if (input.memberUserIds !== undefined) {
            const memberUserIds = (0, objectId_1.toObjectIds)(input.memberUserIds, 'memberUserIds');
            if (memberUserIds.length > 0) {
                const users = await this.userRepo.findByIds(memberUserIds);
                if (users.length !== memberUserIds.length) {
                    throw new errors_1.ValidationError('One or more memberUserIds do not exist');
                }
            }
            update.memberUserIds = memberUserIds;
        }
        const updated = await this.repo.updateById(objectId, update);
        if (!updated)
            throw new errors_1.NotFoundError('Team', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('Team', id);
    }
}
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map