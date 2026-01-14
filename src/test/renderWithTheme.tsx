import React, { type ReactElement } from 'react';
import { render } from '@testing-library/react-native';

import { ThemeProvider } from '@ui/theme';

export const renderWithTheme = (ui: ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);
