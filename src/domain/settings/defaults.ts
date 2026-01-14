import type { Settings } from './types';

export const SETTINGS_LIMITS = {
  reminderHourMin: 0,
  reminderHourMax: 23,
};

export const DEFAULT_SETTINGS: Settings = {
  unitSystem: 'metric',
  locationLabel: null,
  notificationsEnabled: true,
  weatherAlertsEnabled: false,
  reminderHour: 8,
};
