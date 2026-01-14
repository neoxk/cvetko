import React from 'react';

import type { PlantListFilters } from '@domain/plants/types';

export type PlantFilterState = {
  filters: PlantListFilters;
  setQuery: (value: string) => void;
  setEdible: (value: boolean | undefined) => void;
  setPoisonous: (value: boolean | undefined) => void;
  clearFilters: () => void;
};

export const usePlantFilters = (): PlantFilterState => {
  const [query, setQuery] = React.useState('');
  const [edible, setEdible] = React.useState<boolean | undefined>(undefined);
  const [poisonous, setPoisonous] = React.useState<boolean | undefined>(undefined);

  const filters = React.useMemo(() => {
    const result: PlantListFilters = { query };

    if (edible !== undefined) {
      result.edible = edible;
    }

    if (poisonous !== undefined) {
      result.poisonous = poisonous;
    }

    return result;
  }, [query, edible, poisonous]);

  const clearFilters = React.useCallback(() => {
    setQuery('');
    setEdible(undefined);
    setPoisonous(undefined);
  }, []);

  return {
    filters,
    setQuery,
    setEdible,
    setPoisonous,
    clearFilters,
  };
};
