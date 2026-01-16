import React from 'react';
import { renderWithTheme } from '../../test/renderWithTheme';
import { MyGardenScreen } from './MyGardenScreen';

jest.mock('@navigation/navigationHelpers', () => ({
  useRootNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@ui/hooks/useGarden', () => ({
  useGarden: () => ({
    entries: [],
    isLoading: false,
    error: null,
    refresh: jest.fn(),
    addEntry: jest.fn(),
    updateEntry: jest.fn(),
    removeEntry: jest.fn(),
    getById: jest.fn(),
    hasPlant: jest.fn(),
  }),
}));

jest.mock('@ui/hooks/useCareEvents', () => ({
  useCareEvents: () => ({
    events: [],
    isLoading: false,
    error: null,
    refresh: jest.fn(),
    addWaterEvent: jest.fn(),
    getLatestWaterEvent: jest.fn(),
  }),
}));

describe('MyGardenScreen', () => {
  it('renders empty state', () => {
    const { getByText } = renderWithTheme(<MyGardenScreen />);

    expect(getByText('Your garden is empty')).toBeTruthy();
  });
});
