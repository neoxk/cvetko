import type { SyncInputs, SyncPolicy, SyncSource } from './policies';
import { defaultSyncPolicy, resolveSyncSource } from './policies';
import { isFresh } from './utils';

export type SyncPlan = {
  source: SyncSource;
  shouldRefresh: boolean;
};

export const buildSyncPlan = (inputs: SyncInputs): SyncPlan => {
  const policy: SyncPolicy = inputs.policy ?? defaultSyncPolicy;
  const source = resolveSyncSource(inputs);

  if (inputs.networkStatus !== 'online') {
    return { source, shouldRefresh: false };
  }

  const hasFreshLocal =
    isFresh(inputs.cacheAgeMs, policy.maxStaleMs) ||
    isFresh(inputs.dbAgeMs, policy.maxStaleMs);
  if (source === 'remote') {
    return { source, shouldRefresh: true };
  }

  return { source, shouldRefresh: !hasFreshLocal };
};
