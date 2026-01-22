import * as SQLite from 'expo-sqlite';

import { dbSchema } from './schema';
import { runMigrations, type MigrationRunner } from './migrations';
import { logger } from '@utils/logger';

export type DatabaseClient = SQLite.SQLiteDatabase;

const runStatements = async (db: DatabaseClient, statements: string[]): Promise<void> => {
  for (const statement of statements) {
    logger.debug('DB exec statement', { statement });
    await db.execAsync(statement);
  }
};

const getTableColumns = async (db: DatabaseClient, table: string): Promise<Set<string>> => {
  const rows = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table});`);
  return new Set(rows.map((row) => row.name));
};

const ensureColumns = async (
  db: DatabaseClient,
  table: string,
  columns: Array<{ name: string; type: string }>,
): Promise<void> => {
  const existing = await getTableColumns(db, table);
  for (const column of columns) {
    if (existing.has(column.name)) {
      continue;
    }
    const statement = `ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.type};`;
    logger.info('DB add column', { table, column: column.name });
    await db.execAsync(statement);
  }
};

const getCurrentVersion = async (db: DatabaseClient): Promise<number> => {
  const result = await db.getFirstAsync<{ user_version?: number }>('PRAGMA user_version;');
  return result?.user_version ?? 0;
};

const setCurrentVersion = async (db: DatabaseClient, version: number): Promise<void> => {
  await db.execAsync(`PRAGMA user_version = ${version};`);
};

export const createMigrationRunner = (db: DatabaseClient): MigrationRunner => ({
  getCurrentVersion: () => getCurrentVersion(db),
  setCurrentVersion: (version) => setCurrentVersion(db, version),
  runStatements: (statements) => runStatements(db, statements),
});

export const initializeDatabase = async (): Promise<DatabaseClient> => {
  try {
    logger.info('DB initialize start');
    const db = await SQLite.openDatabaseAsync('cvetko.db');
    logger.info('DB open success');
    await runStatements(db, dbSchema.statements);
    logger.info('DB schema ensured', { version: dbSchema.version });
    await ensureColumns(db, 'wishlist_items', [
      { name: 'id', type: 'TEXT' },
      { name: 'source', type: 'TEXT' },
      { name: 'name', type: 'TEXT' },
      { name: 'scientific_name', type: 'TEXT' },
      { name: 'image_url', type: 'TEXT' },
      { name: 'added_at', type: 'TEXT' },
    ]);
    await ensureColumns(db, 'garden_entries', [
      { name: 'id', type: 'TEXT' },
      { name: 'plant_id', type: 'TEXT' },
      { name: 'name', type: 'TEXT' },
      { name: 'scientific_name', type: 'TEXT' },
      { name: 'image_url', type: 'TEXT' },
      { name: 'source', type: 'TEXT' },
      { name: 'location', type: 'TEXT' },
      { name: 'planted_at', type: 'TEXT' },
      { name: 'watering', type: 'TEXT' },
      { name: 'sunlight', type: 'TEXT' },
      { name: 'cycle', type: 'TEXT' },
      { name: 'hardiness_min', type: 'INTEGER' },
      { name: 'hardiness_max', type: 'INTEGER' },
      { name: 'description', type: 'TEXT' },
      { name: 'last_watered_at', type: 'TEXT' },
      { name: 'notes', type: 'TEXT' },
    ]);
    await ensureColumns(db, 'care_events', [
      { name: 'id', type: 'TEXT' },
      { name: 'garden_entry_id', type: 'TEXT' },
      { name: 'plant_id', type: 'TEXT' },
      { name: 'type', type: 'TEXT' },
      { name: 'occurred_at', type: 'TEXT' },
      { name: 'notes', type: 'TEXT' },
    ]);
    const runner = createMigrationRunner(db);
    await runMigrations(runner, [{ version: dbSchema.version, statements: dbSchema.statements }]);
    logger.info('DB migrations complete', { version: dbSchema.version });
    return db;
  } catch (error) {
    logger.error('DB initialize failed', { error });
    throw error;
  }
};
