"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const mappers_1 = require("../../mappers");
function userRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { limit, offset } = request.query;
            const items = await services.users.list(limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return items.map(mappers_1.mapUser);
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const user = await services.users.getById(id);
            return (0, mappers_1.mapUser)(user);
        });
        app.post('/', async (request, reply) => {
            const created = await services.users.create(request.body);
            reply.code(201).send((0, mappers_1.mapUser)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.users.update(id, request.body);
            return (0, mappers_1.mapUser)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.users.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=users.routes.js.map