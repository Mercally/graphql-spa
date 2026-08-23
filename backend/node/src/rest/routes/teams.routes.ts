import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapTeam } from '../../mappers';

export function teamRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { projectId, limit, offset } = request.query as {
        projectId?: string;
        limit?: string;
        offset?: string;
      };
      const items = await services.teams.list(
        { projectId },
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return items.map(mapTeam);
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const team = await services.teams.getById(id);
      return mapTeam(team);
    });

    app.post('/', async (request, reply) => {
      const created = await services.teams.create(request.body as never);
      reply.code(201).send(mapTeam(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.teams.update(id, request.body as Record<string, unknown>);
      return mapTeam(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.teams.remove(id);
      reply.code(204).send();
    });
  };
}
