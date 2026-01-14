import { createAppError } from '@utils/errors';
import type { GardenEntry } from '@domain/garden/types';
import { loadGardenEntries, saveGardenEntries, type StorageAdapter } from './storage';

export type GardenRepository = {
  getAll: () => Promise<GardenEntry[]>;
  add: (entry: GardenEntry) => Promise<void>;
  update: (entry: GardenEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<GardenEntry | null>;
};

export const createGardenRepository = (storage: StorageAdapter): GardenRepository => ({
  getAll: async () => loadGardenEntries(storage),
  add: async (entry) => {
    try {
      const entries = await loadGardenEntries(storage);
      await saveGardenEntries(storage, [entry, ...entries]);
    } catch (error) {
      throw createAppError('GardenError', 'Failed to add plant to garden', { cause: error });
    }
  },
  update: async (entry) => {
    try {
      const entries = await loadGardenEntries(storage);
      const nextEntries = entries.map((existing) => (existing.id === entry.id ? entry : existing));
      await saveGardenEntries(storage, nextEntries);
    } catch (error) {
      throw createAppError('GardenError', 'Failed to update garden entry', { cause: error });
    }
  },
  remove: async (id) => {
    try {
      const entries = await loadGardenEntries(storage);
      const nextEntries = entries.filter((existing) => existing.id !== id);
      await saveGardenEntries(storage, nextEntries);
    } catch (error) {
      throw createAppError('GardenError', 'Failed to remove garden entry', { cause: error });
    }
  },
  getById: async (id) => {
    const entries = await loadGardenEntries(storage);
    return entries.find((entry) => entry.id === id) ?? null;
  },
});
