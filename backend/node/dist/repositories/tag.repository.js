"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const base_repository_1 = require("./base.repository");
class TagRepository extends base_repository_1.BaseRepository {
    constructor(db) {
        super(db, 'tags');
    }
}
exports.TagRepository = TagRepository;
//# sourceMappingURL=tag.repository.js.map