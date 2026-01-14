import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithTheme } from '../../test/renderWithTheme';
import { CareCalendarScreen } from './CareCalendarScreen';

const mockUseCalendar = jest.fn();

jest.mock('@ui/hooks/useCalendar', () => ({
  useCalendar: () => mockUseCalendar(),
}));

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
    updateSettings: jest.fn(),
    resetSettings: jest.fn(),
  }),
}));

describe('CareCalendarScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders empty state for week view', () => {
    mockUseCalendar.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      addTask: jest.fn(),
      updateTask: jest.fn(),
      removeTask: jest.fn(),
      getById: jest.fn(),
    });

    const { getByText } = renderWithTheme(<CareCalendarScreen />);

    expect(getByText('No tasks this week')).toBeTruthy();
  });

  it('switches views and renders tasks in range', () => {
    mockUseCalendar.mockReturnValue({
      tasks: [
        {
          id: 'task-1',
          plantId: 'p1',
          plantName: 'Aloe',
          type: 'water',
          title: 'Water Aloe',
          dueDate: '2024-01-01',
          status: 'pending',
          recurrence: null,
          completedAt: null,
          notes: null,
        },
        {
          id: 'task-2',
          plantId: 'p2',
          plantName: 'Fern',
          type: 'mist',
          title: 'Mist Fern',
          dueDate: '2024-01-25',
          status: 'pending',
          recurrence: null,
          completedAt: null,
          notes: null,
        },
      ],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      addTask: jest.fn(),
      updateTask: jest.fn(),
      removeTask: jest.fn(),
      getById: jest.fn(),
    });

    const { getByText, queryByText } = renderWithTheme(<CareCalendarScreen />);

    expect(getByText('Water Aloe')).toBeTruthy();
    expect(queryByText('Mist Fern')).toBeNull();

    fireEvent.press(getByText('Month'));
    expect(getByText('Mist Fern')).toBeTruthy();

    fireEvent.press(getByText('Day'));
    expect(queryByText('Mist Fern')).toBeNull();
  });
});
