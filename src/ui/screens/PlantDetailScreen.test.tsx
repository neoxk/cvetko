import React from 'react';
import { waitFor } from '@testing-library/react-native';

import type { PlantDetailRepository } from '@data/plants/detailRepository';
import { renderWithTheme } from '../../test/renderWithTheme';
import { PlantDetailScreen } from './PlantDetailScreen';

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
    hasPlant: jest.fn(() => false),
  }),
}));

describe('PlantDetailScreen', () => {
  it('renders detail sections', async () => {
    const repository: PlantDetailRepository = {
      getPlantDetail: jest.fn().mockResolvedValue({
        id: '1',
        commonName: 'Rose',
        scientificName: 'Rosa',
        family: 'Rosaceae',
        genus: 'Rosa',
        description: 'A classic flower.',
        images: [],
        overview: [{ label: 'Common name', value: 'Rose' }],
        care: [{ label: 'Watering', value: 'Average' }],
        growth: [{ label: 'Life cycle', value: 'Perennial' }],
        seasonal: [],
        safety: [],
        tolerance: [],
        ecology: [],
        anatomy: [],
        pests: [],
      }),
      invalidate: jest.fn(),
      invalidateAll: jest.fn(),
    };

    const { getByText } = renderWithTheme(
      <PlantDetailScreen
        repository={repository}
        route={{ key: 'PlantDetail', name: 'PlantDetail', params: { id: '1' } }}
        navigation={undefined as never}
      />,
    );

    await waitFor(() => {
      expect(getByText('Overview')).toBeTruthy();
      expect(getByText('Care')).toBeTruthy();
      expect(getByText('Growth')).toBeTruthy();
    });
  });
});
