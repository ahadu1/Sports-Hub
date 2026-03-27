export class AppError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = 'AppError';
  }
}

export class ApiError extends AppError {
  readonly details: string | undefined;

  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    options?: { details?: string; cause?: unknown },
  ) {
    super(message, options?.cause);
    this.name = 'ApiError';
    this.details = options?.details;
  }
}

export class ValidationError extends AppError {
  readonly zodIssues: unknown | undefined;

  constructor(message: string, zodIssues?: unknown, cause?: unknown) {
    super(message, cause);
    this.name = 'ValidationError';
    this.zodIssues = zodIssues;
  }
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  return new Error('Unknown error');
}

export function isRetryableStatus(status: number): boolean {
  if (status === 408 || status === 429) {
    return true;
  }
  if (status >= 500) {
    return true;
  }
  if (status === 0) {
    return true;
  }
  return false;
}

export function isNonRetryableClientError(error: unknown): boolean {
  if (error instanceof ApiError) {
    if (error.status >= 400 && error.status < 500) {
      return !isRetryableStatus(error.status);
    }
  }
  return false;
}
