import { createAppError } from '@utils/errors';
import { ExpoNotificationClient } from './expoClient';
import type {
  NotificationPayload,
  NotificationPermissionStatus,
  NotificationScheduleOptions,
  NotificationScheduleResult,
} from '@domain/notifications/types';

export type NotificationClient = {
  getPermissionStatus: () => Promise<NotificationPermissionStatus>;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  schedule: (payload: NotificationPayload) => Promise<NotificationScheduleResult>;
  cancel: (id: string) => Promise<void>;
  cancelAll: () => Promise<void>;
  getScheduled: () => Promise<NotificationScheduleResult[]>;
};

export type NotificationScheduler = {
  getPermissionStatus: () => Promise<NotificationPermissionStatus>;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  scheduleNotification: (
    payload: NotificationPayload,
    options?: NotificationScheduleOptions,
  ) => Promise<NotificationScheduleResult>;
  cancelNotification: (id: string) => Promise<void>;
  cancelAll: () => Promise<void>;
  getScheduledNotifications: () => Promise<NotificationScheduleResult[]>;
};

export class MemoryNotificationClient implements NotificationClient {
  private permission: NotificationPermissionStatus = 'undetermined';
  private scheduled = new Map<string, NotificationScheduleResult>();

  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    return this.permission;
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    this.permission = 'granted';
    return this.permission;
  }

  async schedule(payload: NotificationPayload): Promise<NotificationScheduleResult> {
    const scheduled = { id: payload.id, scheduledAt: payload.scheduledAt };
    this.scheduled.set(payload.id, scheduled);
    return scheduled;
  }

  async cancel(id: string): Promise<void> {
    this.scheduled.delete(id);
  }

  async cancelAll(): Promise<void> {
    this.scheduled.clear();
  }

  async getScheduled(): Promise<NotificationScheduleResult[]> {
    return Array.from(this.scheduled.values());
  }
}

const createPermissionError = (status: NotificationPermissionStatus): Error =>
  createAppError('NotificationPermissionError', 'Notifications permission not granted.', {
    details: { status },
  });

export const createNotificationScheduler = (client: NotificationClient): NotificationScheduler => ({
  getPermissionStatus: async () => client.getPermissionStatus(),
  requestPermission: async () => client.requestPermission(),
  scheduleNotification: async (payload, options) => {
    try {
      const status = await client.getPermissionStatus();
      const requiresPermission = options?.requirePermission ?? true;
      if (requiresPermission && status !== 'granted') {
        const requested = await client.requestPermission();
        if (requested !== 'granted') {
          throw createPermissionError(requested);
        }
      }
      return await client.schedule(payload);
    } catch (error) {
      if (error instanceof Error && error.name === 'NotificationPermissionError') {
        throw error;
      }
      throw createAppError('NotificationError', 'Failed to schedule notification', {
        cause: error,
      });
    }
  },
  cancelNotification: async (id) => {
    try {
      await client.cancel(id);
    } catch (error) {
      throw createAppError('NotificationError', 'Failed to cancel notification', { cause: error });
    }
  },
  cancelAll: async () => {
    try {
      await client.cancelAll();
    } catch (error) {
      throw createAppError('NotificationError', 'Failed to clear notifications', { cause: error });
    }
  },
  getScheduledNotifications: async () => {
    try {
      return await client.getScheduled();
    } catch (error) {
      throw createAppError('NotificationError', 'Failed to load scheduled notifications', {
        cause: error,
      });
    }
  },
});

export const createDefaultNotificationScheduler = (): NotificationScheduler =>
  createNotificationScheduler(new ExpoNotificationClient());
