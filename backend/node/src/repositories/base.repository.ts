import { Collection, Db, Filter, ObjectId, OptionalUnlessRequiredId, WithId } from 'mongodb';

/**
 * Thin generic wrapper around a single MongoDB collection using the official
 * `mongodb` driver (no ODM), matching the .NET side's raw MongoDB.Driver usage.
 */
export class BaseRepository<T extends { _id: ObjectId }> {
  protected readonly collection: Collection<T>;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  async findAll(filter: Filter<T> = {}, limit = 50, offset = 0): Promise<WithId<T>[]> {
    return this.collection.find(filter).skip(offset).limit(limit).toArray();
  }

  async count(filter: Filter<T> = {}): Promise<number> {
    return this.collection.countDocuments(filter);
  }

  async findById(id: ObjectId): Promise<WithId<T> | null> {
    return this.collection.findOne({ _id: id } as Filter<T>);
  }

  async findByIds(ids: ObjectId[]): Promise<WithId<T>[]> {
    if (ids.length === 0) return [];
    return this.collection.find({ _id: { $in: ids } } as Filter<T>).toArray();
  }

  async insert(doc: OptionalUnlessRequiredId<T>): Promise<WithId<T>> {
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId } as WithId<T>;
  }

  async updateById(id: ObjectId, update: Partial<T>): Promise<WithId<T> | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: id } as Filter<T>,
      { $set: update },
      { returnDocument: 'after' }
    );
    return result ?? null;
  }

  async deleteById(id: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id } as Filter<T>);
    return result.deletedCount === 1;
  }
}
