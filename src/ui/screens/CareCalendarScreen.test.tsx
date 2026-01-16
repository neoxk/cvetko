import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithTheme } from '../../test/renderWithTheme';
import { CareCalendarScreen } from './CareCalendarScreen';

const mockUseGarden = jest.fn();
const mockUseCareEvents = jest.fn();

jest.mock('@ui/hooks/useGarden', () => ({
  useGarden: () => mockUseGarden(),
}));

jest.mock('@ui/hooks/useCareEvents', () => ({
  useCareEvents: () => mockUseCareEvents(),
}));

describe('CareCalendarScreen', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T10:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders empty state for week view', () => {
    mockUseGarden.mockReturnValue({
      entries: [],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      addEntry: jest.fn(),
      updateEntry: jest.fn(),
      removeEntry: jest.fn(),
      getById: jest.fn(),
      hasPlant: jest.fn(),
    });
    mockUseCareEvents.mockReturnValue({
      events: [],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      addWaterEvent: jest.fn(),
      getLatestWaterEvent: jest.fn(),
    });

    const { getByText } = renderWithTheme(<CareCalendarScreen />);

    expect(getByText('No tasks this week')).toBeTruthy();
  });

  it('switches views and renders tasks in range', () => {
    mockUseGarden.mockReturnValue({
      entries: [
        {
          id: 'g1',
          plantId: 'p1',
          name: 'Aloe',
          scientificName: 'Aloe vera',
          imageUrl: null,
          location: null,
          plantedAt: '2023-12-01',
          watering: 'frequent',
          sunlight: null,
          cycle: null,
          hardinessMin: null,
          hardinessMax: null,
          description: null,
          lastWateredAt: '2023-12-29T00:00:00.000Z',
          notes: null,
        },
      ],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      addEntry: jest.fn(),
      updateEntry: jest.fn(),
      removeEntry: jest.fn(),
      getById: jest.fn(),
      hasPlant: jest.fn(),
    });
    mockUseCareEvents.mockReturnValue({
      events: [],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      addWaterEvent: jest.fn(),
      getLatestWaterEvent: jest.fn(() => null),
    });

    const { getAllByText, getByText, queryByText } = renderWithTheme(<CareCalendarScreen />);

    expect(getAllByText('Aloe').length).toBeGreaterThan(0);
    expect(queryByText('Fern')).toBeNull();

    fireEvent.press(getByText('Month'));
    expect(getAllByText('1 water').length).toBeGreaterThan(0);

    fireEvent.press(getByText('Day'));
    expect(queryByText('Fern')).toBeNull();
  });
});
