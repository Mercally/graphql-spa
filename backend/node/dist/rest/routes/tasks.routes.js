"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = taskRoutes;
const mappers_1 = require("../../mappers");
function taskRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { status, projectId, limit, offset } = request.query;
            const { items, total } = await services.tasks.list({ status, projectId }, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return { items: items.map(mappers_1.mapTask), total };
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const task = await services.tasks.getById(id);
            return (0, mappers_1.mapTask)(task);
        });
        app.post('/', async (request, reply) => {
            const created = await services.tasks.create(request.body);
            reply.code(201).send((0, mappers_1.mapTask)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.tasks.update(id, request.body);
            return (0, mappers_1.mapTask)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.tasks.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=tasks.routes.js.map