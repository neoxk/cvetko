import React from 'react';

import type { PlantDetail } from '@domain/plants/detailTypes';

export type PlantActionHandlers = {
  addToWishlist?: (detail: PlantDetail) => Promise<void>;
  addToGarden?: (detail: PlantDetail) => Promise<void>;
};

export type PlantActionState = {
  isInWishlist: boolean;
  isInGarden: boolean;
  isUpdatingWishlist: boolean;
  isUpdatingGarden: boolean;
  error: Error | null;
  addToWishlist: () => void;
  addToGarden: () => void;
};

export type PlantActionOptions = {
  initialInWishlist?: boolean;
  initialInGarden?: boolean;
};

export const usePlantActions = (
  detail: PlantDetail | null,
  handlers: PlantActionHandlers = {},
  options: PlantActionOptions = {},
): PlantActionState => {
  const [isInWishlist, setIsInWishlist] = React.useState(options.initialInWishlist ?? false);
  const [isInGarden, setIsInGarden] = React.useState(options.initialInGarden ?? false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = React.useState(false);
  const [isUpdatingGarden, setIsUpdatingGarden] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    setIsInWishlist(options.initialInWishlist ?? false);
    setIsInGarden(options.initialInGarden ?? false);
    setError(null);
  }, [detail?.id, options.initialInGarden, options.initialInWishlist]);

  const addToWishlist = React.useCallback(() => {
    if (!detail || isInWishlist || isUpdatingWishlist) {
      return;
    }
    const previous = isInWishlist;
    setIsInWishlist(true);
    setIsUpdatingWishlist(true);
    setError(null);

    const handler = handlers.addToWishlist ?? (() => Promise.resolve());
    handler(detail)
      .catch((err: Error) => {
        setIsInWishlist(previous);
        setError(err);
      })
      .finally(() => {
        setIsUpdatingWishlist(false);
      });
  }, [detail, handlers.addToWishlist, isInWishlist, isUpdatingWishlist]);

  const addToGarden = React.useCallback(() => {
    if (!detail || isInGarden || isUpdatingGarden) {
      return;
    }
    const previous = isInGarden;
    setIsInGarden(true);
    setIsUpdatingGarden(true);
    setError(null);

    const handler = handlers.addToGarden ?? (() => Promise.resolve());
    handler(detail)
      .catch((err: Error) => {
        setIsInGarden(previous);
        setError(err);
      })
      .finally(() => {
        setIsUpdatingGarden(false);
      });
  }, [detail, handlers.addToGarden, isInGarden, isUpdatingGarden]);

  return {
    isInWishlist,
    isInGarden,
    isUpdatingWishlist,
    isUpdatingGarden,
    error,
    addToWishlist,
    addToGarden,
  };
};
