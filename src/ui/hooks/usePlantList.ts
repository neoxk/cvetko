import React from 'react';

import type { PlantRepository } from '@data/plants/repository';
import type { PlantListFilters, PlantListItem } from '@domain/plants/types';
import { createAppError } from '@utils/errors';

export type UsePlantListParams = {
  repository: PlantRepository | null;
  filters: PlantListFilters;
};

export type PlantListState = {
  items: PlantListItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  refresh: () => void;
  loadMore: () => void;
  hasMore: boolean;
};

export const usePlantList = ({
  repository,
  filters,
}: UsePlantListParams): PlantListState => {
  const [items, setItems] = React.useState<PlantListItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadPage = React.useCallback(
    async (nextPage: number, mode: 'initial' | 'refresh' | 'more') => {
      if (!repository) {
        setError(
          createAppError('ConfigError', 'Missing API keys. Set env keys to fetch plants.', {
            details: { api: 'perenual' },
          }),
        );
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
        return;
      }

      setError(null);
      if (mode === 'initial') {
        setIsLoading(true);
      } else if (mode === 'refresh') {
        setIsRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await repository.listPlants({
          page: nextPage,
          filters,
        });
        setItems((prev) => (nextPage === 1 ? response.data : [...prev, ...response.data]));
        setPage(response.page);
        if (response.totalPages !== null) {
          setHasMore(response.page < response.totalPages);
        } else {
          setHasMore(response.data.length > 0);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [filters, repository],
  );

  React.useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    void loadPage(1, 'initial');
  }, [loadPage]);

  const refresh = React.useCallback(() => {
    void loadPage(1, 'refresh');
  }, [loadPage]);

  const loadMore = React.useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }
    void loadPage(page + 1, 'more');
  }, [hasMore, isLoading, isLoadingMore, loadPage, page]);

  return {
    items,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refresh,
    loadMore,
    hasMore,
  };
};
