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
  other_name?: string[] | string | null;
  origin?: string[] | string | null;
  type?: string | null;
  dimensions?: {
    type?: string | null;
    min_value?: number | string | null;
    max_value?: number | string | null;
    unit?: string | null;
  } | null;
  cycle?: string | null;
  watering?: string | null;
  watering_general_benchmark?: {
    value?: number | string | null;
    unit?: string | null;
  } | null;
  sunlight?: string[] | null;
  pruning_month?: string[] | null;
  pruning_count?: {
    amount?: number | string | null;
    interval?: string | null;
  } | null;
  seeds?: number | null;
  attracts?: string[] | null;
  propagation?: string[] | null;
  hardiness?: {
    min?: number | string | null;
    max?: number | string | null;
  } | null;
  flowers?: boolean | null;
  flowering_season?: string[] | string | null;
  soil?: string[] | null;
  pest_susceptibility?: string[] | null;
  cones?: boolean | null;
  fruits?: boolean | null;
  description?: string | null;
  edible_fruit?: boolean | null;
  edible_leaf?: boolean | null;
  fruiting_season?: string[] | string | null;
  harvest_season?: string[] | string | null;
  harvest_method?: string | null;
  leaf?: boolean | null;
  growth_rate?: string | null;
  maintenance?: string | null;
  medicinal?: boolean | null;
  poisonous_to_humans?: boolean | null;
  poisonous_to_pets?: boolean | null;
  drought_tolerant?: boolean | null;
  salt_tolerant?: boolean | null;
  thorny?: boolean | null;
  invasive?: boolean | null;
  rare?: boolean | null;
  tropical?: boolean | null;
  cuisine?: boolean | null;
  indoor?: boolean | null;
  care_level?: string | null;
  plant_anatomy?: { part?: string | null; color?: string[] | null }[] | null;
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

const resolveScientificNames = (
  value: PerenualListItem['scientific_name'],
): string[] | null => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : null;
  }
  return value ? [value] : null;
};

const resolveStringList = (
  value: string[] | string | null | undefined,
): string[] | null => {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? value : [value];
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

const parseString = (value: number | string | null | undefined): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  return String(value);
};

export const mapPerenualSummary = (item: PerenualListItem): PlantSummary => ({
  id: toStringId(item.id),
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
    scientificNames: resolveScientificNames(item.scientific_name),
    otherNames: resolveStringList(item.other_name),
    family: item.family ?? null,
    genus: item.genus ?? null,
    origin: resolveStringList(item.origin),
    type: item.type ?? null,
    dimensions: item.dimensions
      ? {
          type: item.dimensions.type ?? null,
          min: parseNumber(item.dimensions.min_value),
          max: parseNumber(item.dimensions.max_value),
          unit: item.dimensions.unit ?? null,
        }
      : null,
    year: null,
    edible: edibleKnown ? edible : null,
    poisonous: poisonousKnown ? poisonous : null,
    cycle: item.cycle ?? null,
    watering: item.watering ?? null,
    wateringGeneralBenchmark: item.watering_general_benchmark
      ? {
          value: parseString(item.watering_general_benchmark.value),
          unit: item.watering_general_benchmark.unit ?? null,
        }
      : null,
    sunlight: item.sunlight ?? null,
    pruningMonth: item.pruning_month ?? null,
    pruningCount: item.pruning_count
      ? {
          amount: parseNumber(item.pruning_count.amount),
          interval: item.pruning_count.interval ?? null,
        }
      : null,
    seeds: item.seeds ?? null,
    attracts: item.attracts ?? null,
    propagation: item.propagation ?? null,
    hardiness: item.hardiness
      ? {
          min: parseNumber(item.hardiness.min),
          max: parseNumber(item.hardiness.max),
        }
      : null,
    flowers: item.flowers ?? null,
    floweringSeason: resolveStringList(item.flowering_season)?.join(', ') ?? null,
    soil: item.soil ?? null,
    pestSusceptibility: item.pest_susceptibility ?? null,
    cones: item.cones ?? null,
    fruits: item.fruits ?? null,
    edibleFruit: item.edible_fruit ?? null,
    fruitingSeason: resolveStringList(item.fruiting_season)?.join(', ') ?? null,
    harvestSeason: resolveStringList(item.harvest_season)?.join(', ') ?? null,
    harvestMethod: item.harvest_method ?? null,
    leaf: item.leaf ?? null,
    edibleLeaf: item.edible_leaf ?? null,
    growthRate: item.growth_rate ?? null,
    maintenance: item.maintenance ?? null,
    medicinal: item.medicinal ?? null,
    poisonousToHumans: item.poisonous_to_humans ?? null,
    poisonousToPets: item.poisonous_to_pets ?? null,
    droughtTolerant: item.drought_tolerant ?? null,
    saltTolerant: item.salt_tolerant ?? null,
    thorny: item.thorny ?? null,
    invasive: item.invasive ?? null,
    rare: item.rare ?? null,
    tropical: item.tropical ?? null,
    cuisine: item.cuisine ?? null,
    indoor: item.indoor ?? null,
    careLevel: item.care_level ?? null,
    plantAnatomy: item.plant_anatomy
      ? item.plant_anatomy.map((entry) => ({
          part: entry.part ?? null,
          colors: entry.color ?? null,
        }))
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
