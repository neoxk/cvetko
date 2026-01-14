import React from 'react';
import { waitFor } from '@testing-library/react-native';

import type { PlantDetailRepository } from '@data/plants/detailRepository';
import { renderWithTheme } from '../../test/renderWithTheme';
import { PlantDetailScreen } from './PlantDetailScreen';

describe('PlantDetailScreen', () => {
  it('renders detail sections', async () => {
    const repository: PlantDetailRepository = {
      getPlantDetail: jest.fn().mockResolvedValue({
        id: '1',
        source: 'perenual',
        commonName: 'Rose',
        scientificName: 'Rosa',
        family: 'Rosaceae',
        genus: 'Rosa',
        description: 'A classic flower.',
        images: [],
        care: [{ label: 'Watering', value: 'Average' }],
        growth: [{ label: 'Life cycle', value: 'Perennial' }],
        pests: [],
      }),
      invalidate: jest.fn(),
      invalidateAll: jest.fn(),
    };

    const { getByText } = renderWithTheme(
      <PlantDetailScreen
        repository={repository}
        route={{ key: 'PlantDetail', name: 'PlantDetail', params: { id: '1', source: 'perenual' } }}
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
