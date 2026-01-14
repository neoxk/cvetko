import { createAsyncStorageAdapter } from '@data/storage/asyncStorage';
import { createGardenRepository, type GardenRepository } from './repository';

export const createDefaultGardenRepository = (): GardenRepository =>
  createGardenRepository(createAsyncStorageAdapter());
