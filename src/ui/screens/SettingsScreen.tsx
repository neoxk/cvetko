import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { createDefaultNotificationScheduler } from '@data/notifications/scheduler';
import { WEATHER_ALERTS_ENABLED } from '@domain/notifications/constants';
import type { UnitSystem } from '@domain/settings/types';
import { Card } from '@ui/components/Card';
import { ErrorState } from '@ui/components/ErrorState';
import { Input } from '@ui/components/Input';
import { LoadingState } from '@ui/components/LoadingState';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { SettingsOptionRow, SettingsToggleRow } from '@ui/components/SettingsRow';
import { useSettings } from '@ui/hooks/useSettings';
import { useTheme } from '@ui/theme';
import { formatReminderHour } from '@utils/settings';
import { Button } from '@ui/components/Button';
import { uiStrings } from '@ui/strings';

const unitOptions: { label: string; value: UnitSystem }[] = [
  { label: 'Metric', value: 'metric' },
  { label: 'Imperial', value: 'imperial' },
];

export const SettingsScreen = (): React.ReactElement => {
  const theme = useTheme();
  const settingsState = useSettings();
  const scheduler = React.useMemo(() => createDefaultNotificationScheduler(), []);
  const [locationInput, setLocationInput] = React.useState('');
  const [hourInput, setHourInput] = React.useState('08');
  const [hourError, setHourError] = React.useState<string | null>(null);
  const [notificationError, setNotificationError] = React.useState<string | null>(null);
  const [isUpdatingNotification, setIsUpdatingNotification] = React.useState(false);

  React.useEffect(() => {
    setLocationInput(settingsState.settings.locationLabel ?? '');
    setHourInput(settingsState.settings.reminderHour.toString().padStart(2, '0'));
  }, [settingsState.settings.locationLabel, settingsState.settings.reminderHour]);

  const handleUnitChange = (value: UnitSystem): void => {
    settingsState.updateSettings({ unitSystem: value });
  };

  const handleLocationBlur = (): void => {
    const trimmed = locationInput.trim();
    settingsState.updateSettings({ locationLabel: trimmed ? trimmed : null });
  };

  const handleHourBlur = (): void => {
    const trimmed = hourInput.trim();
    if (!trimmed) {
      setHourError('Reminder hour is required.');
      return;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 23) {
      setHourError('Use a value between 0 and 23.');
      return;
    }
    setHourError(null);
    settingsState.updateSettings({ reminderHour: parsed });
  };

  const handleNotificationsToggle = async (next: boolean): Promise<void> => {
    setNotificationError(null);
    setIsUpdatingNotification(true);
    try {
      if (next) {
        const status = await scheduler.requestPermission();
        if (status !== 'granted') {
          setNotificationError('Notifications permission was not granted.');
          settingsState.updateSettings({ notificationsEnabled: false });
          setIsUpdatingNotification(false);
          return;
        }
      } else {
        await scheduler.cancelAll();
        settingsState.updateSettings({
          notificationsEnabled: false,
          weatherAlertsEnabled: false,
        });
        setIsUpdatingNotification(false);
        return;
      }

      settingsState.updateSettings({ notificationsEnabled: true });
    } catch (error) {
      setNotificationError('Unable to update notification preferences.');
    } finally {
      setIsUpdatingNotification(false);
    }
  };

  const handleWeatherToggle = (next: boolean): void => {
    settingsState.updateSettings({ weatherAlertsEnabled: next });
  };

  const notificationsDisabled = isUpdatingNotification || settingsState.isLoading;
  const weatherToggleDisabled =
    notificationsDisabled ||
    !settingsState.settings.notificationsEnabled ||
    !WEATHER_ALERTS_ENABLED;

  return (
    <ScreenLayout title={uiStrings.settings.title} footerText={uiStrings.common.appName}>
      {settingsState.isLoading ? (
        <LoadingState message="Loading preferences..." />
      ) : settingsState.error ? (
        <ErrorState
          title="Settings unavailable"
          message={settingsState.error.message}
          actionLabel="Retry"
          onAction={settingsState.refresh}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.xl }}>
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Card>
              <SettingsOptionRow
                label={uiStrings.settings.units}
                description={uiStrings.settings.unitDescription}
                options={unitOptions}
                value={settingsState.settings.unitSystem}
                onChange={handleUnitChange}
              />
              <View style={{ paddingVertical: theme.spacing.md }}>
                <Input
                  label={uiStrings.settings.locationLabel}
                  value={locationInput}
                  onChangeText={setLocationInput}
                  helperText={uiStrings.settings.locationHelper}
                  onBlur={handleLocationBlur}
                />
              </View>
            </Card>
          </View>

          <View style={{ marginBottom: theme.spacing.lg }}>
            <Card>
              <SettingsToggleRow
                label={uiStrings.settings.reminders}
                description={uiStrings.settings.remindersDescription}
                value={settingsState.settings.notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                disabled={notificationsDisabled}
                testID="care-reminders-toggle"
              />
              <SettingsToggleRow
                label={uiStrings.settings.weatherAlerts}
                description={
                  WEATHER_ALERTS_ENABLED
                    ? uiStrings.settings.weatherAlertsEnabled
                    : uiStrings.settings.weatherAlertsDisabled
                }
                value={settingsState.settings.weatherAlertsEnabled}
                onValueChange={handleWeatherToggle}
                disabled={weatherToggleDisabled}
                testID="weather-alerts-toggle"
              />
              <View style={{ paddingVertical: theme.spacing.md }}>
                <Input
                  label={uiStrings.settings.reminderHourLabel}
                  value={hourInput}
                  onChangeText={setHourInput}
                  helperText={`Scheduled at ${formatReminderHour(
                    settingsState.settings.reminderHour,
                  )} UTC`}
                  {...(hourError ? { errorText: hourError } : {})}
                  onBlur={handleHourBlur}
                />
              </View>
              {notificationError ? (
                <Text
                  style={{
                    color: theme.colors.alert,
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.sizes.caption,
                    marginTop: theme.spacing.xs,
                  }}
                >
                  {notificationError}
                </Text>
              ) : null}
            </Card>
          </View>

          <Button
            label={uiStrings.settings.reset}
            variant="secondary"
            onPress={settingsState.resetSettings}
          />
        </ScrollView>
      )}
    </ScreenLayout>
  );
};
