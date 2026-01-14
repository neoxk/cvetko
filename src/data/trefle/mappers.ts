import type { PaginatedResponse, PlantDetails, PlantSummary } from '@data/types';

export type TrefleListItem = {
  id: number;
  slug: string;
  common_name: string | null;
  scientific_name: string;
  image_url: string | null;
  family_common_name?: string | null;
  genus?: string | null;
  year?: number | null;
  edible?: boolean | null;
  poisonous?: boolean | null;
};

export type TrefleDetail = TrefleListItem & {
  family?: string | null;
  description?: string | null;
  sunlight?: string[] | null;
  hardiness?: { min?: number | null; max?: number | null } | null;
};

export type TrefleListResponse = {
  data: TrefleListItem[];
  meta?: { total?: number; total_pages?: number; current_page?: number };
};

export type TrefleDetailResponse = {
  data: TrefleDetail;
};

const toStringId = (value: number | string): string => String(value);

const resolveScientificName = (item: TrefleListItem): string =>
  item.scientific_name || item.slug || toStringId(item.id);

export const mapTrefleSummary = (item: TrefleListItem): PlantSummary => ({
  id: toStringId(item.id),
  source: 'trefle',
  commonName: item.common_name ?? null,
  scientificName: resolveScientificName(item),
  imageUrl: item.image_url ?? null,
});

export const mapTrefleDetails = (item: TrefleDetail): PlantDetails => ({
  ...mapTrefleSummary(item),
  family: item.family ?? item.family_common_name ?? null,
  genus: item.genus ?? null,
  year: item.year ?? null,
  edible: item.edible ?? null,
  poisonous: item.poisonous ?? null,
  cycle: null,
  watering: null,
  sunlight: item.sunlight ?? null,
  hardiness: item.hardiness
    ? {
        min: item.hardiness.min ?? null,
        max: item.hardiness.max ?? null,
      }
    : null,
  description: item.description ?? null,
});

export const mapTrefleListResponse = (
  response: TrefleListResponse,
  page: number,
): PaginatedResponse<PlantSummary> => ({
  data: response.data.map(mapTrefleSummary),
  page,
  total: response.meta?.total ?? null,
  totalPages: response.meta?.total_pages ?? null,
});
