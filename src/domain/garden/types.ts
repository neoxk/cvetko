export type GardenStatus = 'ok' | 'needsWater';

export type GardenEntry = {
  id: string;
  plantId: string;
  name: string;
  scientificName: string;
  imageUrl: string | null;
  location: string | null;
  plantedAt: string;
  watering: string | null;
  sunlight: string | null;
  cycle: string | null;
  hardinessMin: number | null;
  hardinessMax: number | null;
  description: string | null;
  lastWateredAt: string | null;
  notes: string | null;
};

export type GardenFormValues = {
  name: string;
  scientificName: string;
  location: string;
  plantedAt: string;
  notes: string;
};
