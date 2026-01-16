import React, { type ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

import { ThemeProvider } from '@ui/theme';

export const renderWithTheme = (ui: ReactElement) =>
  render(
    <NavigationContainer>
      <ThemeProvider>{ui}</ThemeProvider>
    </NavigationContainer>,
  );
