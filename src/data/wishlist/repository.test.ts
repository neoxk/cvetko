import { createWishlistRepository } from './repository';
import { MemoryStorage, type StorageAdapter } from './storage';

const item = {
  id: '1',
  source: 'perenual' as const,
  name: 'Rose',
  scientificName: 'Rosa',
  imageUrl: null,
  addedAt: '2024-01-01T00:00:00.000Z',
};

describe('wishlist repository', () => {
  it('adds and removes items', async () => {
    const repo = createWishlistRepository(new MemoryStorage());

    await repo.add(item);
    expect(await repo.isInWishlist(item.id, item.source)).toBe(true);

    await repo.remove(item.id, item.source);
    expect(await repo.isInWishlist(item.id, item.source)).toBe(false);
  });

  it('toggles items', async () => {
    const repo = createWishlistRepository(new MemoryStorage());

    expect(await repo.toggle(item)).toBe(true);
    expect(await repo.toggle(item)).toBe(false);
  });

  it('handles storage errors', async () => {
    const failingStorage: StorageAdapter = {
      getItem: async () => {
        throw new Error('fail');
      },
      setItem: async () => {
        throw new Error('fail');
      },
      removeItem: async () => {
        throw new Error('fail');
      },
    };
    const repo = createWishlistRepository(failingStorage);

    await expect(repo.add(item)).rejects.toMatchObject({ name: 'WishlistError' });
  });
});
