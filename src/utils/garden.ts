import type { PlantDetail } from '@domain/plants/detailTypes';
import type { GardenEntry } from '@domain/garden/types';

const nowIso = (): string => new Date().toISOString();

export const gardenEntryFromDetail = (detail: PlantDetail): GardenEntry => ({
  id: `${detail.source}-${detail.id}-${Date.now()}`,
  plantId: detail.id,
  source: detail.source,
  name: detail.commonName ?? detail.scientificName,
  scientificName: detail.scientificName,
  imageUrl: detail.images[0]?.url ?? null,
  location: null,
  plantedAt: nowIso(),
  lastWateredAt: nowIso(),
  lastFertilizedAt: null,
  notes: null,
});
