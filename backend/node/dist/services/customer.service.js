"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const errors_1 = require("../errors");
const objectId_1 = require("../utils/objectId");
class CustomerService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list(limit, offset) {
        return this.repo.findAll({}, limit, offset);
    }
    async getById(id) {
        const customer = await this.repo.findById((0, objectId_1.toObjectId)(id));
        if (!customer)
            throw new errors_1.NotFoundError('Customer', id);
        return customer;
    }
    async create(input) {
        if (!input.name || !input.email) {
            throw new errors_1.ValidationError('name and email are required');
        }
        return this.repo.insert({
            name: input.name,
            email: input.email,
            createdAt: new Date()
        });
    }
    async update(id, input) {
        const objectId = (0, objectId_1.toObjectId)(id);
        const updated = await this.repo.updateById(objectId, input);
        if (!updated)
            throw new errors_1.NotFoundError('Customer', id);
        return updated;
    }
    async remove(id) {
        const deleted = await this.repo.deleteById((0, objectId_1.toObjectId)(id));
        if (!deleted)
            throw new errors_1.NotFoundError('Customer', id);
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map