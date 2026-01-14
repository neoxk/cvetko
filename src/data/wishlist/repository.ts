import { createAppError } from '@utils/errors';
import type { WishlistItem } from '@domain/wishlist/types';
import { loadWishlistItems, saveWishlistItems, type StorageAdapter } from './storage';

export type WishlistRepository = {
  getAll: () => Promise<WishlistItem[]>;
  add: (item: WishlistItem) => Promise<void>;
  remove: (id: string, source: WishlistItem['source']) => Promise<void>;
  toggle: (item: WishlistItem) => Promise<boolean>;
  isInWishlist: (id: string, source: WishlistItem['source']) => Promise<boolean>;
};

export const createWishlistRepository = (storage: StorageAdapter): WishlistRepository => ({
  getAll: async () => loadWishlistItems(storage),
  add: async (item) => {
    try {
      const items = await loadWishlistItems(storage);
      const exists = items.some((existing) => existing.id === item.id && existing.source === item.source);
      if (exists) {
        return;
      }
      await saveWishlistItems(storage, [item, ...items]);
    } catch (error) {
      throw createAppError('WishlistError', 'Failed to add to wishlist', { cause: error });
    }
  },
  remove: async (id, source) => {
    try {
      const items = await loadWishlistItems(storage);
      const nextItems = items.filter((existing) => !(existing.id === id && existing.source === source));
      await saveWishlistItems(storage, nextItems);
    } catch (error) {
      throw createAppError('WishlistError', 'Failed to remove from wishlist', { cause: error });
    }
  },
  toggle: async (item) => {
    try {
      const items = await loadWishlistItems(storage);
      const exists = items.some((existing) => existing.id === item.id && existing.source === item.source);
      if (exists) {
        const nextItems = items.filter(
          (existing) => !(existing.id === item.id && existing.source === item.source),
        );
        await saveWishlistItems(storage, nextItems);
        return false;
      }
      await saveWishlistItems(storage, [item, ...items]);
      return true;
    } catch (error) {
      throw createAppError('WishlistError', 'Failed to update wishlist', { cause: error });
    }
  },
  isInWishlist: async (id, source) => {
    const items = await loadWishlistItems(storage);
    return items.some((existing) => existing.id === id && existing.source === source);
  },
});
