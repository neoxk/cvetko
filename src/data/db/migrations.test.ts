import { runMigrations, type Migration, type MigrationRunner } from './migrations';

const buildRunner = (initialVersion = 0): {
  runner: MigrationRunner;
  statements: string[];
  versions: number[];
} => {
  let version = initialVersion;
  const statements: string[] = [];
  const versions: number[] = [];

  return {
    statements,
    versions,
    runner: {
      getCurrentVersion: async () => version,
      setCurrentVersion: async (next) => {
        version = next;
        versions.push(next);
      },
      runStatements: async (sqlStatements) => {
        statements.push(...sqlStatements);
      },
    },
  };
};

describe('migration runner', () => {
  it('applies migrations in order', async () => {
    const { runner, statements, versions } = buildRunner();
    const migrations: Migration[] = [
      { version: 2, statements: ['SQL-2'] },
      { version: 1, statements: ['SQL-1'] },
    ];

    await runMigrations(runner, migrations);

    expect(statements).toEqual(['SQL-1', 'SQL-2']);
    expect(versions).toEqual([1, 2]);
  });

  it('skips already applied migrations', async () => {
    const { runner, statements, versions } = buildRunner(2);
    const migrations: Migration[] = [
      { version: 1, statements: ['SQL-1'] },
      { version: 2, statements: ['SQL-2'] },
    ];

    await runMigrations(runner, migrations);

    expect(statements).toEqual([]);
    expect(versions).toEqual([]);
  });

  it('wraps migration errors', async () => {
    const runner: MigrationRunner = {
      getCurrentVersion: async () => 0,
      setCurrentVersion: async () => {},
      runStatements: async () => {
        throw new Error('fail');
      },
    };
    const migrations: Migration[] = [{ version: 1, statements: ['SQL-1'] }];

    await expect(runMigrations(runner, migrations)).rejects.toMatchObject({
      name: 'MigrationError',
    });
  });
});
