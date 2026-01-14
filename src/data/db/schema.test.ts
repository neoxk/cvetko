import { dbSchema } from './schema';

describe('db schema', () => {
  it('defines schema version and statements', () => {
    expect(dbSchema.version).toBeGreaterThan(0);
    expect(dbSchema.statements.length).toBeGreaterThan(0);
  });

  it('includes core tables', () => {
    const statements = dbSchema.statements.join(' ');
    expect(statements).toContain('CREATE TABLE IF NOT EXISTS settings');
    expect(statements).toContain('CREATE TABLE IF NOT EXISTS calendar_tasks');
    expect(statements).toContain('CREATE TABLE IF NOT EXISTS garden_entries');
  });
});
