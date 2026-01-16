import { createAppError } from '@utils/errors';
import { logger } from '@utils/logger';
import type { GardenEntry } from '@domain/garden/types';
import type { GardenStore } from './storage';

export type GardenRepository = {
  getAll: () => Promise<GardenEntry[]>;
  add: (entry: GardenEntry) => Promise<void>;
  update: (entry: GardenEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<GardenEntry | null>;
};

export const createGardenRepository = (store: GardenStore): GardenRepository => ({
  getAll: async () => store.getAll(),
  add: async (entry) => {
    try {
      await store.add(entry);
    } catch (error) {
      logger.error('Garden add failed', { error, id: entry.id });
      throw createAppError('GardenError', 'Failed to add plant to garden', { cause: error });
    }
  },
  update: async (entry) => {
    try {
      await store.update(entry);
    } catch (error) {
      logger.error('Garden update failed', { error, id: entry.id });
      throw createAppError('GardenError', 'Failed to update garden entry', { cause: error });
    }
  },
  remove: async (id) => {
    try {
      await store.remove(id);
    } catch (error) {
      logger.error('Garden remove failed', { error, id });
      throw createAppError('GardenError', 'Failed to remove garden entry', { cause: error });
    }
  },
  getById: async (id) => store.getById(id),
});
