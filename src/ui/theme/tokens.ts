export const colors = {
  primary: '#2E7D32',
  primaryPressed: '#1B5E20',
  primaryDisabled: '#B9C7B9',
  accent: '#A3D977',
  supporting: '#6D4C41',
  background: '#F3F7F2',
  surface: '#FFFFFF',
  surfacePressed: '#E6F2E6',
  textPrimary: '#1F2A1F',
  textSecondary: '#4F5B4F',
  textDisabled: '#9AA79A',
  border: '#D6DED6',
  borderDisabled: '#C9D6C9',
  alert: '#C62828',
  warning: '#F9A825',
  warningBackground: '#FFF5D1',
  info: '#2E6F95',
  placeholder: '#8A978A',
  success: '#2E7D32',
  alertBackground: '#FDEAEA',
};

export type FontWeight = '400' | '600' | '700';

export const typography = {
  fontFamily: {
    heading: 'Merriweather',
    body: 'Source Sans 3',
    headingFallback: 'Georgia',
    bodyFallback: 'Arial',
  },
  sizes: {
    display: 30,
    h1: 24,
    h2: 20,
    h3: 18,
    bodyL: 16,
    bodyM: 14,
    caption: 12,
    button: 14,
  },
  lineHeights: {
    display: 36,
    h1: 30,
    h2: 26,
    h3: 24,
    bodyL: 24,
    bodyM: 20,
    caption: 16,
    button: 16,
  },
  weights: {
    regular: '400',
    semiBold: '600',
    bold: '700',
  } satisfies Record<string, FontWeight>,
  letterSpacing: {
    button: 0.2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radius = {
  card: 12,
  button: 8,
  sheet: 16,
  image: 10,
};

export const sizing = {
  minTouch: 48,
  inputHeight: 48,
  appBarHeight: 56,
  bottomNavHeight: 56,
  iconButton: 40,
  iconSize: 20,
  listItemImage: 72,
};

export const borders = {
  thin: 1,
  thick: 2,
};

export const motion = {
  durationFast: 180,
  durationBase: 240,
  easing: 'ease-out',
  pageOffset: 8,
};

export const themeTokens = {
  colors,
  typography,
  spacing,
  radius,
  sizing,
  borders,
  motion,
};

export type ThemeTokens = typeof themeTokens;
