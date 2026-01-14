import React from 'react';
import { renderWithTheme } from '../../test/renderWithTheme';
import { OfflineBanner } from './OfflineBanner';

describe('OfflineBanner', () => {
  it('renders when offline', () => {
    const { getByText } = renderWithTheme(<OfflineBanner status="offline" />);

    expect(getByText('You are offline. Some data may be outdated.')).toBeTruthy();
  });

  it('does not render when online', () => {
    const { queryByText } = renderWithTheme(<OfflineBanner status="online" />);

    expect(queryByText('You are offline. Some data may be outdated.')).toBeNull();
  });
});
