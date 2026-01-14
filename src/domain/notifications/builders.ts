import { createAppError } from '@utils/errors';
import { parseDateOnly } from '@utils/dates';
import type { CalendarTask } from '@domain/calendar/types';

import { DEFAULT_TASK_NOTIFICATION_HOUR_UTC } from './constants';
import type { NotificationPayload } from './types';

export type CalendarTaskNotificationOptions = {
  reminderHour?: number;
};

export const buildCalendarTaskNotification = (
  task: CalendarTask,
  options: CalendarTaskNotificationOptions = {},
): NotificationPayload => {
  const dueDate = parseDateOnly(task.dueDate);
  if (!dueDate) {
    throw createAppError('NotificationError', 'Invalid task due date for notification', {
      details: { dueDate: task.dueDate, taskId: task.id },
    });
  }
  const reminderHour = options.reminderHour ?? DEFAULT_TASK_NOTIFICATION_HOUR_UTC;
  const scheduledAt = new Date(
    Date.UTC(
      dueDate.getUTCFullYear(),
      dueDate.getUTCMonth(),
      dueDate.getUTCDate(),
      reminderHour,
      0,
      0,
    ),
  ).toISOString();

  return {
    id: task.id,
    title: task.title,
    body: `Care reminder for ${task.plantName}.`,
    scheduledAt,
    channel: 'care',
    data: {
      taskId: task.id,
      plantId: task.plantId,
      type: task.type,
    },
  };
};
