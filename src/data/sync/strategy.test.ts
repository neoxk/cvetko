import { buildSyncPlan } from './strategy';
import { resolveSyncSource } from './policies';

describe('sync strategy', () => {
  it('prefers db when offline and available', () => {
    expect(
      resolveSyncSource({
        networkStatus: 'offline',
        dbAgeMs: 1000,
        cacheAgeMs: 500,
      }),
    ).toBe('db');
  });

  it('uses cache when fresh online', () => {
    const plan = buildSyncPlan({
      networkStatus: 'online',
      cacheAgeMs: 1000,
      dbAgeMs: 10_000,
      policy: { maxStaleMs: 5_000, offlineFallback: 'db' },
    });

    expect(plan.source).toBe('cache');
    expect(plan.shouldRefresh).toBe(false);
  });

  it('requests refresh when data is stale online', () => {
    const plan = buildSyncPlan({
      networkStatus: 'online',
      cacheAgeMs: 10_000,
      dbAgeMs: 12_000,
      policy: { maxStaleMs: 5_000, offlineFallback: 'db' },
    });

    expect(plan.shouldRefresh).toBe(true);
  });
});
