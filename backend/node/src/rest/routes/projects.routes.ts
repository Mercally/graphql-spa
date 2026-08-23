import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapProject } from '../../mappers';

export function projectRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { customerId, limit, offset } = request.query as {
        customerId?: string;
        limit?: string;
        offset?: string;
      };
      const items = await services.projects.list(
        { customerId },
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return items.map(mapProject);
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const project = await services.projects.getById(id);
      return mapProject(project);
    });

    app.post('/', async (request, reply) => {
      const created = await services.projects.create(request.body as never);
      reply.code(201).send(mapProject(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.projects.update(id, request.body as Record<string, unknown>);
      return mapProject(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.projects.remove(id);
      reply.code(204).send();
    });
  };
}
