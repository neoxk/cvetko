import React from 'react';

import type { GardenRepository } from '@data/garden/repository';
import { createDefaultGardenRepository } from '@data/garden/factory';
import type { GardenEntry } from '@domain/garden/types';
import { createAppError } from '@utils/errors';

export type UseGardenState = {
  entries: GardenEntry[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  addEntry: (entry: GardenEntry) => void;
  updateEntry: (entry: GardenEntry) => void;
  removeEntry: (id: string) => void;
  getById: (id: string) => GardenEntry | null;
  hasPlant: (plantId: string, source: GardenEntry['source']) => boolean;
};

export type UseGardenParams = {
  repository?: GardenRepository;
};

export const useGarden = ({ repository }: UseGardenParams = {}): UseGardenState => {
  const resolvedRepository = React.useMemo(
    () => repository ?? createDefaultGardenRepository(),
    [repository],
  );
  const [entries, setEntries] = React.useState<GardenEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadEntries = React.useCallback(async () => {
    if (!resolvedRepository) {
      setError(
        createAppError('ConfigError', 'Garden storage is unavailable.', {
          details: { feature: 'garden' },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await resolvedRepository.getAll();
      setEntries(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRepository]);

  React.useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const addEntry = React.useCallback(
    (entry: GardenEntry) => {
      if (!resolvedRepository) {
        return;
      }
      setEntries((prev) => [entry, ...prev]);
      resolvedRepository.add(entry).catch((err: Error) => {
        setEntries((prev) => prev.filter((item) => item.id !== entry.id));
        setError(err);
      });
    },
    [resolvedRepository],
  );

  const updateEntry = React.useCallback(
    (entry: GardenEntry) => {
      if (!resolvedRepository) {
        return;
      }
      setEntries((prev) => prev.map((item) => (item.id === entry.id ? entry : item)));
      resolvedRepository.update(entry).catch((err: Error) => {
        setError(err);
        void loadEntries();
      });
    },
    [loadEntries, resolvedRepository],
  );

  const removeEntry = React.useCallback(
    (id: string) => {
      if (!resolvedRepository) {
        return;
      }
      const previous = entries;
      setEntries((prev) => prev.filter((item) => item.id !== id));
      resolvedRepository.remove(id).catch((err: Error) => {
        setEntries(previous);
        setError(err);
      });
    },
    [entries, resolvedRepository],
  );

  const getById = React.useCallback(
    (id: string) => entries.find((entry) => entry.id === id) ?? null,
    [entries],
  );

  const hasPlant = React.useCallback(
    (plantId: string, source: GardenEntry['source']) =>
      entries.some((entry) => entry.plantId === plantId && entry.source === source),
    [entries],
  );

  return {
    entries,
    isLoading,
    error,
    refresh: loadEntries,
    addEntry,
    updateEntry,
    removeEntry,
    getById,
    hasPlant,
  };
};
