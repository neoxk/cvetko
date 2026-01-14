import { createAppError } from '@utils/errors';
import type { OnboardingState } from '@domain/onboarding/types';
import { loadOnboardingState, saveOnboardingState, type StorageAdapter } from './storage';

export type OnboardingRepository = {
  get: () => Promise<OnboardingState>;
  complete: () => Promise<OnboardingState>;
  reset: () => Promise<OnboardingState>;
};

export const createOnboardingRepository = (storage: StorageAdapter): OnboardingRepository => ({
  get: async () => loadOnboardingState(storage),
  complete: async () => {
    try {
      const state: OnboardingState = {
        completed: true,
        completedAt: new Date().toISOString(),
      };
      await saveOnboardingState(storage, state);
      return state;
    } catch (error) {
      throw createAppError('OnboardingError', 'Failed to complete onboarding', { cause: error });
    }
  },
  reset: async () => {
    try {
      const state: OnboardingState = {
        completed: false,
        completedAt: null,
      };
      await saveOnboardingState(storage, state);
      return state;
    } catch (error) {
      throw createAppError('OnboardingError', 'Failed to reset onboarding', { cause: error });
    }
  },
});
