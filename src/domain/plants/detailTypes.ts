export type PlantDetailSource = 'trefle' | 'perenual';

export type PlantDetailImage = {
  url: string;
  alt?: string;
};

export type PlantCareSection = {
  label: string;
  value: string;
};

export type PlantDetail = {
  id: string;
  source: PlantDetailSource;
  commonName: string | null;
  scientificName: string;
  family: string | null;
  genus: string | null;
  description: string | null;
  images: PlantDetailImage[];
  care: PlantCareSection[];
  growth: PlantCareSection[];
  pests: string[];
};
