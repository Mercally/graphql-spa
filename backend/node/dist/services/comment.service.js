"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class CommentService {
    repo;
    taskRepo;
    userRepo;
    constructor(repo, taskRepo, userRepo) {
        this.repo = repo;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }
    async list(filter = {}, limit, offset) {
        if (filter.taskId) {
            return this.repo.findByTaskId((0, objectId_1.toObjectId)(filter.taskId, 'taskId'));
        }
        return this.repo.findAll({}, limit, offset);
    }
    async getById(id) {
        const comment = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!comment)
            throw new errors_1.NotFoundError('Comment', id);
        return comment;
    }
    async create(input) {
        if (!input.text || !input.taskId || !input.userId) {
            throw new errors_1.ValidationError('text, taskId and userId are required');
        }
        const taskId = (0, objectId_1.toObjectId)(input.taskId, 'taskId');
        const task = await this.taskRepo.findById(taskId);
        if (!task)
            throw new errors_1.NotFoundError('Task', input.taskId);
        const userId = (0, objectId_1.toObjectId)(input.userId, 'userId');
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User', input.userId);
        return this.repo.insert({
            text: input.text,
            taskId,
            userId,
            createdAt: new Date()
        });
    }
    async update(id, input) {
        const updated = await this.repo.updateById((0, objectId_1.toObjectId)(id), input);
        if (!updated)
            throw new errors_1.NotFoundError('Comment', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('Comment', id);
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map