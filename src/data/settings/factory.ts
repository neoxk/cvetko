import { createAsyncStorageAdapter } from '@data/storage/asyncStorage';
import { createSettingsRepository, type SettingsRepository } from './repository';

export const createDefaultSettingsRepository = (): SettingsRepository =>
  createSettingsRepository(createAsyncStorageAdapter());
