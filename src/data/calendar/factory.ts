import { createAsyncStorageAdapter } from '@data/storage/asyncStorage';
import { createCalendarRepository, type CalendarRepository } from './repository';

export const createDefaultCalendarRepository = (): CalendarRepository =>
  createCalendarRepository(createAsyncStorageAdapter());
