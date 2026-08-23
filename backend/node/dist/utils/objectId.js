"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = toObjectId;
exports.toObjectIds = toObjectIds;
const mongodb_1 = require("mongodb");
const errors_1 = require("../errors");
function toObjectId(id, fieldName = 'id') {
    if (!mongodb_1.ObjectId.isValid(id)) {
        throw new errors_1.ValidationError(`Invalid ${fieldName}: '${id}' is not a valid ObjectId`);
    }
    return new mongodb_1.ObjectId(id);
}
function toObjectIds(ids, fieldName = 'ids') {
    if (!ids)
        return [];
    return ids.map((id) => toObjectId(id, fieldName));
}
//# sourceMappingURL=objectId.js.map