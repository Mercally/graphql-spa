import Fastify, { FastifyInstance, FastifyBaseLogger } from 'fastify';
import cors from '@fastify/cors';
import { Db } from 'mongodb';
import { buildServices, Services } from './services';
import { registerRestRoutes } from './rest';
import { registerErrorHandler } from './rest/error-handler';
import { registerGraphQL } from './graphql';

/**
 * Builds the Fastify app from an already-assembled `Services` container.
 * Split out from `buildApp` so tests can inject fake/in-memory services
 * without needing a real MongoDB connection.
 */
export async function buildAppWithServices(
  services: Services,
  options: { logger?: boolean | FastifyBaseLogger } = {}
): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? true });

  // Permissive CORS for local dev only (Angular/React dev servers, etc.) — this
  // is an explicit PoC-only choice per Requirements.md (no production hardening).
  await app.register(cors, { origin: true });

  registerErrorHandler(app);

  await registerRestRoutes(app, services);
  await registerGraphQL(app, services);

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

export async function buildApp(db: Db): Promise<FastifyInstance> {
  return buildAppWithServices(buildServices(db));
}
