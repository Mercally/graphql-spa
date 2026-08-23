"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerErrorHandler = registerErrorHandler;
const errors_1 = require("../errors");
/**
 * Single consistent error response shape for the whole REST API:
 *   { "error": { "message": string, "statusCode": number } }
 * Never leaks stack traces to the client; full error is still logged via pino.
 */
function registerErrorHandler(app) {
    app.setErrorHandler((error, request, reply) => {
        if (error instanceof errors_1.NotFoundError) {
            reply.code(404).send({ error: { message: error.message, statusCode: 404 } });
            return;
        }
        if (error instanceof errors_1.ValidationError) {
            reply.code(400).send({ error: { message: error.message, statusCode: 400 } });
            return;
        }
        const fastifyError = error;
        if (fastifyError.statusCode && fastifyError.statusCode < 500) {
            reply
                .code(fastifyError.statusCode)
                .send({ error: { message: error.message, statusCode: fastifyError.statusCode } });
            return;
        }
        request.log.error(error);
        reply.code(500).send({ error: { message: 'Internal Server Error', statusCode: 500 } });
    });
    app.setNotFoundHandler((request, reply) => {
        reply.code(404).send({ error: { message: `Route ${request.method} ${request.url} not found`, statusCode: 404 } });
    });
}
//# sourceMappingURL=error-handler.js.map