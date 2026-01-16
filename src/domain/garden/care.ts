import { GARDEN_DEFAULTS } from './constants';

type WateringLevel = 'frequent' | 'average' | 'minimum' | 'none';

const wateringDays: Record<WateringLevel, number> = {
  frequent: 3,
  average: 7,
  minimum: 14,
  none: 0,
};

export const resolveWaterEveryDays = (value: string | null | undefined): number => {
  if (!value) {
    return GARDEN_DEFAULTS.waterEveryDays;
  }
  const key = value.toLowerCase() as WateringLevel;
  return wateringDays[key] ?? GARDEN_DEFAULTS.waterEveryDays;
};
