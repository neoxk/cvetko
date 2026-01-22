import { createWishlistRepository } from './repository';
import { MemoryWishlistStore, type WishlistStore } from './storage';

const item = {
  id: '1',
  source: 'app',
  name: 'Rose',
  scientificName: 'Rosa',
  imageUrl: null,
  addedAt: '2024-01-01T00:00:00.000Z',
};

describe('wishlist repository', () => {
  it('adds and removes items', async () => {
    const repo = createWishlistRepository(new MemoryWishlistStore());

    await repo.add(item);
    expect(await repo.isInWishlist(item.id)).toBe(true);

    await repo.remove(item.id);
    expect(await repo.isInWishlist(item.id)).toBe(false);
  });

  it('toggles items', async () => {
    const repo = createWishlistRepository(new MemoryWishlistStore());

    expect(await repo.toggle(item)).toBe(true);
    expect(await repo.toggle(item)).toBe(false);
  });

  it('handles storage errors', async () => {
    const failingStorage: WishlistStore = {
      getAll: async () => {
        throw new Error('fail');
      },
      add: async () => {
        throw new Error('fail');
      },
      remove: async () => {
        throw new Error('fail');
      },
      isInWishlist: async () => {
        throw new Error('fail');
      },
    };
    const repo = createWishlistRepository(failingStorage);

    await expect(repo.add(item)).rejects.toMatchObject({ name: 'WishlistError' });
  });
});
