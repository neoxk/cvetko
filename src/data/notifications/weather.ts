import { WEATHER_ALERTS_ENABLED } from '@domain/notifications/constants';
import type { WeatherAlert } from '@domain/notifications/types';

export type WeatherAlertParams = {
  latitude: number;
  longitude: number;
  enabled?: boolean;
};

export const getWeatherAlerts = async ({
  enabled = WEATHER_ALERTS_ENABLED,
}: WeatherAlertParams): Promise<WeatherAlert[]> => {
  if (!enabled) {
    return [];
  }
  return [];
};
