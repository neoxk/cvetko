import type { Cache } from '@data/cache';
import { cacheKeys } from './keys';
import type { PlantDetailSource } from '@domain/plants/detailTypes';

export const invalidatePlantDetail = (
  cache: Cache,
  source: PlantDetailSource,
  id: string,
): void => {
  cache.delete(cacheKeys.plantDetail(source, id));
};

export const invalidateAllPlantDetails = (cache: Cache): void => {
  cache.clear();
};
