import React from 'react';

import type { SettingsRepository } from '@data/settings/repository';
import { createDefaultSettingsRepository } from '@data/settings/factory';
import type { Settings } from '@domain/settings/types';
import { applySettingsDefaults } from '@utils/settings';
import { createAppError } from '@utils/errors';

export type UseSettingsState = {
  settings: Settings;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  updateSettings: (next: Partial<Settings>) => void;
  resetSettings: () => void;
};

export type UseSettingsParams = {
  repository?: SettingsRepository;
};

export const useSettings = ({ repository }: UseSettingsParams = {}): UseSettingsState => {
  const resolvedRepository = React.useMemo(
    () => repository ?? createDefaultSettingsRepository(),
    [repository],
  );
  const [settings, setSettings] = React.useState<Settings>(applySettingsDefaults(null));
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadSettings = React.useCallback(async () => {
    if (!resolvedRepository) {
      setError(
        createAppError('ConfigError', 'Settings storage is unavailable.', {
          details: { feature: 'settings' },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await resolvedRepository.get();
      setSettings(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRepository]);

  React.useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const updateSettings = React.useCallback(
    (next: Partial<Settings>) => {
      if (!resolvedRepository) {
        return;
      }
      const previous = settings;
      const optimistic = applySettingsDefaults({ ...settings, ...next });
      setSettings(optimistic);
      resolvedRepository.update(next).catch((err: Error) => {
        setSettings(previous);
        setError(err);
      });
    },
    [resolvedRepository, settings],
  );

  const resetSettings = React.useCallback(() => {
    if (!resolvedRepository) {
      return;
    }
    const previous = settings;
    const defaults = applySettingsDefaults(null);
    setSettings(defaults);
    resolvedRepository.reset().catch((err: Error) => {
      setSettings(previous);
      setError(err);
    });
  }, [resolvedRepository, settings]);

  return {
    settings,
    isLoading,
    error,
    refresh: loadSettings,
    updateSettings,
    resetSettings,
  };
};
