import { createSettingsRepository } from './repository';
import { MemoryStorage, type StorageAdapter } from './storage';

describe('settings repository', () => {
  it('loads defaults and updates values', async () => {
    const repo = createSettingsRepository(new MemoryStorage());

    const defaults = await repo.get();
    expect(defaults.unitSystem).toBe('metric');

    const updated = await repo.update({ unitSystem: 'imperial', reminderHour: 22 });
    expect(updated.unitSystem).toBe('imperial');
    expect(updated.reminderHour).toBe(22);
  });

  it('handles storage errors', async () => {
    const failingStorage: StorageAdapter = {
      getItem: async () => {
        throw new Error('fail');
      },
      setItem: async () => {
        throw new Error('fail');
      },
      removeItem: async () => {
        throw new Error('fail');
      },
    };
    const repo = createSettingsRepository(failingStorage);

    await expect(repo.get()).rejects.toMatchObject({ name: 'StorageError' });
    await expect(repo.update({ unitSystem: 'metric' })).rejects.toMatchObject({
      name: 'SettingsError',
    });
  });
});
