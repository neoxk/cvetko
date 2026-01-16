import React from 'react';
import { renderHook, act } from '@testing-library/react-native';

import { usePlantFilters } from './usePlantFilters';

describe('usePlantFilters', () => {
  it('updates query and clears filters', () => {
    const { result } = renderHook(() => usePlantFilters());

    act(() => {
      result.current.setQuery('fern');
      result.current.setEdible(true);
      result.current.setWatering('average');
    });

    expect(result.current.filters.query).toBe('fern');
    expect(result.current.filters.edible).toBe(true);
    expect(result.current.filters.watering).toBe('average');

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.query).toBe('');
    expect(result.current.filters.edible).toBeUndefined();
    expect(result.current.filters.watering).toBeUndefined();
  });
});
