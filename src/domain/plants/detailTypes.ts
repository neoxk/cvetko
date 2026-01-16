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
  commonName: string | null;
  scientificName: string;
  family: string | null;
  genus: string | null;
  description: string | null;
  images: PlantDetailImage[];
  overview: PlantCareSection[];
  care: PlantCareSection[];
  growth: PlantCareSection[];
  seasonal: PlantCareSection[];
  safety: PlantCareSection[];
  tolerance: PlantCareSection[];
  ecology: PlantCareSection[];
  anatomy: PlantCareSection[];
  pests: string[];
};
