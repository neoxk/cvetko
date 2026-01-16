import React from 'react';

import type { CareEventRepository } from '@data/careEvents/repository';
import { createDefaultCareEventRepository } from '@data/careEvents/factory';
import type { CareEvent } from '@domain/care/types';
import { createAppError } from '@utils/errors';

export type UseCareEventsState = {
  events: CareEvent[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  addWaterEvent: (entryId: string, plantId: string) => void;
  getLatestWaterEvent: (entryId: string) => CareEvent | null;
};

export type UseCareEventsParams = {
  repository?: CareEventRepository;
};

const nowIso = (): string => new Date().toISOString();

export const useCareEvents = ({ repository }: UseCareEventsParams = {}): UseCareEventsState => {
  const resolvedRepository = React.useMemo(
    () => repository ?? createDefaultCareEventRepository(),
    [repository],
  );
  const [events, setEvents] = React.useState<CareEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadEvents = React.useCallback(async () => {
    if (!resolvedRepository) {
      setError(
        createAppError('ConfigError', 'Care event storage is unavailable.', {
          details: { feature: 'care' },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await resolvedRepository.getAll();
      setEvents(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRepository]);

  React.useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const addWaterEvent = React.useCallback(
    (entryId: string, plantId: string) => {
      if (!resolvedRepository) {
        return;
      }
      const event: CareEvent = {
        id: `water-${entryId}-${Date.now()}`,
        entryId,
        plantId,
        type: 'water',
        occurredAt: nowIso(),
        notes: null,
      };
      setEvents((prev) => [event, ...prev]);
      resolvedRepository.add(event).catch((err: Error) => {
        setEvents((prev) => prev.filter((item) => item.id !== event.id));
        setError(err);
      });
    },
    [resolvedRepository],
  );

  const getLatestWaterEvent = React.useCallback(
    (entryId: string) => {
      let latest: CareEvent | null = null;
      let latestTime = -1;
      for (const event of events) {
        if (event.entryId !== entryId || event.type !== 'water') {
          continue;
        }
        const time = Date.parse(event.occurredAt);
        if (!Number.isNaN(time) && time > latestTime) {
          latestTime = time;
          latest = event;
        }
      }
      return latest;
    },
    [events],
  );

  return {
    events,
    isLoading,
    error,
    refresh: loadEvents,
    addWaterEvent,
    getLatestWaterEvent,
  };
};
