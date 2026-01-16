import React from 'react';
import { NavigationContainer, DefaultTheme, type Theme } from '@react-navigation/native';

import { RootNavigator } from '@navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@ui/theme';
import { ErrorBoundary } from '@ui/components/ErrorBoundary';
import { useNotificationSync } from '@ui/hooks/useNotificationSync';
import { getDatabase } from '@data/db/connection';
import { logger, setDebugEnabled } from '@utils/logger';

const AppContent = (): React.ReactElement => {
  if (__DEV__) {
    setDebugEnabled(true);
  }
  const theme = useTheme();
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
    getDatabase().catch((error: Error) => {
      logger.error('Failed to initialize database', { error });
    });
  }, []);

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
