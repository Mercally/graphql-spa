import { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { schema } from './schema';
import { buildResolvers, GraphQLContext } from './resolvers';
import { Services } from '../services';

/**
 * Registers Mercurius (GraphQL adapter for Fastify) at the default `/graphql`
 * endpoint, with its built-in GraphiQL IDE enabled at `/graphiql`
 * (`graphiql: true` — confirmed against current Mercurius docs via context7;
 * there is no separate "ide" option in this version).
 */
export async function registerGraphQL(app: FastifyInstance, services: Services): Promise<void> {
  await app.register(mercurius, {
    schema,
    resolvers: buildResolvers(),
    context: async (): Promise<GraphQLContext> => ({ services }),
    graphiql: true,
    // Keep error responses free of stack traces (mirrors the REST error hook).
    errorFormatter: (execution, ctx) => {
      const formatted = mercurius.defaultErrorFormatter(execution, ctx);
      for (const err of formatted.response.errors ?? []) {
        if (err.extensions) {
          delete err.extensions.stacktrace;
        }
      }
      return { statusCode: formatted.statusCode, response: formatted.response };
    }
  });
}
