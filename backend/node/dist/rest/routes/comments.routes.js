"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = commentRoutes;
const mappers_1 = require("../../mappers");
function commentRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { taskId, limit, offset } = request.query;
            const items = await services.comments.list({ taskId }, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return items.map(mappers_1.mapComment);
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const comment = await services.comments.getById(id);
            return (0, mappers_1.mapComment)(comment);
        });
        app.post('/', async (request, reply) => {
            const created = await services.comments.create(request.body);
            reply.code(201).send((0, mappers_1.mapComment)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.comments.update(id, request.body);
            return (0, mappers_1.mapComment)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.comments.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=comments.routes.js.map