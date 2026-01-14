import React from 'react';
import { act, renderHook } from '@testing-library/react-native';

import { createWishlistRepository } from '@data/wishlist/repository';
import { MemoryStorage } from '@data/wishlist/storage';
import type { WishlistItem } from '@domain/wishlist/types';
import { useWishlist } from './useWishlist';

const item: WishlistItem = {
  id: '1',
  source: 'perenual',
  name: 'Rose',
  scientificName: 'Rosa',
  imageUrl: null,
  addedAt: '2024-01-01T00:00:00.000Z',
};

describe('useWishlist', () => {
  it('toggles items', async () => {
    const repository = createWishlistRepository(new MemoryStorage());
    const { result } = renderHook(() => useWishlist({ repository }));

    await act(async () => {
      await result.current.refresh();
    });

    act(() => {
      result.current.toggle(item);
    });

    expect(result.current.isInWishlist(item.id, item.source)).toBe(true);
  });
});
