import { MemoryNotificationClient, createNotificationScheduler } from './scheduler';
import type { NotificationPayload } from '@domain/notifications/types';

const payload: NotificationPayload = {
  id: 'notif-1',
  title: 'Water Aloe',
  body: 'Time to water Aloe',
  scheduledAt: '2024-01-01T08:00:00.000Z',
  channel: 'care',
};

describe('notification scheduler', () => {
  it('schedules after permission granted', async () => {
    const scheduler = createNotificationScheduler(new MemoryNotificationClient());

    const result = await scheduler.scheduleNotification(payload);

    expect(result.id).toBe(payload.id);
    const scheduled = await scheduler.getScheduledNotifications();
    expect(scheduled).toHaveLength(1);
  });

  it('throws when permission denied', async () => {
    const client = new MemoryNotificationClient();
    const scheduler = createNotificationScheduler({
      getPermissionStatus: () => client.getPermissionStatus(),
      requestPermission: async () => 'denied',
      schedule: (payload) => client.schedule(payload),
      cancel: (id) => client.cancel(id),
      cancelAll: () => client.cancelAll(),
      getScheduled: () => client.getScheduled(),
    });

    await expect(scheduler.scheduleNotification(payload)).rejects.toMatchObject({
      name: 'NotificationPermissionError',
    });
  });

  it('wraps client errors', async () => {
    const scheduler = createNotificationScheduler({
      getPermissionStatus: async () => 'granted',
      requestPermission: async () => 'granted',
      schedule: async () => {
        throw new Error('fail');
      },
      cancel: async () => {
        throw new Error('fail');
      },
      cancelAll: async () => {
        throw new Error('fail');
      },
      getScheduled: async () => {
        throw new Error('fail');
      },
    });

    await expect(scheduler.scheduleNotification(payload)).rejects.toMatchObject({
      name: 'NotificationError',
    });
    await expect(scheduler.cancelNotification('nope')).rejects.toMatchObject({
      name: 'NotificationError',
    });
    await expect(scheduler.cancelAll()).rejects.toMatchObject({
      name: 'NotificationError',
    });
    await expect(scheduler.getScheduledNotifications()).rejects.toMatchObject({
      name: 'NotificationError',
    });
  });
});
