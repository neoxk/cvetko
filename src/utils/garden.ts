import type { PlantDetail } from '@domain/plants/detailTypes';
import type { GardenEntry } from '@domain/garden/types';

const nowIso = (): string => new Date().toISOString();

const findDetailValue = (
  items: { label: string; value: string }[],
  label: string,
): string | null => items.find((item) => item.label === label)?.value ?? null;

const parseHardinessRange = (value: string | null): { min: number | null; max: number | null } => {
  if (!value) {
    return { min: null, max: null };
  }
  const parts = value.split('-').map((part) => part.trim());
  if (parts.length !== 2) {
    return { min: null, max: null };
  }
  const min = Number(parts[0]);
  const max = Number(parts[1]);
  return {
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
  };
};

export const gardenEntryFromDetail = (detail: PlantDetail): GardenEntry => {
  const watering = findDetailValue(detail.care, 'Watering');
  const sunlight = findDetailValue(detail.care, 'Sunlight');
  const cycle = findDetailValue(detail.growth, 'Life cycle');
  const hardinessValue = findDetailValue(detail.growth, 'Hardiness');
  const hardiness = parseHardinessRange(hardinessValue);

  return {
    id: `plant-${detail.id}-${Date.now()}`,
    plantId: detail.id,
    name: detail.commonName ?? detail.scientificName,
    scientificName: detail.scientificName,
    imageUrl: detail.images[0]?.url ?? null,
    location: null,
    plantedAt: nowIso(),
    watering,
    sunlight,
    cycle,
    hardinessMin: hardiness.min,
    hardinessMax: hardiness.max,
    description: detail.description,
    lastWateredAt: nowIso(),
    notes: null,
  };
};
