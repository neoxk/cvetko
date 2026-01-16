import { createAppError } from '@utils/errors';
import { logger } from '@utils/logger';
import type { CareEvent } from '@domain/care/types';
import type { CareEventStore } from './storage';

export type CareEventRepository = {
  getAll: () => Promise<CareEvent[]>;
  add: (event: CareEvent) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getByEntryId: (entryId: string) => Promise<CareEvent[]>;
};

export const createCareEventRepository = (store: CareEventStore): CareEventRepository => ({
  getAll: async () => store.getAll(),
  add: async (event) => {
    try {
      await store.add(event);
    } catch (error) {
      logger.error('Care event add failed', { error, id: event.id });
      throw createAppError('CareEventError', 'Failed to save care event', { cause: error });
    }
  },
  remove: async (id) => {
    try {
      await store.remove(id);
    } catch (error) {
      logger.error('Care event remove failed', { error, id });
      throw createAppError('CareEventError', 'Failed to remove care event', { cause: error });
    }
  },
  getByEntryId: async (entryId) => store.getByEntryId(entryId),
});
