import type { WishlistItem } from '@domain/wishlist/types';
import { getDatabase } from '@data/db/connection';
import { logger } from '@utils/logger';

export type WishlistStore = {
  getAll: () => Promise<WishlistItem[]>;
  add: (item: WishlistItem) => Promise<void>;
  remove: (id: string) => Promise<void>;
  isInWishlist: (id: string) => Promise<boolean>;
};

export class MemoryWishlistStore implements WishlistStore {
  private items = new Map<string, WishlistItem>();

  async getAll(): Promise<WishlistItem[]> {
    return Array.from(this.items.values());
  }

  async add(item: WishlistItem): Promise<void> {
    this.items.set(item.id, item);
  }

  async remove(id: string): Promise<void> {
    this.items.delete(id);
  }

  async isInWishlist(id: string): Promise<boolean> {
    return this.items.has(id);
  }
}

const mapRowToWishlistItem = (row: {
  id: string;
  source: string;
  name: string;
  scientific_name: string;
  image_url: string | null;
  added_at: string;
}): WishlistItem => ({
  id: row.id,
  source: row.source,
  name: row.name,
  scientificName: row.scientific_name,
  imageUrl: row.image_url ?? null,
  addedAt: row.added_at,
});

export const createDbWishlistStore = (
  dbPromise: Promise<DatabaseClient> = getDatabase(),
): WishlistStore => ({
  getAll: async () => {
    const db = await dbPromise;
    logger.debug('DB wishlist getAll');
    const rows = await db.getAllAsync<{
      id: string;
      source: string;
      name: string;
      scientific_name: string;
      image_url: string | null;
      added_at: string;
    }>(
      `SELECT id, source, name, scientific_name, image_url, added_at
       FROM wishlist_items
       ORDER BY added_at DESC`,
    );
    return rows.map(mapRowToWishlistItem);
  },
  add: async (item) => {
    const db = await dbPromise;
    logger.debug('DB wishlist add', {
      id: item.id,
      source: item.source,
      name: item.name,
      scientificName: item.scientificName,
      imageUrl: item.imageUrl,
      addedAt: item.addedAt,
    });
    const result = await db.runAsync(
      `INSERT OR REPLACE INTO wishlist_items
       (id, source, name, scientific_name, image_url, added_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item.id, item.source, item.name, item.scientificName, item.imageUrl, item.addedAt],
    );
    logger.debug('DB wishlist add complete', {
      id: item.id,
      changes: result?.changes ?? null,
    });
  },
  remove: async (id) => {
    const db = await dbPromise;
    logger.debug('DB wishlist remove', { id });
    await db.runAsync(`DELETE FROM wishlist_items WHERE id = ?`, [id]);
  },
  isInWishlist: async (id) => {
    const db = await dbPromise;
    logger.debug('DB wishlist isInWishlist', { id });
    const row = await db.getFirstAsync<{ id: string }>(
      `SELECT id FROM wishlist_items WHERE id = ? LIMIT 1`,
      [id],
    );
    return Boolean(row?.id);
  },
});
