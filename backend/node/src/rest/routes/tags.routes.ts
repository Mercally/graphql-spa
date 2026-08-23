import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapTag } from '../../mappers';

export function tagRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { limit, offset } = request.query as { limit?: string; offset?: string };
      const items = await services.tags.list(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return items.map(mapTag);
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const tag = await services.tags.getById(id);
      return mapTag(tag);
    });

    app.post('/', async (request, reply) => {
      const created = await services.tags.create(request.body as never);
      reply.code(201).send(mapTag(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.tags.update(id, request.body as Record<string, unknown>);
      return mapTag(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.tags.remove(id);
      reply.code(204).send();
    });
  };
}
