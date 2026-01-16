export type PlantListItem = {
  id: string;
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
  indoor?: boolean;
  hardiness?: number;
};
