export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestQuery = Record<string, string | number | boolean | null | undefined>;

export type HttpResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  total: number | null;
  totalPages: number | null;
};

export type PlantSummary = {
  id: string;
  commonName: string | null;
  scientificName: string;
  imageUrl: string | null;
};

export type PlantDetails = PlantSummary & {
  scientificNames: string[] | null;
  otherNames: string[] | null;
  family: string | null;
  genus: string | null;
  origin: string[] | null;
  type: string | null;
  dimensions: {
    type: string | null;
    min: number | null;
    max: number | null;
    unit: string | null;
  } | null;
  year: number | null;
  edible: boolean | null;
  poisonous: boolean | null;
  cycle: string | null;
  watering: string | null;
  wateringGeneralBenchmark: {
    value: string | null;
    unit: string | null;
  } | null;
  sunlight: string[] | null;
  pruningMonth: string[] | null;
  pruningCount: { amount: number | null; interval: string | null } | null;
  seeds: number | null;
  attracts: string[] | null;
  propagation: string[] | null;
  hardiness: { min: number | null; max: number | null } | null;
  flowers: boolean | null;
  floweringSeason: string | null;
  soil: string[] | null;
  pestSusceptibility: string[] | null;
  cones: boolean | null;
  fruits: boolean | null;
  edibleFruit: boolean | null;
  fruitingSeason: string | null;
  harvestSeason: string | null;
  harvestMethod: string | null;
  leaf: boolean | null;
  edibleLeaf: boolean | null;
  growthRate: string | null;
  maintenance: string | null;
  medicinal: boolean | null;
  poisonousToHumans: boolean | null;
  poisonousToPets: boolean | null;
  droughtTolerant: boolean | null;
  saltTolerant: boolean | null;
  thorny: boolean | null;
  invasive: boolean | null;
  rare: boolean | null;
  tropical: boolean | null;
  cuisine: boolean | null;
  indoor: boolean | null;
  careLevel: string | null;
  plantAnatomy: { part: string | null; colors: string[] | null }[] | null;
  description: string | null;
};
