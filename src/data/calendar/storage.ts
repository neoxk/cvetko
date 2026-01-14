import { createAppError } from '@utils/errors';
import { CALENDAR_STORAGE_KEY } from '@domain/calendar/constants';
import type { CalendarTask } from '@domain/calendar/types';

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

const parseTasks = (raw: string): CalendarTask[] => {
  try {
    const parsed = JSON.parse(raw) as CalendarTask[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    throw createAppError('StorageError', 'Failed to parse calendar tasks', { cause: error });
  }
};

const serializeTasks = (tasks: CalendarTask[]): string => JSON.stringify(tasks);

export const loadCalendarTasks = async (storage: StorageAdapter): Promise<CalendarTask[]> => {
  try {
    const raw = await storage.getItem(CALENDAR_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return parseTasks(raw);
  } catch (error) {
    throw createAppError('StorageError', 'Failed to load calendar tasks', { cause: error });
  }
};

export const saveCalendarTasks = async (
  storage: StorageAdapter,
  tasks: CalendarTask[],
): Promise<void> => {
  try {
    if (tasks.length === 0) {
      await storage.removeItem(CALENDAR_STORAGE_KEY);
      return;
    }
    await storage.setItem(CALENDAR_STORAGE_KEY, serializeTasks(tasks));
  } catch (error) {
    throw createAppError('StorageError', 'Failed to save calendar tasks', { cause: error });
  }
};
