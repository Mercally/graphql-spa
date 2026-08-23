"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = projectRoutes;
const mappers_1 = require("../../mappers");
function projectRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { customerId, limit, offset } = request.query;
            const items = await services.projects.list({ customerId }, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return items.map(mappers_1.mapProject);
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const project = await services.projects.getById(id);
            return (0, mappers_1.mapProject)(project);
        });
        app.post('/', async (request, reply) => {
            const created = await services.projects.create(request.body);
            reply.code(201).send((0, mappers_1.mapProject)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.projects.update(id, request.body);
            return (0, mappers_1.mapProject)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.projects.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=projects.routes.js.map