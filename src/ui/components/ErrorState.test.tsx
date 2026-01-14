import React from 'react';

import { renderWithTheme } from '../../test/renderWithTheme';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders title and message', () => {
    const { getByText } = renderWithTheme(
      <ErrorState title="Something failed" message="Try again later." />,
    );

    expect(getByText('Something failed')).toBeTruthy();
    expect(getByText('Try again later.')).toBeTruthy();
  });

  it('renders action button when provided', () => {
    const { getByText } = renderWithTheme(
      <ErrorState
        title="Network error"
        message="Check your connection."
        actionLabel="Retry"
        onAction={() => undefined}
      />,
    );

    expect(getByText('Retry')).toBeTruthy();
  });
});
