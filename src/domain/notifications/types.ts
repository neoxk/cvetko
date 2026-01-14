export type NotificationChannel = 'care' | 'weather';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type NotificationPayload = {
  id: string;
  title: string;
  body: string;
  scheduledAt: string;
  channel: NotificationChannel;
  data?: Record<string, string>;
};

export type WeatherAlert = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
};

export type NotificationScheduleResult = {
  id: string;
  scheduledAt: string;
};

export type NotificationScheduleOptions = {
  requirePermission?: boolean;
};
