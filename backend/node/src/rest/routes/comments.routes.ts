import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapComment } from '../../mappers';

export function commentRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { taskId, limit, offset } = request.query as {
        taskId?: string;
        limit?: string;
        offset?: string;
      };
      const items = await services.comments.list(
        { taskId },
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return items.map(mapComment);
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const comment = await services.comments.getById(id);
      return mapComment(comment);
    });

    app.post('/', async (request, reply) => {
      const created = await services.comments.create(request.body as never);
      reply.code(201).send(mapComment(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.comments.update(id, request.body as Record<string, unknown>);
      return mapComment(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.comments.remove(id);
      reply.code(204).send();
    });
  };
}
