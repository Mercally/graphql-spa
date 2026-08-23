"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const base_repository_1 = require("./base.repository");
class CommentRepository extends base_repository_1.BaseRepository {
    constructor(db) {
        super(db, 'comments');
    }
    async findByTaskId(taskId) {
        return this.collection.find({ taskId }).toArray();
    }
}
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=comment.repository.js.map