import { createGardenRepository } from './repository';
import { MemoryGardenStore, type GardenStore } from './storage';

const entry = {
  id: '1',
  plantId: 'p1',
  name: 'Rose',
  scientificName: 'Rosa',
  imageUrl: null,
  location: null,
  plantedAt: '2024-01-01T00:00:00.000Z',
  watering: null,
  sunlight: null,
  cycle: null,
  hardinessMin: null,
  hardinessMax: null,
  description: null,
  lastWateredAt: null,
  notes: null,
};

describe('garden repository', () => {
  it('adds, updates, and removes entries', async () => {
    const repo = createGardenRepository(new MemoryGardenStore());

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
    const failingStorage: GardenStore = {
      getAll: async () => {
        throw new Error('fail');
      },
      add: async () => {
        throw new Error('fail');
      },
      update: async () => {
        throw new Error('fail');
      },
      remove: async () => {
        throw new Error('fail');
      },
      getById: async () => {
        throw new Error('fail');
      },
    };
    const repo = createGardenRepository(failingStorage);

    await expect(repo.add(entry)).rejects.toMatchObject({ name: 'GardenError' });
  });
});
