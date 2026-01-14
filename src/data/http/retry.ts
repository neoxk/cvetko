import { isRetryableError } from '@data/errors';

export type RetryOptions = {
  retries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterMs?: number;
};

export const defaultRetryOptions: RetryOptions = {
  retries: 2,
  baseDelayMs: 300,
  maxDelayMs: 2000,
  jitterMs: 100,
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const calculateDelay = (attempt: number, options: RetryOptions): number => {
  const exponential = options.baseDelayMs * Math.pow(2, attempt);
  const capped = Math.min(exponential, options.maxDelayMs);
  const jitter = options.jitterMs ? Math.floor(Math.random() * options.jitterMs) : 0;
  return capped + jitter;
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = defaultRetryOptions,
): Promise<T> => {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableError(error) || attempt >= options.retries) {
        throw error;
      }

      const delay = calculateDelay(attempt, options);
      attempt += 1;
      await sleep(delay);
    }
  }
};
