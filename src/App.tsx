import React from 'react';
import { NavigationContainer, DefaultTheme, type Theme } from '@react-navigation/native';

import { RootNavigator } from '@navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@ui/theme';
import { ErrorBoundary } from '@ui/components/ErrorBoundary';
import { OnboardingScreen } from '@ui/screens/OnboardingScreen';
import { useOnboarding } from '@ui/hooks/useOnboarding';
import { useNotificationSync } from '@ui/hooks/useNotificationSync';
import { initializeDatabase } from '@data/db/client';
import { logger } from '@utils/logger';

const AppContent = (): React.ReactElement => {
  const theme = useTheme();
  const onboarding = useOnboarding();
  useNotificationSync();

  const navigationTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
  };

  React.useEffect(() => {
    initializeDatabase().catch((error: Error) => {
      logger.error('Failed to initialize database', { error });
    });
  }, []);

  if (onboarding.isLoading) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    );
  }

  if (onboarding.error) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    );
  }

  if (!onboarding.state.completed) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <OnboardingScreen onComplete={onboarding.complete} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

const App = (): React.ReactElement => (
  <ThemeProvider>
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
