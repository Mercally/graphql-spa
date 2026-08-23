import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapUser } from '../../mappers';

export function userRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { limit, offset } = request.query as { limit?: string; offset?: string };
      const items = await services.users.list(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return items.map(mapUser);
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const user = await services.users.getById(id);
      return mapUser(user);
    });

    app.post('/', async (request, reply) => {
      const created = await services.users.create(request.body as never);
      reply.code(201).send(mapUser(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.users.update(id, request.body as Record<string, unknown>);
      return mapUser(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.users.remove(id);
      reply.code(204).send();
    });
  };
}
