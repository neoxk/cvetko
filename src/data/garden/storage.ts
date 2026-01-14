import { createAppError } from '@utils/errors';
import { GARDEN_STORAGE_KEY } from '@domain/garden/constants';
import type { GardenEntry } from '@domain/garden/types';

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

const parseEntries = (raw: string): GardenEntry[] => {
  try {
    const parsed = JSON.parse(raw) as GardenEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    throw createAppError('StorageError', 'Failed to parse garden data', { cause: error });
  }
};

const serializeEntries = (entries: GardenEntry[]): string => JSON.stringify(entries);

export const loadGardenEntries = async (storage: StorageAdapter): Promise<GardenEntry[]> => {
  try {
    const raw = await storage.getItem(GARDEN_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return parseEntries(raw);
  } catch (error) {
    throw createAppError('StorageError', 'Failed to load garden', { cause: error });
  }
};

export const saveGardenEntries = async (
  storage: StorageAdapter,
  entries: GardenEntry[],
): Promise<void> => {
  try {
    if (entries.length === 0) {
      await storage.removeItem(GARDEN_STORAGE_KEY);
      return;
    }
    await storage.setItem(GARDEN_STORAGE_KEY, serializeEntries(entries));
  } catch (error) {
    throw createAppError('StorageError', 'Failed to save garden', { cause: error });
  }
};
