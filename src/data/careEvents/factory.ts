import { createCareEventRepository, type CareEventRepository } from './repository';
import { createDbCareEventStore } from './storage';

export const createDefaultCareEventRepository = (): CareEventRepository =>
  createCareEventRepository(createDbCareEventStore());
