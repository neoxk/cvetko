import { DEFAULT_SETTINGS, SETTINGS_LIMITS } from '@domain/settings/defaults';
import type { Settings } from '@domain/settings/types';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const applySettingsDefaults = (stored: Partial<Settings> | null): Settings => {
  const reminderHour =
    stored?.reminderHour !== undefined ? stored.reminderHour : DEFAULT_SETTINGS.reminderHour;

  return {
    unitSystem: stored?.unitSystem ?? DEFAULT_SETTINGS.unitSystem,
    locationLabel: stored?.locationLabel ?? DEFAULT_SETTINGS.locationLabel,
    notificationsEnabled:
      stored?.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
    weatherAlertsEnabled:
      stored?.weatherAlertsEnabled ?? DEFAULT_SETTINGS.weatherAlertsEnabled,
    reminderHour: clamp(
      reminderHour,
      SETTINGS_LIMITS.reminderHourMin,
      SETTINGS_LIMITS.reminderHourMax,
    ),
  };
};

export const formatReminderHour = (hour: number): string =>
  `${hour.toString().padStart(2, '0')}:00`;
