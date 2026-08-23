"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class UserService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list(limit, offset) {
        return this.repo.findAll({}, limit, offset);
    }
    async getById(id) {
        const user = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!user)
            throw new errors_1.NotFoundError('User', id);
        return user;
    }
    async create(input) {
        if (!input.name || !input.email || !input.role) {
            throw new errors_1.ValidationError('name, email and role are required');
        }
        return this.repo.insert({
            name: input.name,
            email: input.email,
            role: input.role,
            createdAt: new Date()
        });
    }
    async update(id, input) {
        const updated = await this.repo.updateById((0, objectId_1.toObjectId)(id), input);
        if (!updated)
            throw new errors_1.NotFoundError('User', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('User', id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map