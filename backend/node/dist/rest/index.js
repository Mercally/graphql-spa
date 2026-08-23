"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRestRoutes = registerRestRoutes;
const customers_routes_1 = require("./routes/customers.routes");
const projects_routes_1 = require("./routes/projects.routes");
const teams_routes_1 = require("./routes/teams.routes");
const users_routes_1 = require("./routes/users.routes");
const tasks_routes_1 = require("./routes/tasks.routes");
const tags_routes_1 = require("./routes/tags.routes");
const comments_routes_1 = require("./routes/comments.routes");
async function registerRestRoutes(app, services) {
    await app.register((0, customers_routes_1.customerRoutes)(services), { prefix: '/api/customers' });
    await app.register((0, projects_routes_1.projectRoutes)(services), { prefix: '/api/projects' });
    await app.register((0, teams_routes_1.teamRoutes)(services), { prefix: '/api/teams' });
    await app.register((0, users_routes_1.userRoutes)(services), { prefix: '/api/users' });
    await app.register((0, tasks_routes_1.taskRoutes)(services), { prefix: '/api/tasks' });
    await app.register((0, tags_routes_1.tagRoutes)(services), { prefix: '/api/tags' });
    await app.register((0, comments_routes_1.commentRoutes)(services), { prefix: '/api/comments' });
}
//# sourceMappingURL=index.js.map