import { FastifyPluginAsync } from 'fastify';
import { Services } from '../../services';
import { mapCustomer } from '../../mappers';

export function customerRoutes(services: Services): FastifyPluginAsync {
  return async (app) => {
    app.get('/', async (request) => {
      const { limit, offset } = request.query as { limit?: string; offset?: string };
      const items = await services.customers.list(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined
      );
      return items.map(mapCustomer);
    });

    app.get('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const customer = await services.customers.getById(id);
      return mapCustomer(customer);
    });

    app.post('/', async (request, reply) => {
      const created = await services.customers.create(request.body as { name: string; email: string });
      reply.code(201).send(mapCustomer(created));
    });

    app.put('/:id', async (request) => {
      const { id } = request.params as { id: string };
      const updated = await services.customers.update(id, request.body as Record<string, unknown>);
      return mapCustomer(updated);
    });

    app.delete('/:id', async (request, reply) => {
      const { id } = request.params as { id: string };
      await services.customers.remove(id);
      reply.code(204).send();
    });
  };
}
