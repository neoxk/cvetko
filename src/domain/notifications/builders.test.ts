import { buildCalendarTaskNotification } from './builders';

describe('notification builders', () => {
  it('builds calendar task notification payload', () => {
    const payload = buildCalendarTaskNotification({
      id: 'task-1',
      plantId: 'p1',
      plantName: 'Aloe',
      type: 'water',
      title: 'Water Aloe',
      dueDate: '2024-01-10',
      status: 'pending',
      recurrence: null,
      completedAt: null,
      notes: null,
    });

    expect(payload).toMatchObject({
      id: 'task-1',
      title: 'Water Aloe',
      channel: 'care',
      data: { taskId: 'task-1', plantId: 'p1', type: 'water' },
    });
    expect(payload.scheduledAt).toBe('2024-01-10T08:00:00.000Z');
  });

  it('uses custom reminder hour', () => {
    const payload = buildCalendarTaskNotification(
      {
        id: 'task-3',
        plantId: 'p3',
        plantName: 'Lavender',
        type: 'prune',
        title: 'Prune Lavender',
        dueDate: '2024-01-10',
        status: 'pending',
        recurrence: null,
        completedAt: null,
        notes: null,
      },
      { reminderHour: 14 },
    );

    expect(payload.scheduledAt).toBe('2024-01-10T14:00:00.000Z');
  });

  it('throws for invalid due dates', () => {
    expect(() =>
      buildCalendarTaskNotification({
        id: 'task-2',
        plantId: 'p2',
        plantName: 'Fern',
        type: 'mist',
        title: 'Mist Fern',
        dueDate: 'invalid-date',
        status: 'pending',
        recurrence: null,
        completedAt: null,
        notes: null,
      }),
    ).toThrow('Invalid task due date');
  });
});
