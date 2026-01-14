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

export type PlantSource = 'trefle' | 'perenual';

export type PlantSummary = {
  id: string;
  source: PlantSource;
  commonName: string | null;
  scientificName: string;
  imageUrl: string | null;
};

export type PlantDetails = PlantSummary & {
  family: string | null;
  genus: string | null;
  year: number | null;
  edible: boolean | null;
  poisonous: boolean | null;
  cycle: string | null;
  watering: string | null;
  sunlight: string[] | null;
  hardiness: { min: number | null; max: number | null } | null;
  description: string | null;
};
