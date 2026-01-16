import type { Cache } from '@data/cache';
import { cacheKeys } from './keys';

export const invalidatePlantDetail = (
  cache: Cache,
  id: string,
): void => {
  cache.delete(cacheKeys.plantDetail(id));
};

export const invalidateAllPlantDetails = (cache: Cache): void => {
  cache.clear();
};
