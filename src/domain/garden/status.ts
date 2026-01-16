import { GARDEN_DEFAULTS } from './constants';
import type { GardenEntry, GardenStatus } from './types';

const daysBetween = (from: string, to: number): number => {
  const fromTime = Date.parse(from);
  if (Number.isNaN(fromTime)) {
    return Infinity;
  }
  return Math.floor((to - fromTime) / (1000 * 60 * 60 * 24));
};

export const getGardenStatus = (
  entry: GardenEntry,
  now: number = Date.now(),
  options: {
    lastWateredAt?: string | null;
    waterEveryDays?: number;
  } = {},
): GardenStatus => {
  const lastWateredAt = options.lastWateredAt ?? entry.lastWateredAt;
  const waterEveryDays = options.waterEveryDays ?? GARDEN_DEFAULTS.waterEveryDays;
  const waterDays = lastWateredAt
    ? daysBetween(lastWateredAt, now)
    : Infinity;

  if (waterDays >= waterEveryDays) {
    return 'needsWater';
  }

  return 'ok';
};
