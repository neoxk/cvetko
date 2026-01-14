import { createAsyncStorageAdapter } from '@data/storage/asyncStorage';
import { createWishlistRepository, type WishlistRepository } from './repository';

export const createDefaultWishlistRepository = (): WishlistRepository =>
  createWishlistRepository(createAsyncStorageAdapter());
