import { FastifyInstance, FastifyError } from 'fastify';
import { NotFoundError, ValidationError } from '../errors';

/**
 * Single consistent error response shape for the whole REST API:
 *   { "error": { "message": string, "statusCode": number } }
 * Never leaks stack traces to the client; full error is still logged via pino.
 */
export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: Error | FastifyError, request, reply) => {
    if (error instanceof NotFoundError) {
      reply.code(404).send({ error: { message: error.message, statusCode: 404 } });
      return;
    }
    if (error instanceof ValidationError) {
      reply.code(400).send({ error: { message: error.message, statusCode: 400 } });
      return;
    }
    const fastifyError = error as FastifyError;
    if (fastifyError.statusCode && fastifyError.statusCode < 500) {
      reply
        .code(fastifyError.statusCode)
        .send({ error: { message: error.message, statusCode: fastifyError.statusCode } });
      return;
    }

    request.log.error(error);
    reply.code(500).send({ error: { message: 'Internal Server Error', statusCode: 500 } });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: { message: `Route ${request.method} ${request.url} not found`, statusCode: 404 } });
  });
}
