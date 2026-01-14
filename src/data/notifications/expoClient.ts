import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type {
  NotificationPayload,
  NotificationPermissionStatus,
  NotificationScheduleResult,
} from '@domain/notifications/types';
import type { NotificationClient } from './scheduler';

type StoredNotification = {
  expoId: string;
  scheduledAt: string;
};

type NotificationMap = Record<string, StoredNotification>;

const NOTIFICATION_MAP_KEY = 'notification_map_v1';

const loadNotificationMap = async (): Promise<NotificationMap> => {
  const raw = await AsyncStorage.getItem(NOTIFICATION_MAP_KEY);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as NotificationMap;
  } catch {
    return {};
  }
};

const saveNotificationMap = async (map: NotificationMap): Promise<void> => {
  await AsyncStorage.setItem(NOTIFICATION_MAP_KEY, JSON.stringify(map));
};

const mapPermissionStatus = (
  status: Notifications.PermissionStatus,
): NotificationPermissionStatus => {
  if (status === 'granted') {
    return 'granted';
  }
  if (status === 'denied') {
    return 'denied';
  }
  return 'undetermined';
};

const ensureChannel = async (channelId: string): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(channelId, {
    name: channelId,
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  });
};

export class ExpoNotificationClient implements NotificationClient {
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    const { status } = await Notifications.getPermissionsAsync();
    return mapPermissionStatus(status);
  }

  async requestPermission(): Promise<NotificationPermissionStatus> {
    const { status } = await Notifications.requestPermissionsAsync();
    return mapPermissionStatus(status);
  }

  async schedule(payload: NotificationPayload): Promise<NotificationScheduleResult> {
    await ensureChannel(payload.channel);
    const triggerDate = new Date(payload.scheduledAt);
    const content: Notifications.NotificationContentInput = {
      title: payload.title,
      body: payload.body,
      ...(payload.data ? { data: payload.data } : {}),
    };
    const expoId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: payload.channel,
      },
    });
    const map = await loadNotificationMap();
    map[payload.id] = { expoId, scheduledAt: payload.scheduledAt };
    await saveNotificationMap(map);
    return { id: payload.id, scheduledAt: payload.scheduledAt };
  }

  async cancel(id: string): Promise<void> {
    const map = await loadNotificationMap();
    const stored = map[id];
    if (!stored) {
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(stored.expoId);
    delete map[id];
    await saveNotificationMap(map);
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NOTIFICATION_MAP_KEY);
  }

  async getScheduled(): Promise<NotificationScheduleResult[]> {
    const map = await loadNotificationMap();
    return Object.entries(map).map(([id, stored]) => ({
      id,
      scheduledAt: stored.scheduledAt,
    }));
  }
}
