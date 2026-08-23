"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = customerRoutes;
const mappers_1 = require("../../mappers");
function customerRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { limit, offset } = request.query;
            const items = await services.customers.list(limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return items.map(mappers_1.mapCustomer);
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const customer = await services.customers.getById(id);
            return (0, mappers_1.mapCustomer)(customer);
        });
        app.post('/', async (request, reply) => {
            const created = await services.customers.create(request.body);
            reply.code(201).send((0, mappers_1.mapCustomer)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.customers.update(id, request.body);
            return (0, mappers_1.mapCustomer)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.customers.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=customers.routes.js.map