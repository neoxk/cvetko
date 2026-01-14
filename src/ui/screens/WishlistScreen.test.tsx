import React from 'react';
import { renderWithTheme } from '../../test/renderWithTheme';
import { WishlistScreen } from './WishlistScreen';

jest.mock('@navigation/navigationHelpers', () => ({
  useRootNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@ui/hooks/useWishlist', () => ({
  useWishlist: () => ({
    items: [],
    isLoading: false,
    error: null,
    refresh: jest.fn(),
    toggle: jest.fn(),
    isInWishlist: jest.fn(),
  }),
}));

describe('WishlistScreen', () => {
  it('renders empty state', () => {
    const { getByText } = renderWithTheme(<WishlistScreen />);

    expect(getByText('No saved plants')).toBeTruthy();
  });
});
