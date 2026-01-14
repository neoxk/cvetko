export type ErrorDetails = Record<string, unknown>;

export type AppErrorOptions = {
  code?: string;
  details?: ErrorDetails;
  cause?: unknown;
};

export class AppError extends Error {
  code?: string;
  details?: ErrorDetails;
  override cause?: unknown;

  constructor(name: string, message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = name;
    if (options.code !== undefined) {
      this.code = options.code;
    }

    if (options.details !== undefined) {
      this.details = options.details;
    }

    if (Object.prototype.hasOwnProperty.call(options, 'cause')) {
      this.cause = options.cause;
    }
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;

export const createAppError = (
  name: string,
  message: string,
  options?: AppErrorOptions,
): AppError => new AppError(name, message, options);

export const toAppError = (
  error: unknown,
  fallback: {
    name: string;
    message: string;
    code?: string;
    details?: ErrorDetails;
  },
): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    const options: AppErrorOptions = { cause: error };

    if (fallback.code !== undefined) {
      options.code = fallback.code;
    }

    if (fallback.details !== undefined) {
      options.details = fallback.details;
    }

    return new AppError(error.name || fallback.name, error.message || fallback.message, options);
  }

  const options: AppErrorOptions = { cause: error };

  if (fallback.code !== undefined) {
    options.code = fallback.code;
  }

  if (fallback.details !== undefined) {
    options.details = fallback.details;
  }

  return new AppError(fallback.name, fallback.message, options);
};
