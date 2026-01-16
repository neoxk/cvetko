import { MemoryCache, type Cache } from '@data/cache';
import { createPerenualClient } from '@data/perenual/client';
import { createPlantDetailRepository, type PlantDetailRepository } from './detailRepository';
import { createPlantRepository, type PlantRepository } from './repository';

export type PlantRepositories = {
  listRepository: PlantRepository;
  detailRepository: PlantDetailRepository;
};

export type PlantRepositoryFactoryOptions = {
  perenualApiKey: string;
  cache?: Cache;
};

export const createPlantRepositories = (
  options: PlantRepositoryFactoryOptions,
): PlantRepositories => {
  const cache = options.cache ?? new MemoryCache();
  const perenualClient = createPerenualClient({ apiKey: options.perenualApiKey });

  return {
    listRepository: createPlantRepository({ perenualClient }),
    detailRepository: createPlantDetailRepository({ perenualClient, cache }),
  };
};

export const createDefaultPlantRepositories = (): PlantRepositories | null => {
  const perenualApiKey = process.env.EXPO_PUBLIC_PERENUAL_KEY;

  if (!perenualApiKey) {
    return null;
  }

  return createPlantRepositories({ perenualApiKey });
};
