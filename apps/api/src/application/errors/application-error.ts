export abstract class ApplicationError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApplicationError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id ${id} not found` : `${resource} not found`);
  }
}

export class UnauthorizedError extends ApplicationError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends ApplicationError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class ConflictError extends ApplicationError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;

  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends ApplicationError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
  }
}
