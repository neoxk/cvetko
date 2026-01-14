import type { PlantSource } from '@domain/plants/types';

export type GardenStatus = 'ok' | 'needsWater' | 'needsFertilizer';

export type GardenEntry = {
  id: string;
  plantId: string;
  source: PlantSource;
  name: string;
  scientificName: string;
  imageUrl: string | null;
  location: string | null;
  plantedAt: string;
  lastWateredAt: string | null;
  lastFertilizedAt: string | null;
  notes: string | null;
};

export type GardenFormValues = {
  name: string;
  scientificName: string;
  location: string;
  plantedAt: string;
  notes: string;
};
