import { AppError, createAppError, isAppError, toAppError } from './errors';

describe('errors', () => {
  it('creates typed errors with metadata', () => {
    const error = createAppError('NetworkError', 'Failed to fetch', {
      code: 'NETWORK',
      details: { retryable: true },
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('NetworkError');
    expect(error.message).toBe('Failed to fetch');
    expect(error.code).toBe('NETWORK');
    expect(error.details).toEqual({ retryable: true });
  });

  it('passes through existing AppError instances', () => {
    const original = createAppError('ConfigError', 'Missing key');
    const converted = toAppError(original, {
      name: 'FallbackError',
      message: 'Fallback message',
    });

    expect(converted).toBe(original);
    expect(isAppError(converted)).toBe(true);
  });

  it('wraps unknown errors with fallback metadata', () => {
    const original = new Error('Boom');
    const converted = toAppError(original, {
      name: 'UnknownError',
      message: 'Something went wrong',
      code: 'UNKNOWN',
    });

    expect(converted).toBeInstanceOf(AppError);
    expect(converted.name).toBe('Error');
    expect(converted.message).toBe('Boom');
    expect(converted.code).toBe('UNKNOWN');
    expect(converted.cause).toBe(original);
  });
});
