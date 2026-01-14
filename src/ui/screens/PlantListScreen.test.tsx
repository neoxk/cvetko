import React from 'react';
import { waitFor } from '@testing-library/react-native';

import type { PlantRepository } from '@data/plants/repository';
import { renderWithTheme } from '../../test/renderWithTheme';
import { PlantListScreen } from './PlantListScreen';

jest.mock('@navigation/navigationHelpers', () => ({
  useRootNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('PlantListScreen', () => {
  it('renders plant items', async () => {
    const repository: PlantRepository = {
      listPlants: jest.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            source: 'perenual',
            commonName: 'Rose',
            scientificName: 'Rosa',
            imageUrl: null,
          },
        ],
        page: 1,
        total: 1,
        totalPages: 1,
      }),
    };

    const { getByText } = renderWithTheme(<PlantListScreen repository={repository} />);

    await waitFor(() => {
      expect(getByText('Rose')).toBeTruthy();
    });
  });

  it('renders empty state when no items', async () => {
    const repository: PlantRepository = {
      listPlants: jest.fn().mockResolvedValue({
        data: [],
        page: 1,
        total: 0,
        totalPages: 0,
      }),
    };

    const { getByText } = renderWithTheme(<PlantListScreen repository={repository} />);

    await waitFor(() => {
      expect(getByText('No plants found')).toBeTruthy();
    });
  });
});
