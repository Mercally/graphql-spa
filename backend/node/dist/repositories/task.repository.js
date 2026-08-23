"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const base_repository_1 = require("./base.repository");
class TaskRepository extends base_repository_1.BaseRepository {
    constructor(db) {
        super(db, 'tasks');
    }
    async findByProjectId(projectId) {
        return this.collection.find({ projectId }).toArray();
    }
    async findFiltered(filter, limit = 50, offset = 0) {
        const query = {};
        if (filter.projectId)
            query.projectId = filter.projectId;
        if (filter.status)
            query.status = filter.status;
        return this.collection.find(query).skip(offset).limit(limit).toArray();
    }
    async countFiltered(filter) {
        const query = {};
        if (filter.projectId)
            query.projectId = filter.projectId;
        if (filter.status)
            query.status = filter.status;
        return this.collection.countDocuments(query);
    }
}
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=task.repository.js.map