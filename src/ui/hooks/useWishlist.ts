import React from 'react';

import type { WishlistRepository } from '@data/wishlist/repository';
import { createDefaultWishlistRepository } from '@data/wishlist/factory';
import type { WishlistItem } from '@domain/wishlist/types';
import { createAppError } from '@utils/errors';

export type UseWishlistState = {
  items: WishlistItem[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  toggle: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
};

export type UseWishlistParams = {
  repository?: WishlistRepository;
};

export const useWishlist = ({ repository }: UseWishlistParams = {}): UseWishlistState => {
  const resolvedRepository = React.useMemo(
    () => repository ?? createDefaultWishlistRepository(),
    [repository],
  );
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadItems = React.useCallback(async () => {
    if (!resolvedRepository) {
      setError(
        createAppError('ConfigError', 'Wishlist storage is unavailable.', {
          details: { feature: 'wishlist' },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await resolvedRepository.getAll();
      setItems(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRepository]);

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const toggle = React.useCallback(
    (item: WishlistItem) => {
      if (!resolvedRepository) {
        return;
      }

      const exists = items.some((existing) => existing.id === item.id);
      const nextItems = exists
        ? items.filter((existing) => existing.id !== item.id)
        : [item, ...items];

      setItems(nextItems);
      resolvedRepository
        .toggle(item)
        .catch((err: Error) => {
          setItems(items);
          setError(err);
        });
    },
    [items, resolvedRepository],
  );

  const isInWishlist = React.useCallback(
    (id: string) => items.some((existing) => existing.id === id),
    [items],
  );

  return {
    items,
    isLoading,
    error,
    refresh: loadItems,
    toggle,
    isInWishlist,
  };
};
