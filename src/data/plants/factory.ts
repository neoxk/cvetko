import { MemoryCache, type Cache } from '@data/cache';
import { createPerenualClient } from '@data/perenual/client';
import { createTrefleClient } from '@data/trefle/client';
import { createPlantDetailRepository, type PlantDetailRepository } from './detailRepository';
import { createPlantRepository, type PlantRepository } from './repository';

export type PlantRepositories = {
  listRepository: PlantRepository;
  detailRepository: PlantDetailRepository;
};

export type PlantRepositoryFactoryOptions = {
  trefleToken: string;
  perenualApiKey: string;
  cache?: Cache;
};

export const createPlantRepositories = (
  options: PlantRepositoryFactoryOptions,
): PlantRepositories => {
  const cache = options.cache ?? new MemoryCache();
  const trefleClient = createTrefleClient({ token: options.trefleToken });
  const perenualClient = createPerenualClient({ apiKey: options.perenualApiKey });

  return {
    listRepository: createPlantRepository({ trefleClient, perenualClient }),
    detailRepository: createPlantDetailRepository({ trefleClient, perenualClient, cache }),
  };
};

export const createDefaultPlantRepositories = (): PlantRepositories | null => {
  const trefleToken = process.env.EXPO_PUBLIC_TREFLE_TOKEN;
  const perenualApiKey = process.env.EXPO_PUBLIC_PERENUAL_KEY;

  if (!trefleToken || !perenualApiKey) {
    return null;
  }

  return createPlantRepositories({ trefleToken, perenualApiKey });
};
