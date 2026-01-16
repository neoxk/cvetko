import { normalizeApiError } from '@data/errors';
import type { Cache } from '@data/cache';
import { cacheKeys, cacheTtlMs } from '@data/cache/keys';
import { invalidateAllPlantDetails, invalidatePlantDetail } from '@data/cache/invalidation';
import type { PlantDetails } from '@data/types';
import type { PlantDetail } from '@domain/plants/detailTypes';
import { mapPlantDetailsToDetail } from '@domain/plants/detailMappers';
import type { createPerenualClient } from '@data/perenual/client';

type PerenualClient = ReturnType<typeof createPerenualClient>;

export type PlantDetailRepositoryParams = {
  id: string;
};

export type PlantDetailRepository = {
  getPlantDetail: (params: PlantDetailRepositoryParams) => Promise<PlantDetail>;
  invalidate: (params: PlantDetailRepositoryParams) => void;
  invalidateAll: () => void;
};

export type PlantDetailRepositoryOptions = {
  perenualClient: PerenualClient;
  cache: Cache;
};

const fetchDetails = async (
  id: string,
  perenualClient: PerenualClient,
): Promise<PlantDetails> => perenualClient.getPlantDetails(id);

export const createPlantDetailRepository = (
  options: PlantDetailRepositoryOptions,
): PlantDetailRepository => ({
  getPlantDetail: async ({ id }) => {
    const cacheKey = cacheKeys.plantDetail(id);
    const cached = options.cache.get<PlantDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const details = await fetchDetails(id, options.perenualClient);
      const detail = mapPlantDetailsToDetail(details);
      options.cache.set(cacheKey, detail, cacheTtlMs.plantDetails);
      return detail;
    } catch (error) {
      throw normalizeApiError(error, {
        service: 'perenual',
        message: 'Failed to load plant details',
        kind: 'unknown',
        retryable: false,
        context: { id },
      });
    }
  },
  invalidate: ({ id }) => invalidatePlantDetail(options.cache, id),
  invalidateAll: () => invalidateAllPlantDetails(options.cache),
});
