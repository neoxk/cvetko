import { createWishlistRepository, type WishlistRepository } from './repository';
import { createDbWishlistStore } from './storage';

export const createDefaultWishlistRepository = (): WishlistRepository =>
  createWishlistRepository(createDbWishlistStore());
