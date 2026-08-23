"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class TagService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list(limit, offset) {
        return this.repo.findAll({}, limit, offset);
    }
    async getById(id) {
        const tag = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!tag)
            throw new errors_1.NotFoundError('Tag', id);
        return tag;
    }
    async create(input) {
        if (!input.name || !input.color) {
            throw new errors_1.ValidationError('name and color are required');
        }
        return this.repo.insert({
            name: input.name,
            color: input.color,
            createdAt: new Date()
        });
    }
    async update(id, input) {
        const updated = await this.repo.updateById((0, objectId_1.toObjectId)(id), input);
        if (!updated)
            throw new errors_1.NotFoundError('Tag', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('Tag', id);
    }
}
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map