import { createAppError } from '@utils/errors';
import type { Settings } from '@domain/settings/types';
import { applySettingsDefaults } from '@utils/settings';

import { loadSettings, saveSettings, type StorageAdapter } from './storage';

export type SettingsRepository = {
  get: () => Promise<Settings>;
  update: (next: Partial<Settings>) => Promise<Settings>;
  reset: () => Promise<Settings>;
};

export const createSettingsRepository = (storage: StorageAdapter): SettingsRepository => ({
  get: async () => loadSettings(storage),
  update: async (next) => {
    try {
      const current = await loadSettings(storage);
      const merged = applySettingsDefaults({ ...current, ...next });
      await saveSettings(storage, merged);
      return merged;
    } catch (error) {
      throw createAppError('SettingsError', 'Failed to update settings', { cause: error });
    }
  },
  reset: async () => {
    try {
      const defaults = applySettingsDefaults(null);
      await saveSettings(storage, defaults);
      return defaults;
    } catch (error) {
      throw createAppError('SettingsError', 'Failed to reset settings', { cause: error });
    }
  },
});
