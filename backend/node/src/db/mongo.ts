import { Db, MongoClient } from 'mongodb';
import { AppConfig } from '../config/env';

export interface MongoContext {
  client: MongoClient;
  db: Db;
}

export async function connectMongo(config: AppConfig): Promise<MongoContext> {
  const client = new MongoClient(config.mongoConnectionString);
  await client.connect();
  const db = client.db(config.mongoDatabase);
  return { client, db };
}
