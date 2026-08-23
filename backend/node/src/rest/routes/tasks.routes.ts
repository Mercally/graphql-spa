import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapTask } from '../../mappers';
import { TaskStatus } from '../../models/entities';

export function taskRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { status, projectId, limit, offset } = request.query as {
        status?: TaskStatus;
        projectId?: string;
        limit?: string;
        offset?: string;
      };
      const { items, total } = await services.tasks.list(
        { status, projectId },
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return { items: items.map(mapTask), total };
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const task = await services.tasks.getById(id);
      return mapTask(task);
    });

    app.post('/', async (request, reply) => {
      const created = await services.tasks.create(request.body as never);
      reply.code(201).send(mapTask(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.tasks.update(id, request.body as Record<string, unknown>);
      return mapTask(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.tasks.remove(id);
      reply.code(204).send();
    });
  };
}
