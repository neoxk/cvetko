import { getNetworkStatus } from './status';

describe('getNetworkStatus', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
    jest.clearAllMocks();
  });

  it('uses navigator.onLine when available', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { onLine: true } as Navigator,
      configurable: true,
    });

    await expect(getNetworkStatus()).resolves.toBe('online');
  });

  it('falls back to fetch check when navigator is missing', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: undefined,
      configurable: true,
    });
    const fetcher = jest.fn(async () => ({ ok: true })) as unknown as typeof fetch;

    await expect(getNetworkStatus({ fetcher })).resolves.toBe('online');
    expect(fetcher).toHaveBeenCalled();
  });
});
