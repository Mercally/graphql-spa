"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRoutes = tagRoutes;
const mappers_1 = require("../../mappers");
function tagRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { limit, offset } = request.query;
            const items = await services.tags.list(limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return items.map(mappers_1.mapTag);
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const tag = await services.tags.getById(id);
            return (0, mappers_1.mapTag)(tag);
        });
        app.post('/', async (request, reply) => {
            const created = await services.tags.create(request.body);
            reply.code(201).send((0, mappers_1.mapTag)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.tags.update(id, request.body);
            return (0, mappers_1.mapTag)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.tags.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=tags.routes.js.map