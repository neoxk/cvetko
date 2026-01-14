import { createAppError } from '@utils/errors';
import { WISHLIST_STORAGE_KEY } from '@domain/wishlist/constants';
import type { WishlistItem } from '@domain/wishlist/types';

export type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export class MemoryStorage implements StorageAdapter {
  private store = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
}

const parseItems = (raw: string): WishlistItem[] => {
  try {
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    throw createAppError('StorageError', 'Failed to parse wishlist data', { cause: error });
  }
};

const serializeItems = (items: WishlistItem[]): string => JSON.stringify(items);

export const loadWishlistItems = async (storage: StorageAdapter): Promise<WishlistItem[]> => {
  try {
    const raw = await storage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return parseItems(raw);
  } catch (error) {
    throw createAppError('StorageError', 'Failed to load wishlist', { cause: error });
  }
};

export const saveWishlistItems = async (
  storage: StorageAdapter,
  items: WishlistItem[],
): Promise<void> => {
  try {
    if (items.length === 0) {
      await storage.removeItem(WISHLIST_STORAGE_KEY);
      return;
    }
    await storage.setItem(WISHLIST_STORAGE_KEY, serializeItems(items));
  } catch (error) {
    throw createAppError('StorageError', 'Failed to save wishlist', { cause: error });
  }
};
