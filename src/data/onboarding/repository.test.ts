import { createOnboardingRepository } from './repository';
import { MemoryStorage, type StorageAdapter } from './storage';

describe('onboarding repository', () => {
  it('loads defaults and completes onboarding', async () => {
    const repo = createOnboardingRepository(new MemoryStorage());

    const initial = await repo.get();
    expect(initial.completed).toBe(false);

    const completed = await repo.complete();
    expect(completed.completed).toBe(true);

    const loaded = await repo.get();
    expect(loaded.completed).toBe(true);
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
    const repo = createOnboardingRepository(failingStorage);

    await expect(repo.get()).rejects.toMatchObject({ name: 'StorageError' });
    await expect(repo.complete()).rejects.toMatchObject({ name: 'OnboardingError' });
  });
});
