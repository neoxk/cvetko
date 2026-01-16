import type { DatabaseClient } from './client';
import { initializeDatabase } from './client';

let dbPromise: Promise<DatabaseClient> | null = null;

export const getDatabase = (): Promise<DatabaseClient> => {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }
  return dbPromise;
};
