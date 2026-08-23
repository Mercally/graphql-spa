"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const base_repository_1 = require("./base.repository");
class ProjectRepository extends base_repository_1.BaseRepository {
    constructor(db) {
        super(db, 'projects');
    }
    async findByCustomerId(customerId) {
        return this.collection.find({ customerId }).toArray();
    }
}
exports.ProjectRepository = ProjectRepository;
//# sourceMappingURL=project.repository.js.map