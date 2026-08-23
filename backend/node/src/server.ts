import { loadConfig } from './config/env';
import { connectMongo } from './db/mongo';
import { buildApp } from './app';

async function main(): Promise<void> {
  const config = loadConfig();
  const { db } = await connectMongo(config);
  const app = await buildApp(db);

  await app.listen({ port: config.port, host: '0.0.0.0' });
  app.log.info(`REST API at http://localhost:${config.port}/api`);
  app.log.info(`GraphQL API at http://localhost:${config.port}/graphql`);
  app.log.info(`GraphiQL IDE at http://localhost:${config.port}/graphiql`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
