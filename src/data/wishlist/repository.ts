import { createAppError } from '@utils/errors';
import { logger } from '@utils/logger';
import type { WishlistItem } from '@domain/wishlist/types';
import type { WishlistStore } from './storage';

export type WishlistRepository = {
  getAll: () => Promise<WishlistItem[]>;
  add: (item: WishlistItem) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggle: (item: WishlistItem) => Promise<boolean>;
  isInWishlist: (id: string) => Promise<boolean>;
};

export const createWishlistRepository = (store: WishlistStore): WishlistRepository => ({
  getAll: async () => store.getAll(),
  add: async (item) => {
    try {
      await store.add(item);
    } catch (error) {
      logger.error('Wishlist add failed', { error, id: item.id });
      throw createAppError('WishlistError', 'Failed to add to wishlist', { cause: error });
    }
  },
  remove: async (id) => {
    try {
      await store.remove(id);
    } catch (error) {
      logger.error('Wishlist remove failed', { error, id });
      throw createAppError('WishlistError', 'Failed to remove from wishlist', { cause: error });
    }
  },
  toggle: async (item) => {
    try {
      const exists = await store.isInWishlist(item.id);
      if (exists) {
        await store.remove(item.id);
        return false;
      }
      await store.add(item);
      return true;
    } catch (error) {
      logger.error('Wishlist toggle failed', { error, id: item.id });
      throw createAppError('WishlistError', 'Failed to update wishlist', { cause: error });
    }
  },
  isInWishlist: async (id) => store.isInWishlist(id),
});
