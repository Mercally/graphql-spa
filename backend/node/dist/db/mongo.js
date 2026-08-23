"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongodb_1 = require("mongodb");
async function connectMongo(config) {
    const client = new mongodb_1.MongoClient(config.mongoConnectionString);
    await client.connect();
    const db = client.db(config.mongoDatabase);
    return { client, db };
}
//# sourceMappingURL=mongo.js.map