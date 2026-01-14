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
): GardenStatus => {
  const waterDays = entry.lastWateredAt
    ? daysBetween(entry.lastWateredAt, now)
    : Infinity;
  const fertilizeDays = entry.lastFertilizedAt
    ? daysBetween(entry.lastFertilizedAt, now)
    : Infinity;

  if (waterDays >= GARDEN_DEFAULTS.waterEveryDays) {
    return 'needsWater';
  }

  if (fertilizeDays >= GARDEN_DEFAULTS.fertilizeEveryDays) {
    return 'needsFertilizer';
  }

  return 'ok';
};
