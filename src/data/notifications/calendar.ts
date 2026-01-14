import {
  buildCalendarTaskNotification,
  type CalendarTaskNotificationOptions,
} from '@domain/notifications/builders';
import type { CalendarTask } from '@domain/calendar/types';
import type { NotificationScheduler } from './scheduler';
import { getTodayUtc, parseDateOnly } from '@utils/dates';

export const syncCalendarTaskNotifications = async (
  tasks: CalendarTask[],
  scheduler: NotificationScheduler,
  options: CalendarTaskNotificationOptions = {},
): Promise<void> => {
  const scheduled = await scheduler.getScheduledNotifications();
  const scheduledById = new Map(scheduled.map((item) => [item.id, item]));

  const today = getTodayUtc().getTime();
  const targetPayloads = new Map(
    tasks
      .filter((task) => task.status === 'pending')
      .map((task) => {
        const dueDate = parseDateOnly(task.dueDate);
        if (!dueDate || dueDate.getTime() < today) {
          return null;
        }
        return buildCalendarTaskNotification(task, options);
      })
      .filter((payload): payload is ReturnType<typeof buildCalendarTaskNotification> => !!payload)
      .map((payload) => [payload.id, payload]),
  );

  await Promise.all(
    scheduled
      .filter((item) => !targetPayloads.has(item.id))
      .map((item) => scheduler.cancelNotification(item.id)),
  );

  for (const payload of targetPayloads.values()) {
    const existing = scheduledById.get(payload.id);
    if (!existing) {
      await scheduler.scheduleNotification(payload);
      continue;
    }
    if (existing.scheduledAt !== payload.scheduledAt) {
      await scheduler.cancelNotification(payload.id);
      await scheduler.scheduleNotification(payload);
    }
  }
};
