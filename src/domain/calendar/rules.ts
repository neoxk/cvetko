import { createAppError } from '@utils/errors';
import {
  addDaysUtc,
  daysBetweenUtc,
  daysInMonthUtc,
  formatDateOnly,
  parseDateOnly,
} from '@utils/dates';

import type {
  CalendarRecurrence,
  CalendarTask,
  CalendarTaskGenerationOptions,
  CalendarTaskSchedule,
  CalendarTaskStatus,
  Weekday,
} from './types';

const weekdayOrder: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const normalizeRecurrence = (recurrence: CalendarRecurrence): CalendarRecurrence => {
  if (recurrence.interval < 1 || !Number.isInteger(recurrence.interval)) {
    throw createAppError('CalendarRuleError', 'Recurrence interval must be a positive integer', {
      details: { interval: recurrence.interval },
    });
  }

  if (recurrence.frequency === 'weekly') {
    const uniqueWeekdays = Array.from(new Set(recurrence.weekdays));
    if (uniqueWeekdays.length === 0) {
      throw createAppError('CalendarRuleError', 'Weekly recurrence must include weekdays', {
        details: { weekdays: recurrence.weekdays },
      });
    }
    return {
      ...recurrence,
      weekdays: uniqueWeekdays,
    };
  }

  if (recurrence.frequency === 'monthly') {
    const uniqueDays = Array.from(new Set(recurrence.monthDays)).sort((a, b) => a - b);
    if (uniqueDays.length === 0) {
      throw createAppError('CalendarRuleError', 'Monthly recurrence must include month days', {
        details: { monthDays: recurrence.monthDays },
      });
    }
    const invalidDays = uniqueDays.filter((day) => day < 1 || day > 31);
    if (invalidDays.length > 0) {
      throw createAppError('CalendarRuleError', 'Monthly recurrence contains invalid days', {
        details: { invalidDays },
      });
    }
    return {
      ...recurrence,
      monthDays: uniqueDays,
    };
  }

  return recurrence;
};

const createTaskId = (schedule: CalendarTaskSchedule, dueDate: string): string =>
  `${schedule.plantId}-${schedule.taskType}-${dueDate}`;

const buildTask = (
  schedule: CalendarTaskSchedule,
  dueDate: string,
  status: CalendarTaskStatus,
): CalendarTask => ({
  id: createTaskId(schedule, dueDate),
  plantId: schedule.plantId,
  plantName: schedule.plantName,
  type: schedule.taskType,
  title: schedule.title,
  dueDate,
  status,
  recurrence: schedule.recurrence,
  completedAt: null,
  notes: null,
});

export const generateCalendarTasks = (
  schedule: CalendarTaskSchedule,
  options: CalendarTaskGenerationOptions,
): CalendarTask[] => {
  const startDate = parseDateOnly(schedule.startDate);
  if (!startDate) {
    throw createAppError('CalendarRuleError', 'Invalid start date format', {
      details: { value: schedule.startDate },
    });
  }
  const endDate = parseDateOnly(options.endDate);
  if (!endDate) {
    throw createAppError('CalendarRuleError', 'Invalid end date format', {
      details: { value: options.endDate },
    });
  }
  if (endDate.getTime() < startDate.getTime()) {
    throw createAppError('CalendarRuleError', 'End date must be on or after start date', {
      details: { startDate: schedule.startDate, endDate: options.endDate },
    });
  }

  const normalizedRecurrence = normalizeRecurrence(schedule.recurrence);
  const status = options.status ?? 'pending';
  const maxTasks = options.maxTasks ?? Number.POSITIVE_INFINITY;
  const tasks: CalendarTask[] = [];

  const pushTask = (dueDate: Date): void => {
    if (tasks.length >= maxTasks) {
      return;
    }
    const formatted = formatDateOnly(dueDate);
    tasks.push(buildTask({ ...schedule, recurrence: normalizedRecurrence }, formatted, status));
  };

  if (normalizedRecurrence.frequency === 'daily') {
    let current = startDate;
    while (current.getTime() <= endDate.getTime() && tasks.length < maxTasks) {
      pushTask(current);
      current = addDaysUtc(current, normalizedRecurrence.interval);
    }
    return tasks;
  }

  if (normalizedRecurrence.frequency === 'weekly') {
    const weekdaySet = new Set(normalizedRecurrence.weekdays);
    let current = startDate;
    while (current.getTime() <= endDate.getTime() && tasks.length < maxTasks) {
      const daysFromStart = daysBetweenUtc(startDate, current);
      const weekIndex = Math.floor(daysFromStart / 7);
      const weekday = weekdayOrder[current.getUTCDay()];
      if (weekday && weekdaySet.has(weekday) && weekIndex % normalizedRecurrence.interval === 0) {
        pushTask(current);
      }
      current = addDaysUtc(current, 1);
    }
    return tasks;
  }

  const startMonthIndex = startDate.getUTCFullYear() * 12 + startDate.getUTCMonth();
  const endMonthIndex = endDate.getUTCFullYear() * 12 + endDate.getUTCMonth();
  for (let monthIndex = startMonthIndex; monthIndex <= endMonthIndex; monthIndex += 1) {
    if ((monthIndex - startMonthIndex) % normalizedRecurrence.interval !== 0) {
      continue;
    }
    const year = Math.floor(monthIndex / 12);
    const month = monthIndex % 12;
    const monthDays = daysInMonthUtc(year, month);
    for (const day of normalizedRecurrence.monthDays) {
      if (day > monthDays) {
        continue;
      }
      const dueDate = new Date(Date.UTC(year, month, day));
      if (dueDate.getTime() < startDate.getTime() || dueDate.getTime() > endDate.getTime()) {
        continue;
      }
      pushTask(dueDate);
      if (tasks.length >= maxTasks) {
        return tasks;
      }
    }
  }

  return tasks;
};
