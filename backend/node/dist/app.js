"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAppWithServices = buildAppWithServices;
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const services_1 = require("./services");
const rest_1 = require("./rest");
const error_handler_1 = require("./rest/error-handler");
const graphql_1 = require("./graphql");
/**
 * Builds the Fastify app from an already-assembled `Services` container.
 * Split out from `buildApp` so tests can inject fake/in-memory services
 * without needing a real MongoDB connection.
 */
async function buildAppWithServices(services, options = {}) {
    const app = (0, fastify_1.default)({ logger: options.logger ?? true });
    // Permissive CORS for local dev only (Angular/React dev servers, etc.) — this
    // is an explicit PoC-only choice per Requirements.md (no production hardening).
    await app.register(cors_1.default, { origin: true });
    (0, error_handler_1.registerErrorHandler)(app);
    await (0, rest_1.registerRestRoutes)(app, services);
    await (0, graphql_1.registerGraphQL)(app, services);
    app.get('/health', async () => ({ status: 'ok' }));
    return app;
}
async function buildApp(db) {
    return buildAppWithServices((0, services_1.buildServices)(db));
}
//# sourceMappingURL=app.js.map