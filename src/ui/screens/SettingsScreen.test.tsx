import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { renderWithTheme } from '../../test/renderWithTheme';
import { SettingsScreen } from './SettingsScreen';

const mockUpdateSettings = jest.fn();
const mockResetSettings = jest.fn();

jest.mock('@ui/hooks/useSettings', () => ({
  useSettings: () => ({
    settings: {
      unitSystem: 'metric',
      locationLabel: null,
      notificationsEnabled: true,
      weatherAlertsEnabled: false,
      reminderHour: 8,
    },
    isLoading: false,
    error: null,
    refresh: jest.fn(),
    updateSettings: mockUpdateSettings,
    resetSettings: mockResetSettings,
  }),
}));

const mockRequestPermission = jest.fn().mockResolvedValue('granted');
const mockCancelAll = jest.fn().mockResolvedValue(undefined);

jest.mock('@data/notifications/scheduler', () => ({
  createDefaultNotificationScheduler: () => ({
    requestPermission: mockRequestPermission,
    cancelAll: mockCancelAll,
  }),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    mockUpdateSettings.mockClear();
    mockResetSettings.mockClear();
    mockRequestPermission.mockClear();
    mockCancelAll.mockClear();
  });

  it('updates unit selection', () => {
    const { getByText } = renderWithTheme(<SettingsScreen />);

    fireEvent.press(getByText('Imperial'));

    expect(mockUpdateSettings).toHaveBeenCalledWith({ unitSystem: 'imperial' });
  });

  it('requests permission when enabling notifications', async () => {
    const { getByTestId } = renderWithTheme(<SettingsScreen />);

    fireEvent(getByTestId('care-reminders-toggle'), 'valueChange', true);

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled();
    });
  });
});
