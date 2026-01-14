import { createAsyncStorageAdapter } from '@data/storage/asyncStorage';
import { createOnboardingRepository, type OnboardingRepository } from './repository';

export const createDefaultOnboardingRepository = (): OnboardingRepository =>
  createOnboardingRepository(createAsyncStorageAdapter());
