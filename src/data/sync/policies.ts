export type SyncSource = 'cache' | 'db' | 'remote';

export type SyncPolicy = {
  maxStaleMs: number;
  offlineFallback: SyncSource;
};

import { isFresh } from './utils';

export const defaultSyncPolicy: SyncPolicy = {
  maxStaleMs: 5 * 60 * 1000,
  offlineFallback: 'db',
};

export type SyncInputs = {
  networkStatus: 'online' | 'offline' | 'unknown';
  cacheAgeMs?: number;
  dbAgeMs?: number;
  policy?: SyncPolicy;
};

export const resolveSyncSource = (inputs: SyncInputs): SyncSource => {
  const policy = inputs.policy ?? defaultSyncPolicy;

  if (inputs.networkStatus !== 'online') {
    if (inputs.dbAgeMs !== undefined) {
      return 'db';
    }
    if (inputs.cacheAgeMs !== undefined) {
      return 'cache';
    }
    return policy.offlineFallback;
  }

  if (isFresh(inputs.cacheAgeMs, policy.maxStaleMs)) {
    return 'cache';
  }

  if (isFresh(inputs.dbAgeMs, policy.maxStaleMs)) {
    return 'db';
  }

  if (inputs.cacheAgeMs !== undefined) {
    return 'cache';
  }

  if (inputs.dbAgeMs !== undefined) {
    return 'db';
  }

  return 'remote';
};
