import React from 'react';

import type { PlantListFilters } from '@domain/plants/types';

export type PlantFilterState = {
  filters: PlantListFilters;
  setQuery: (value: string) => void;
  setEdible: (value: boolean | undefined) => void;
  setPoisonous: (value: boolean | undefined) => void;
  setWatering: (value: string | undefined) => void;
  setSunlight: (value: string | undefined) => void;
  setIndoor: (value: boolean | undefined) => void;
  clearFilters: () => void;
};

export const usePlantFilters = (): PlantFilterState => {
  const [query, setQuery] = React.useState('');
  const [edible, setEdible] = React.useState<boolean | undefined>(undefined);
  const [poisonous, setPoisonous] = React.useState<boolean | undefined>(undefined);
  const [watering, setWatering] = React.useState<string | undefined>(undefined);
  const [sunlight, setSunlight] = React.useState<string | undefined>(undefined);
  const [indoor, setIndoor] = React.useState<boolean | undefined>(undefined);

  const filters = React.useMemo(() => {
    const result: PlantListFilters = { query };

    if (edible !== undefined) {
      result.edible = edible;
    }

    if (poisonous !== undefined) {
      result.poisonous = poisonous;
    }

    if (watering !== undefined) {
      result.watering = watering;
    }

    if (sunlight !== undefined) {
      result.sunlight = sunlight;
    }

    if (indoor !== undefined) {
      result.indoor = indoor;
    }

    return result;
  }, [query, edible, poisonous, watering, sunlight, indoor]);

  const clearFilters = React.useCallback(() => {
    setQuery('');
    setEdible(undefined);
    setPoisonous(undefined);
    setWatering(undefined);
    setSunlight(undefined);
    setIndoor(undefined);
  }, []);

  return {
    filters,
    setQuery,
    setEdible,
    setPoisonous,
    setWatering,
    setSunlight,
    setIndoor,
    clearFilters,
  };
};
