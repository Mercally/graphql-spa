"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class ProjectService {
    repo;
    customerRepo;
    constructor(repo, customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
    }
    async list(filter = {}, limit, offset) {
        if (filter.customerId) {
            return this.repo.findByCustomerId((0, objectId_1.toObjectId)(filter.customerId, 'customerId'));
        }
        return this.repo.findAll({}, limit, offset);
    }
    async getById(id) {
        const project = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!project)
            throw new errors_1.NotFoundError('Project', id);
        return project;
    }
    async create(input) {
        if (!input.name || !input.customerId || !input.status) {
            throw new errors_1.ValidationError('name, customerId and status are required');
        }
        const customerId = (0, objectId_1.toObjectId)(input.customerId, 'customerId');
        const customer = await this.customerRepo.findById(customerId);
        if (!customer)
            throw new errors_1.NotFoundError('Customer', input.customerId);
        const now = new Date();
        return this.repo.insert({
            name: input.name,
            description: input.description ?? '',
            customerId,
            status: input.status,
            createdAt: now,
            updatedAt: now
        });
    }
    async update(id, input) {
        const objectId = (0, objectId_1.toObjectId)(id);
        const update = { updatedAt: new Date() };
        if (input.name !== undefined)
            update.name = input.name;
        if (input.description !== undefined)
            update.description = input.description;
        if (input.status !== undefined)
            update.status = input.status;
        if (input.customerId !== undefined) {
            const customerId = (0, objectId_1.toObjectId)(input.customerId, 'customerId');
            const customer = await this.customerRepo.findById(customerId);
            if (!customer)
                throw new errors_1.NotFoundError('Customer', input.customerId);
            update.customerId = customerId;
        }
        const updated = await this.repo.updateById(objectId, update);
        if (!updated)
            throw new errors_1.NotFoundError('Project', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('Project', id);
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map