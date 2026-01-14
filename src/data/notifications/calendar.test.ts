import type { CalendarTask } from '@domain/calendar/types';
import { syncCalendarTaskNotifications } from './calendar';
import type { NotificationScheduler } from './scheduler';

const buildScheduler = (): { scheduler: NotificationScheduler; scheduled: Map<string, string> } => {
  const scheduled = new Map<string, string>();
  const scheduler: NotificationScheduler = {
    getPermissionStatus: async () => 'granted',
    requestPermission: async () => 'granted',
    scheduleNotification: async (payload) => {
      scheduled.set(payload.id, payload.scheduledAt);
      return { id: payload.id, scheduledAt: payload.scheduledAt };
    },
    cancelNotification: async (id) => {
      scheduled.delete(id);
    },
    cancelAll: async () => {
      scheduled.clear();
    },
    getScheduledNotifications: async () =>
      Array.from(scheduled.entries()).map(([id, scheduledAt]) => ({ id, scheduledAt })),
  };

  return { scheduler, scheduled };
};

describe('calendar notification sync', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('schedules pending tasks and cancels removed ones', async () => {
    const { scheduler, scheduled } = buildScheduler();
    const tasks: CalendarTask[] = [
      {
        id: 'task-1',
        plantId: 'p1',
        plantName: 'Aloe',
        type: 'water',
        title: 'Water Aloe',
        dueDate: '2024-01-02',
        status: 'pending',
        recurrence: null,
        completedAt: null,
        notes: null,
      },
    ];

    await syncCalendarTaskNotifications(tasks, scheduler);
    expect(scheduled.has('task-1')).toBe(true);

    await syncCalendarTaskNotifications([], scheduler);
    expect(scheduled.has('task-1')).toBe(false);
  });

  it('skips non-pending and past-due tasks', async () => {
    const { scheduler, scheduled } = buildScheduler();
    const tasks: CalendarTask[] = [
      {
        id: 'task-1',
        plantId: 'p1',
        plantName: 'Aloe',
        type: 'water',
        title: 'Water Aloe',
        dueDate: '2023-12-30',
        status: 'pending',
        recurrence: null,
        completedAt: null,
        notes: null,
      },
      {
        id: 'task-2',
        plantId: 'p2',
        plantName: 'Fern',
        type: 'mist',
        title: 'Mist Fern',
        dueDate: '2024-01-02',
        status: 'done',
        recurrence: null,
        completedAt: null,
        notes: null,
      },
    ];

    await syncCalendarTaskNotifications(tasks, scheduler);
    expect(scheduled.size).toBe(0);
  });

  it('reschedules when due date changes', async () => {
    const { scheduler, scheduled } = buildScheduler();
    const tasks: CalendarTask[] = [
      {
        id: 'task-1',
        plantId: 'p1',
        plantName: 'Aloe',
        type: 'water',
        title: 'Water Aloe',
        dueDate: '2024-01-02',
        status: 'pending',
        recurrence: null,
        completedAt: null,
        notes: null,
      },
    ];

    await syncCalendarTaskNotifications(tasks, scheduler);
    const firstSchedule = scheduled.get('task-1');
    const [task] = tasks;
    if (!task) {
      throw new Error('Missing task fixture');
    }

    await syncCalendarTaskNotifications(
      [{ ...task, dueDate: '2024-01-03' }],
      scheduler,
    );
    const updatedSchedule = scheduled.get('task-1');

    expect(firstSchedule).not.toBe(updatedSchedule);
  });
});
