export type NetworkStatus = 'online' | 'offline' | 'unknown';

export type NetworkStatusOptions = {
  fetcher?: typeof fetch;
  timeoutMs?: number;
  url?: string;
};

const defaultUrl = 'https://example.com';

export const getNetworkStatus = async (
  options: NetworkStatusOptions = {},
): Promise<NetworkStatus> => {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine ? 'online' : 'offline';
  }

  const fetcher = options.fetcher ?? fetch;
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (options.timeoutMs) {
    timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);
  }

  try {
    const response = await fetcher(options.url ?? defaultUrl, {
      method: 'HEAD',
      signal: controller.signal,
    });
    return response.ok ? 'online' : 'offline';
  } catch {
    return 'offline';
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};
