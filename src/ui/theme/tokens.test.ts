import { themeTokens } from './tokens';

describe('theme tokens', () => {
  it('exposes core colors', () => {
    expect(themeTokens.colors.primary).toBe('#2E7D32');
    expect(themeTokens.colors.background).toBe('#F3F7F2');
  });

  it('exposes typography scale', () => {
    expect(themeTokens.typography.sizes.h1).toBe(24);
    expect(themeTokens.typography.lineHeights.bodyM).toBe(20);
  });
});
