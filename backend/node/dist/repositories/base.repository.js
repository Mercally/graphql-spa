"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Thin generic wrapper around a single MongoDB collection using the official
 * `mongodb` driver (no ODM), matching the .NET side's raw MongoDB.Driver usage.
 */
class BaseRepository {
    collection;
    constructor(db, collectionName) {
        this.collection = db.collection(collectionName);
    }
    async findAll(filter = {}, limit = 50, offset = 0) {
        return this.collection.find(filter).skip(offset).limit(limit).toArray();
    }
    async count(filter = {}) {
        return this.collection.countDocuments(filter);
    }
    async findById(id) {
        return this.collection.findOne({ _id: id });
    }
    async findByIds(ids) {
        if (ids.length === 0)
            return [];
        return this.collection.find({ _id: { $in: ids } }).toArray();
    }
    async insert(doc) {
        const result = await this.collection.insertOne(doc);
        return { ...doc, _id: result.insertedId };
    }
    async updateById(id, update) {
        const result = await this.collection.findOneAndUpdate({ _id: id }, { $set: update }, { returnDocument: 'after' });
        return result ?? null;
    }
    async deleteById(id) {
        const result = await this.collection.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map