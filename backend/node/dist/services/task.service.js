"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class TaskService {
    repo;
    projectRepo;
    userRepo;
    tagRepo;
    constructor(repo, projectRepo, userRepo, tagRepo) {
        this.repo = repo;
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
        this.tagRepo = tagRepo;
    }
    async list(filter = {}, limit = 50, offset = 0) {
        const repoFilter = {};
        if (filter.projectId)
            repoFilter.projectId = (0, objectId_1.toObjectId)(filter.projectId, 'projectId');
        if (filter.status)
            repoFilter.status = filter.status;
        const [items, total] = await Promise.all([
            this.repo.findFiltered(repoFilter, limit, offset),
            this.repo.countFiltered(repoFilter)
        ]);
        return { items, total };
    }
    async getById(id) {
        const task = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!task)
            throw new errors_1.NotFoundError('Task', id);
        return task;
    }
    async validateAssignedUser(assignedUserId) {
        if (!assignedUserId)
            return null;
        const userId = (0, objectId_1.toObjectId)(assignedUserId, 'assignedUserId');
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User', assignedUserId);
        return userId;
    }
    async validateTags(tagIds) {
        const objectIds = (0, objectId_1.toObjectIds)(tagIds, 'tagIds');
        if (objectIds.length === 0)
            return [];
        const tags = await this.tagRepo.findByIds(objectIds);
        if (tags.length !== objectIds.length) {
            throw new errors_1.ValidationError('One or more tagIds do not exist');
        }
        return objectIds;
    }
    async create(input) {
        if (!input.title || !input.projectId || !input.status) {
            throw new errors_1.ValidationError('title, projectId and status are required');
        }
        const projectId = (0, objectId_1.toObjectId)(input.projectId, 'projectId');
        const project = await this.projectRepo.findById(projectId);
        if (!project)
            throw new errors_1.NotFoundError('Project', input.projectId);
        const assignedUserId = await this.validateAssignedUser(input.assignedUserId);
        const tagIds = await this.validateTags(input.tagIds);
        const now = new Date();
        return this.repo.insert({
            title: input.title,
            description: input.description ?? '',
            projectId,
            status: input.status,
            assignedUserId,
            tagIds,
            createdAt: now,
            updatedAt: now
        });
    }
    async update(id, input) {
        const objectId = (0, objectId_1.toObjectId)(id);
        const update = { updatedAt: new Date() };
        if (input.title !== undefined)
            update.title = input.title;
        if (input.description !== undefined)
            update.description = input.description;
        if (input.status !== undefined)
            update.status = input.status;
        if (input.assignedUserId !== undefined) {
            update.assignedUserId = await this.validateAssignedUser(input.assignedUserId);
        }
        if (input.tagIds !== undefined) {
            update.tagIds = await this.validateTags(input.tagIds);
        }
        const updated = await this.repo.updateById(objectId, update);
        if (!updated)
            throw new errors_1.NotFoundError('Task', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('Task', id);
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map