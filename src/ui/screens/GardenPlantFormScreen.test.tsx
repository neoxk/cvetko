import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithTheme } from '../../test/renderWithTheme';
import { GardenPlantFormScreen } from './GardenPlantFormScreen';

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

describe('GardenPlantFormScreen', () => {
  it('shows validation errors on submit', async () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <GardenPlantFormScreen
        route={{ key: 'GardenForm', name: 'GardenForm', params: {} }}
        navigation={{ goBack: jest.fn() } as never}
      />,
    );

    fireEvent.press(getByLabelText('Add plant'));

    await waitFor(() => {
      expect(getByText('Plant name is required.')).toBeTruthy();
      expect(getByText('Scientific name is required.')).toBeTruthy();
      expect(getByText('Planting date is required.')).toBeTruthy();
    });
  });
});
