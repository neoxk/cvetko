import type { PaginatedResponse, PlantDetails, PlantSummary } from '@data/types';

export type PerenualListItem = {
  id: number;
  common_name: string | null;
  scientific_name: string[] | string;
  default_image?: {
    thumbnail?: string | null;
    medium?: string | null;
    original_url?: string | null;
    regular_url?: string | null;
  } | null;
};

export type PerenualDetail = PerenualListItem & {
  family?: string | null;
  genus?: string | null;
  cycle?: string | null;
  watering?: string | null;
  sunlight?: string[] | null;
  hardiness?: {
    min?: number | string | null;
    max?: number | string | null;
  } | null;
  description?: string | null;
  edible_fruit?: boolean | null;
  edible_leaf?: boolean | null;
  poisonous_to_humans?: boolean | null;
  poisonous_to_pets?: boolean | null;
};

export type PerenualListResponse = {
  data: PerenualListItem[];
  meta?: { total?: number; last_page?: number; current_page?: number };
};

export type PerenualDetailResponse = {
  data: PerenualDetail;
};

const toStringId = (value: number | string): string => String(value);

const resolveScientificName = (value: PerenualListItem['scientific_name']): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value;
};

const resolveImageUrl = (item: PerenualListItem): string | null => {
  const image = item.default_image;
  if (!image) {
    return null;
  }
  return image.medium ?? image.regular_url ?? image.original_url ?? image.thumbnail ?? null;
};

const parseNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export const mapPerenualSummary = (item: PerenualListItem): PlantSummary => ({
  id: toStringId(item.id),
  source: 'perenual',
  commonName: item.common_name ?? null,
  scientificName: resolveScientificName(item.scientific_name) || toStringId(item.id),
  imageUrl: resolveImageUrl(item),
});

export const mapPerenualDetails = (item: PerenualDetail): PlantDetails => {
  const edibleKnown =
    (item.edible_fruit !== null && item.edible_fruit !== undefined) ||
    (item.edible_leaf !== null && item.edible_leaf !== undefined);
  const poisonousKnown =
    (item.poisonous_to_humans !== null && item.poisonous_to_humans !== undefined) ||
    (item.poisonous_to_pets !== null && item.poisonous_to_pets !== undefined);
  const edible = item.edible_fruit === true || item.edible_leaf === true;
  const poisonous = item.poisonous_to_humans === true || item.poisonous_to_pets === true;

  return {
    ...mapPerenualSummary(item),
    family: item.family ?? null,
    genus: item.genus ?? null,
    year: null,
    edible: edibleKnown ? edible : null,
    poisonous: poisonousKnown ? poisonous : null,
    cycle: item.cycle ?? null,
    watering: item.watering ?? null,
    sunlight: item.sunlight ?? null,
    hardiness: item.hardiness
      ? {
          min: parseNumber(item.hardiness.min),
          max: parseNumber(item.hardiness.max),
        }
      : null,
    description: item.description ?? null,
  };
};

export const mapPerenualListResponse = (
  response: PerenualListResponse,
  page: number,
): PaginatedResponse<PlantSummary> => ({
  data: response.data.map(mapPerenualSummary),
  page,
  total: response.meta?.total ?? null,
  totalPages: response.meta?.last_page ?? null,
});
