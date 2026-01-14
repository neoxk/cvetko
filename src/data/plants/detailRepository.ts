import { normalizeApiError } from '@data/errors';
import type { Cache } from '@data/cache';
import { cacheKeys, cacheTtlMs } from '@data/cache/keys';
import { invalidateAllPlantDetails, invalidatePlantDetail } from '@data/cache/invalidation';
import type { PlantDetails } from '@data/types';
import type { PlantDetail, PlantDetailSource } from '@domain/plants/detailTypes';
import { mapPlantDetailsToDetail } from '@domain/plants/detailMappers';
import type { createPerenualClient } from '@data/perenual/client';
import type { createTrefleClient } from '@data/trefle/client';

type TrefleClient = ReturnType<typeof createTrefleClient>;
type PerenualClient = ReturnType<typeof createPerenualClient>;

export type PlantDetailRepositoryParams = {
  id: string;
  source: PlantDetailSource;
};

export type PlantDetailRepository = {
  getPlantDetail: (params: PlantDetailRepositoryParams) => Promise<PlantDetail>;
  invalidate: (params: PlantDetailRepositoryParams) => void;
  invalidateAll: () => void;
};

export type PlantDetailRepositoryOptions = {
  trefleClient: TrefleClient;
  perenualClient: PerenualClient;
  cache: Cache;
};

const fetchDetails = async (
  source: PlantDetailSource,
  id: string,
  trefleClient: TrefleClient,
  perenualClient: PerenualClient,
): Promise<PlantDetails> => {
  if (source === 'trefle') {
    return trefleClient.getPlantDetails(id);
  }

  return perenualClient.getPlantDetails(id);
};

export const createPlantDetailRepository = (
  options: PlantDetailRepositoryOptions,
): PlantDetailRepository => ({
  getPlantDetail: async ({ id, source }) => {
    const cacheKey = cacheKeys.plantDetail(source, id);
    const cached = options.cache.get<PlantDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const details = await fetchDetails(
        source,
        id,
        options.trefleClient,
        options.perenualClient,
      );
      const detail = mapPlantDetailsToDetail(details, source);
      options.cache.set(cacheKey, detail, cacheTtlMs.plantDetails);
      return detail;
    } catch (error) {
      throw normalizeApiError(error, {
        service: source,
        message: 'Failed to load plant details',
        kind: 'unknown',
        retryable: false,
        context: { id, source },
      });
    }
  },
  invalidate: ({ id, source }) => invalidatePlantDetail(options.cache, source, id),
  invalidateAll: () => invalidateAllPlantDetails(options.cache),
});
