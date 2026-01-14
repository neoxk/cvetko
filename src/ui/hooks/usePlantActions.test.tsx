import React from 'react';
import { renderHook, act } from '@testing-library/react-native';

import type { PlantDetail } from '@domain/plants/detailTypes';
import { usePlantActions } from './usePlantActions';

const detail: PlantDetail = {
  id: '1',
  source: 'perenual',
  commonName: 'Rose',
  scientificName: 'Rosa',
  family: null,
  genus: null,
  description: null,
  images: [],
  care: [],
  growth: [],
  pests: [],
};

describe('usePlantActions', () => {
  it('optimistically adds to wishlist and rolls back on error', async () => {
    const addToWishlist = jest.fn().mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() =>
      usePlantActions(detail, { addToWishlist }),
    );

    act(() => {
      result.current.addToWishlist();
    });

    expect(result.current.isInWishlist).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isInWishlist).toBe(false);
    expect(result.current.error?.message).toBe('fail');
  });

  it('adds to garden when successful', async () => {
    const addToGarden = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePlantActions(detail, { addToGarden }),
    );

    act(() => {
      result.current.addToGarden();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isInGarden).toBe(true);
  });
});
