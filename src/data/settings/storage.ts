import { createAppError } from '@utils/errors';
import { applySettingsDefaults } from '@utils/settings';
import type { Settings } from '@domain/settings/types';

const SETTINGS_STORAGE_KEY = 'settings_v1';

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

const parseSettings = (raw: string): Settings => {
  try {
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return applySettingsDefaults(parsed);
  } catch (error) {
    throw createAppError('StorageError', 'Failed to parse settings', { cause: error });
  }
};

const serializeSettings = (settings: Settings): string => JSON.stringify(settings);

export const loadSettings = async (storage: StorageAdapter): Promise<Settings> => {
  try {
    const raw = await storage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return applySettingsDefaults(null);
    }
    return parseSettings(raw);
  } catch (error) {
    throw createAppError('StorageError', 'Failed to load settings', { cause: error });
  }
};

export const saveSettings = async (
  storage: StorageAdapter,
  settings: Settings,
): Promise<void> => {
  try {
    await storage.setItem(SETTINGS_STORAGE_KEY, serializeSettings(settings));
  } catch (error) {
    throw createAppError('StorageError', 'Failed to save settings', { cause: error });
  }
};
