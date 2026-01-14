import type { PlantListFilters } from './types';

export type TrefleFilterQuery = Record<string, string | number | boolean>;

export type PerenualQuery = {
  query?: string;
  edible?: boolean;
  poisonous?: boolean;
  cycle?: string;
  sunlight?: string;
  watering?: string;
  hardiness?: number;
};

export const normalizeQuery = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const buildTrefleFilters = (filters: PlantListFilters): TrefleFilterQuery => {
  const result: TrefleFilterQuery = {};

  if (filters.edible !== undefined) {
    result['edible'] = filters.edible;
  }

  if (filters.poisonous !== undefined) {
    result['poisonous'] = filters.poisonous;
  }

  if (filters.sunlight) {
    result['sunlight'] = filters.sunlight;
  }

  return result;
};

export const buildPerenualQuery = (filters: PlantListFilters): PerenualQuery => {
  const query = normalizeQuery(filters.query);
  const result: PerenualQuery = {};

  if (query !== undefined) {
    result.query = query;
  }

  if (filters.edible !== undefined) {
    result.edible = filters.edible;
  }

  if (filters.poisonous !== undefined) {
    result.poisonous = filters.poisonous;
  }

  if (filters.cycle !== undefined) {
    result.cycle = filters.cycle;
  }

  if (filters.sunlight !== undefined) {
    result.sunlight = filters.sunlight;
  }

  if (filters.watering !== undefined) {
    result.watering = filters.watering;
  }

  if (filters.hardiness !== undefined) {
    result.hardiness = filters.hardiness;
  }

  return result;
};
