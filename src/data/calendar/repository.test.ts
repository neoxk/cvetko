import { createCalendarRepository } from './repository';
import { MemoryStorage, type StorageAdapter } from './storage';

const task = {
  id: 'task-1',
  plantId: 'p1',
  plantName: 'Aloe',
  type: 'water' as const,
  title: 'Water Aloe',
  dueDate: '2024-01-01',
  status: 'pending' as const,
  recurrence: {
    frequency: 'daily' as const,
    interval: 1,
  },
  completedAt: null,
  notes: null,
};

describe('calendar repository', () => {
  it('adds, updates, and removes tasks', async () => {
    const repo = createCalendarRepository(new MemoryStorage());

    await repo.add(task);
    const stored = await repo.getAll();
    expect(stored).toHaveLength(1);

    await repo.update({ ...task, status: 'done', completedAt: '2024-01-02' });
    const updated = await repo.getById(task.id);
    expect(updated?.status).toBe('done');

    await repo.remove(task.id);
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
    const repo = createCalendarRepository(failingStorage);

    await expect(repo.add(task)).rejects.toMatchObject({ name: 'CalendarError' });
  });
});
