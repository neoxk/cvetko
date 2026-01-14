import React from 'react';

import type { PlantDetailRepository } from '@data/plants/detailRepository';
import type { PlantDetail, PlantDetailSource } from '@domain/plants/detailTypes';
import { createAppError } from '@utils/errors';

export type UsePlantDetailParams = {
  repository: PlantDetailRepository | null;
  id: string;
  source: PlantDetailSource;
};

export type PlantDetailState = {
  detail: PlantDetail | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};

export const usePlantDetail = ({
  repository,
  id,
  source,
}: UsePlantDetailParams): PlantDetailState => {
  const [detail, setDetail] = React.useState<PlantDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadDetail = React.useCallback(async () => {
    if (!repository) {
      setError(
        createAppError('ConfigError', 'Missing API keys. Set env keys to fetch plants.', {
          details: { source },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setDetail(null);

    try {
      const response = await repository.getPlantDetail({ id, source });
      setDetail(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id, repository, source]);

  React.useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const refresh = React.useCallback(() => {
    void loadDetail();
  }, [loadDetail]);

  return {
    detail,
    isLoading,
    error,
    refresh,
  };
};
