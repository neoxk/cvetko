import React from 'react';

import type { CalendarRepository } from '@data/calendar/repository';
import { createDefaultCalendarRepository } from '@data/calendar/factory';
import type { NotificationScheduler } from '@data/notifications/scheduler';
import { createDefaultNotificationScheduler } from '@data/notifications/scheduler';
import { syncCalendarTaskNotifications } from '@data/notifications/calendar';
import type { CalendarTask } from '@domain/calendar/types';
import { createAppError } from '@utils/errors';

export type UseCalendarState = {
  tasks: CalendarTask[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  addTask: (task: CalendarTask) => void;
  updateTask: (task: CalendarTask) => void;
  removeTask: (id: string) => void;
  getById: (id: string) => CalendarTask | null;
};

export type UseCalendarParams = {
  repository?: CalendarRepository;
  scheduler?: NotificationScheduler;
  notificationsEnabled?: boolean;
  reminderHour?: number;
  enableNotificationSync?: boolean;
};

export const useCalendar = ({
  repository,
  scheduler,
  notificationsEnabled,
  reminderHour,
  enableNotificationSync = false,
}: UseCalendarParams = {}): UseCalendarState => {
  const resolvedRepository = React.useMemo(
    () => repository ?? createDefaultCalendarRepository(),
    [repository],
  );
  const resolvedScheduler = React.useMemo(
    () => scheduler ?? createDefaultNotificationScheduler(),
    [scheduler],
  );
  const [tasks, setTasks] = React.useState<CalendarTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadTasks = React.useCallback(async () => {
    if (!resolvedRepository) {
      setError(
        createAppError('ConfigError', 'Calendar storage is unavailable.', {
          details: { feature: 'calendar' },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await resolvedRepository.getAll();
      setTasks(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRepository]);

  React.useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  React.useEffect(() => {
    if (!enableNotificationSync || isLoading || notificationsEnabled === undefined) {
      return;
    }
    if (!notificationsEnabled) {
      void resolvedScheduler.cancelAll().catch((err: Error) => {
        setError(err);
      });
      return;
    }
    const options = reminderHour !== undefined ? { reminderHour } : undefined;
    void syncCalendarTaskNotifications(tasks, resolvedScheduler, options).catch((err: Error) => {
      setError(err);
    });
  }, [isLoading, notificationsEnabled, reminderHour, resolvedScheduler, tasks]);

  const addTask = React.useCallback(
    (task: CalendarTask) => {
      if (!resolvedRepository) {
        return;
      }
      setTasks((prev) => [task, ...prev]);
      resolvedRepository.add(task).catch((err: Error) => {
        setTasks((prev) => prev.filter((item) => item.id !== task.id));
        setError(err);
      });
    },
    [resolvedRepository],
  );

  const updateTask = React.useCallback(
    (task: CalendarTask) => {
      if (!resolvedRepository) {
        return;
      }
      setTasks((prev) => prev.map((item) => (item.id === task.id ? task : item)));
      resolvedRepository.update(task).catch((err: Error) => {
        setError(err);
        void loadTasks();
      });
    },
    [loadTasks, resolvedRepository],
  );

  const removeTask = React.useCallback(
    (id: string) => {
      if (!resolvedRepository) {
        return;
      }
      const previous = tasks;
      setTasks((prev) => prev.filter((item) => item.id !== id));
      resolvedRepository.remove(id).catch((err: Error) => {
        setTasks(previous);
        setError(err);
      });
    },
    [resolvedRepository, tasks],
  );

  const getById = React.useCallback((id: string) => tasks.find((task) => task.id === id) ?? null, [
    tasks,
  ]);

  return {
    tasks,
    isLoading,
    error,
    refresh: loadTasks,
    addTask,
    updateTask,
    removeTask,
    getById,
  };
};
