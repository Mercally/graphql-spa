"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.NotFoundError = void 0;
/**
 * Shared error types used by the service layer, and consumed by both the REST
 * error hook and the GraphQL error formatter, so REST and GraphQL report the
 * same failures consistently without duplicating logic.
 */
class NotFoundError extends Error {
    constructor(entity, id) {
        super(`${entity} with id '${id}' not found`);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=errors.js.map