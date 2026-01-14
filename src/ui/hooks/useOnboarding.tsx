import React from 'react';

import type { OnboardingRepository } from '@data/onboarding/repository';
import { createDefaultOnboardingRepository } from '@data/onboarding/factory';
import type { OnboardingState } from '@domain/onboarding/types';
import { createAppError } from '@utils/errors';

export type UseOnboardingState = {
  state: OnboardingState;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  complete: () => void;
};

export type UseOnboardingParams = {
  repository?: OnboardingRepository;
};

export const useOnboarding = ({ repository }: UseOnboardingParams = {}): UseOnboardingState => {
  const resolvedRepository = React.useMemo(
    () => repository ?? createDefaultOnboardingRepository(),
    [repository],
  );
  const [state, setState] = React.useState<OnboardingState>({
    completed: false,
    completedAt: null,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadState = React.useCallback(async () => {
    if (!resolvedRepository) {
      setError(
        createAppError('ConfigError', 'Onboarding storage is unavailable.', {
          details: { feature: 'onboarding' },
        }),
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await resolvedRepository.get();
      setState(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedRepository]);

  React.useEffect(() => {
    void loadState();
  }, [loadState]);

  const complete = React.useCallback(() => {
    if (!resolvedRepository) {
      return;
    }
    resolvedRepository
      .complete()
      .then((data) => {
        setState(data);
      })
      .catch((err: Error) => {
        setError(err);
      });
  }, [resolvedRepository]);

  return {
    state,
    isLoading,
    error,
    refresh: loadState,
    complete,
  };
};
