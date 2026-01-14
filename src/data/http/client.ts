import { logger } from '@utils/logger';
import { createApiError, normalizeApiError } from '@data/errors';
import type { HttpMethod, HttpResponse, RequestQuery } from '@data/types';

export type HttpClientOptions = {
  baseUrl: string;
  serviceName: string;
  defaultQuery?: RequestQuery;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
  fetcher?: typeof fetch;
};

export type RequestOptions = {
  path: string;
  method?: HttpMethod;
  query?: RequestQuery;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export type HttpClient = {
  request: <T>(options: RequestOptions) => Promise<HttpResponse<T>>;
  get: <T>(path: string, options?: Omit<RequestOptions, 'path' | 'method'>) => Promise<HttpResponse<T>>;
  post: <T>(path: string, options?: Omit<RequestOptions, 'path' | 'method'>) => Promise<HttpResponse<T>>;
};

const buildUrl = (baseUrl: string, path: string, query?: RequestQuery): string => {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBase);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

const headersToRecord = (headers: Headers): Record<string, string> => {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return (await response.text()) as T;
  }
  return (await response.json()) as T;
};

export const createHttpClient = (options: HttpClientOptions): HttpClient => {
  const fetcher = options.fetcher ?? fetch;

  const request = async <T>(requestOptions: RequestOptions): Promise<HttpResponse<T>> => {
    const method = requestOptions.method ?? 'GET';
    const timeoutMs = requestOptions.timeoutMs ?? options.timeoutMs;
    const headers: Record<string, string> = {
      ...(options.defaultHeaders ?? {}),
      ...(requestOptions.headers ?? {}),
    };
    const query: RequestQuery = {
      ...(options.defaultQuery ?? {}),
      ...(requestOptions.query ?? {}),
    };

    const url = buildUrl(options.baseUrl, requestOptions.path, query);
    const controller = new AbortController();
    let didTimeout = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (timeoutMs) {
      timeoutId = setTimeout(() => {
        didTimeout = true;
        controller.abort();
      }, timeoutMs);
    }

    if (requestOptions.signal) {
      requestOptions.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    let body: string | undefined;
    if (requestOptions.body !== undefined) {
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      body = typeof requestOptions.body === 'string' ? requestOptions.body : JSON.stringify(requestOptions.body);
    }

    try {
      const init: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body !== undefined) {
        init.body = body;
      }

      const response = await fetcher(url, init);

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorBody = await parseJson<{
            message?: string;
            error?: string;
            code?: string;
          }>(response);
          if (typeof errorBody === 'string') {
            errorMessage = errorBody;
          } else if (errorBody?.message) {
            errorMessage = errorBody.message;
          } else if (errorBody?.error) {
            errorMessage = errorBody.error;
          }
        } catch (parseError) {
          throw createApiError('Failed to parse error response', {
            kind: 'parse',
            service: options.serviceName,
            status: response.status,
            retryable: false,
            context: { path: requestOptions.path },
          }, parseError);
        }

        throw createApiError(errorMessage, {
          kind: 'http',
          service: options.serviceName,
          status: response.status,
          retryable: response.status >= 500 || response.status === 429,
          context: { path: requestOptions.path },
        });
      }

      const data = await parseJson<T>(response);
      return {
        data,
        status: response.status,
        headers: headersToRecord(response.headers),
      };
    } catch (error) {
      const normalized = normalizeApiError(error, {
        service: options.serviceName,
        message: didTimeout ? 'Request timed out' : 'Request failed',
        kind: didTimeout ? 'timeout' : 'network',
        retryable: true,
        context: { path: requestOptions.path },
      });

      logger.error('HTTP request failed', {
        error: normalized,
        service: options.serviceName,
        path: requestOptions.path,
      });

      throw normalized;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  return {
    request,
    get: (path, options) =>
      request({
        ...options,
        path,
        method: 'GET',
      }),
    post: (path, options) =>
      request({
        ...options,
        path,
        method: 'POST',
      }),
  };
};
