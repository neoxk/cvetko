import React, { createContext, useContext, type ReactNode } from 'react';

import { themeTokens, type ThemeTokens } from './tokens';

type ThemeProviderProps = {
  children: ReactNode;
  value?: ThemeTokens;
};

const ThemeContext = createContext<ThemeTokens>(themeTokens);

export const ThemeProvider = ({ children, value }: ThemeProviderProps): React.ReactElement => (
  <ThemeContext.Provider value={value ?? themeTokens}>{children}</ThemeContext.Provider>
);

export const useTheme = (): ThemeTokens => useContext(ThemeContext);
