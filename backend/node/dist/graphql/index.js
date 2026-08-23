"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGraphQL = registerGraphQL;
const mercurius_1 = __importDefault(require("mercurius"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
/**
 * Registers Mercurius (GraphQL adapter for Fastify) at the default `/graphql`
 * endpoint, with its built-in GraphiQL IDE enabled at `/graphiql`
 * (`graphiql: true` — confirmed against current Mercurius docs via context7;
 * there is no separate "ide" option in this version).
 */
async function registerGraphQL(app, services) {
    await app.register(mercurius_1.default, {
        schema: schema_1.schema,
        resolvers: (0, resolvers_1.buildResolvers)(),
        context: async () => ({ services }),
        graphiql: true,
        // Keep error responses free of stack traces (mirrors the REST error hook).
        errorFormatter: (execution, ctx) => {
            const formatted = mercurius_1.default.defaultErrorFormatter(execution, ctx);
            for (const err of formatted.response.errors ?? []) {
                if (err.extensions) {
                    delete err.extensions.stacktrace;
                }
            }
            return { statusCode: formatted.statusCode, response: formatted.response };
        }
    });
}
//# sourceMappingURL=index.js.map