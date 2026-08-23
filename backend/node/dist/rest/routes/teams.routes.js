"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRoutes = teamRoutes;
const mappers_1 = require("../../mappers");
function teamRoutes(services) {
    return async (app) => {
        app.get('/', async (request) => {
            const { projectId, limit, offset } = request.query;
            const items = await services.teams.list({ projectId }, limit ? Number(limit) : undefined, offset ? Number(offset) : undefined);
            return items.map(mappers_1.mapTeam);
        });
        app.get('/:id', async (request) => {
            const { id } = request.params;
            const team = await services.teams.getById(id);
            return (0, mappers_1.mapTeam)(team);
        });
        app.post('/', async (request, reply) => {
            const created = await services.teams.create(request.body);
            reply.code(201).send((0, mappers_1.mapTeam)(created));
        });
        app.put('/:id', async (request) => {
            const { id } = request.params;
            const updated = await services.teams.update(id, request.body);
            return (0, mappers_1.mapTeam)(updated);
        });
        app.delete('/:id', async (request, reply) => {
            const { id } = request.params;
            await services.teams.remove(id);
            reply.code(204).send();
        });
    };
}
//# sourceMappingURL=teams.routes.js.map