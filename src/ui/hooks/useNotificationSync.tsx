import React from 'react';

import { useCalendar } from '@ui/hooks/useCalendar';
import { useSettings } from '@ui/hooks/useSettings';

export const useNotificationSync = (): void => {
  const settingsState = useSettings();
  const calendarParams = React.useMemo(
    () =>
      settingsState.isLoading
        ? {}
        : {
            notificationsEnabled: settingsState.settings.notificationsEnabled,
            reminderHour: settingsState.settings.reminderHour,
            enableNotificationSync: true,
          },
    [settingsState.isLoading, settingsState.settings.notificationsEnabled, settingsState.settings.reminderHour],
  );

  useCalendar(calendarParams);
};
