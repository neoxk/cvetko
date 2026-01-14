import { createAppError } from '@utils/errors';

export type Migration = {
  version: number;
  statements: string[];
};

export type MigrationRunner = {
  getCurrentVersion: () => Promise<number>;
  setCurrentVersion: (version: number) => Promise<void>;
  runStatements: (statements: string[]) => Promise<void>;
};

export const runMigrations = async (
  runner: MigrationRunner,
  migrations: Migration[],
): Promise<void> => {
  const sorted = [...migrations].sort((a, b) => a.version - b.version);
  const currentVersion = await runner.getCurrentVersion();

  for (const migration of sorted) {
    if (migration.version <= currentVersion) {
      continue;
    }
    try {
      await runner.runStatements(migration.statements);
      await runner.setCurrentVersion(migration.version);
    } catch (error) {
      throw createAppError('MigrationError', 'Failed to apply migrations', {
        details: { version: migration.version },
        cause: error,
      });
    }
  }
};
