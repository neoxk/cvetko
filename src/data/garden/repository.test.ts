import { createGardenRepository } from './repository';
import { MemoryStorage, type StorageAdapter } from './storage';

const entry = {
  id: '1',
  plantId: 'p1',
  source: 'perenual' as const,
  name: 'Rose',
  scientificName: 'Rosa',
  imageUrl: null,
  location: null,
  plantedAt: '2024-01-01T00:00:00.000Z',
  lastWateredAt: null,
  lastFertilizedAt: null,
  notes: null,
};

describe('garden repository', () => {
  it('adds, updates, and removes entries', async () => {
    const repo = createGardenRepository(new MemoryStorage());

    await repo.add(entry);
    const stored = await repo.getAll();
    expect(stored).toHaveLength(1);

    await repo.update({ ...entry, location: 'Balcony' });
    const updated = await repo.getById(entry.id);
    expect(updated?.location).toBe('Balcony');

    await repo.remove(entry.id);
    const remaining = await repo.getAll();
    expect(remaining).toHaveLength(0);
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
    const repo = createGardenRepository(failingStorage);

    await expect(repo.add(entry)).rejects.toMatchObject({ name: 'GardenError' });
  });
});
