export type PlantSource = 'trefle' | 'perenual';

export type PlantListItem = {
  id: string;
  source: PlantSource;
  commonName: string | null;
  scientificName: string;
  imageUrl: string | null;
};

export type PlantListFilters = {
  query?: string;
  edible?: boolean;
  poisonous?: boolean;
  cycle?: string;
  sunlight?: string;
  watering?: string;
  hardiness?: number;
};
