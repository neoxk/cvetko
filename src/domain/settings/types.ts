export type UnitSystem = 'metric' | 'imperial';

export type Settings = {
  unitSystem: UnitSystem;
  locationLabel: string | null;
  notificationsEnabled: boolean;
  weatherAlertsEnabled: boolean;
  reminderHour: number;
};
