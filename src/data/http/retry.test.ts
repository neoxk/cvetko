import { createApiError } from '@data/errors';
import { withRetry } from './retry';

describe('withRetry', () => {
  it('retries when error is retryable', async () => {
    const error = createApiError('Temporary failure', {
      kind: 'network',
      service: 'perenual',
      retryable: true,
    });
    let attempts = 0;

    const promise = withRetry(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw error;
        }
        return 'ok';
      },
      { retries: 2, baseDelayMs: 1, maxDelayMs: 1, jitterMs: 0 },
    );
    await expect(promise).resolves.toBe('ok');
    expect(attempts).toBe(3);
  });

  it('does not retry non-retryable errors', async () => {
    const error = createApiError('Bad request', {
      kind: 'http',
      service: 'perenual',
      retryable: false,
      status: 400,
    });
    let attempts = 0;

    const promise = withRetry(
      async () => {
        attempts += 1;
        throw error;
      },
      { retries: 2, baseDelayMs: 1, maxDelayMs: 1, jitterMs: 0 },
    );
    await expect(promise).rejects.toBe(error);
    expect(attempts).toBe(1);
  });
});
