import { createGardenRepository, type GardenRepository } from './repository';
import { createDbGardenStore } from './storage';

export const createDefaultGardenRepository = (): GardenRepository =>
  createGardenRepository(createDbGardenStore());
