import * as SQLite from 'expo-sqlite';

import { dbSchema } from './schema';
import { runMigrations, type MigrationRunner } from './migrations';

export type DatabaseClient = SQLite.SQLiteDatabase;

const runStatements = async (db: DatabaseClient, statements: string[]): Promise<void> => {
  for (const statement of statements) {
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
  const db = await SQLite.openDatabaseAsync('cvetko.db');
  const runner = createMigrationRunner(db);
  await runMigrations(runner, [{ version: dbSchema.version, statements: dbSchema.statements }]);
  return db;
};
