/**
 * Shared error types used by the service layer, and consumed by both the REST
 * error hook and the GraphQL error formatter, so REST and GraphQL report the
 * same failures consistently without duplicating logic.
 */
export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
