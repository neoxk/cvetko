import { createAppError } from '@utils/errors';
import type { CalendarTask } from '@domain/calendar/types';

import { loadCalendarTasks, saveCalendarTasks, type StorageAdapter } from './storage';

export type CalendarRepository = {
  getAll: () => Promise<CalendarTask[]>;
  add: (task: CalendarTask) => Promise<void>;
  update: (task: CalendarTask) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<CalendarTask | null>;
};

export const createCalendarRepository = (storage: StorageAdapter): CalendarRepository => ({
  getAll: async () => loadCalendarTasks(storage),
  add: async (task) => {
    try {
      const tasks = await loadCalendarTasks(storage);
      await saveCalendarTasks(storage, [task, ...tasks]);
    } catch (error) {
      throw createAppError('CalendarError', 'Failed to add calendar task', { cause: error });
    }
  },
  update: async (task) => {
    try {
      const tasks = await loadCalendarTasks(storage);
      const nextTasks = tasks.map((existing) => (existing.id === task.id ? task : existing));
      await saveCalendarTasks(storage, nextTasks);
    } catch (error) {
      throw createAppError('CalendarError', 'Failed to update calendar task', { cause: error });
    }
  },
  remove: async (id) => {
    try {
      const tasks = await loadCalendarTasks(storage);
      const nextTasks = tasks.filter((existing) => existing.id !== id);
      await saveCalendarTasks(storage, nextTasks);
    } catch (error) {
      throw createAppError('CalendarError', 'Failed to remove calendar task', { cause: error });
    }
  },
  getById: async (id) => {
    const tasks = await loadCalendarTasks(storage);
    return tasks.find((task) => task.id === id) ?? null;
  },
});
