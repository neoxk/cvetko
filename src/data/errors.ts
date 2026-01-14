import { AppError, createAppError } from '@utils/errors';

export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse' | 'unknown';

export type ApiErrorDetails = {
  kind: ApiErrorKind;
  service: string;
  status?: number;
  code?: string;
  retryable: boolean;
  context?: Record<string, unknown>;
};

export const createApiError = (
  message: string,
  details: ApiErrorDetails,
  cause?: unknown,
): AppError =>
  createAppError('ApiError', message, {
    details,
    cause,
  });

export const normalizeApiError = (
  error: unknown,
  fallback: {
    service: string;
    message: string;
    kind?: ApiErrorKind;
    status?: number;
    code?: string;
    retryable?: boolean;
    context?: Record<string, unknown>;
  },
): AppError => {
  if (error instanceof AppError) {
    const details = error.details as ApiErrorDetails | undefined;
    if (details?.service) {
      return error;
    }
  }

  const details: ApiErrorDetails = {
    kind: fallback.kind ?? 'unknown',
    service: fallback.service,
    retryable: fallback.retryable ?? false,
  };

  if (fallback.status !== undefined) {
    details.status = fallback.status;
  }

  if (fallback.code !== undefined) {
    details.code = fallback.code;
  }

  if (fallback.context !== undefined) {
    details.context = fallback.context;
  }

  return createApiError(fallback.message, details, error);
};

export const getApiErrorDetails = (error: unknown): ApiErrorDetails | null => {
  if (error instanceof AppError) {
    const details = error.details as ApiErrorDetails | undefined;
    if (details?.service) {
      return details;
    }
  }

  return null;
};

export const isRetryableError = (error: unknown): boolean => {
  const details = getApiErrorDetails(error);
  if (!details) {
    return false;
  }

  if (details.retryable) {
    return true;
  }

  if (details.status === 429) {
    return true;
  }

  if (details.status !== undefined && details.status >= 500) {
    return true;
  }

  return false;
};
