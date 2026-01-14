import { createAppError } from '@utils/errors';
import { ONBOARDING_STORAGE_KEY } from '@domain/onboarding/constants';
import type { OnboardingState } from '@domain/onboarding/types';

export type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export class MemoryStorage implements StorageAdapter {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
}

const parseState = (raw: string): OnboardingState => {
  try {
    const parsed = JSON.parse(raw) as OnboardingState;
    return {
      completed: Boolean(parsed?.completed),
      completedAt: parsed?.completedAt ?? null,
    };
  } catch (error) {
    throw createAppError('StorageError', 'Failed to parse onboarding state', { cause: error });
  }
};

const serializeState = (state: OnboardingState): string => JSON.stringify(state);

export const loadOnboardingState = async (storage: StorageAdapter): Promise<OnboardingState> => {
  try {
    const raw = await storage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) {
      return { completed: false, completedAt: null };
    }
    return parseState(raw);
  } catch (error) {
    throw createAppError('StorageError', 'Failed to load onboarding state', { cause: error });
  }
};

export const saveOnboardingState = async (
  storage: StorageAdapter,
  state: OnboardingState,
): Promise<void> => {
  try {
    await storage.setItem(ONBOARDING_STORAGE_KEY, serializeState(state));
  } catch (error) {
    throw createAppError('StorageError', 'Failed to save onboarding state', { cause: error });
  }
};
