import { applySettingsDefaults, formatReminderHour } from './settings';

describe('settings utils', () => {
  it('applies defaults and clamps reminder hour', () => {
    const settings = applySettingsDefaults({ reminderHour: 30, unitSystem: 'imperial' });

    expect(settings.unitSystem).toBe('imperial');
    expect(settings.reminderHour).toBe(23);
  });

  it('formats reminder hour', () => {
    expect(formatReminderHour(8)).toBe('08:00');
  });
});
