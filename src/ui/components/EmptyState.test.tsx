import React from 'react';

import { renderWithTheme } from '../../test/renderWithTheme';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and message', () => {
    const { getByText } = renderWithTheme(
      <EmptyState title="No plants yet" message="Add your first plant." />,
    );

    expect(getByText('No plants yet')).toBeTruthy();
    expect(getByText('Add your first plant.')).toBeTruthy();
  });

  it('renders action button when provided', () => {
    const { getByText } = renderWithTheme(
      <EmptyState
        title="No plants"
        message="Add one to get started."
        actionLabel="Add plant"
        onAction={() => undefined}
      />,
    );

    expect(getByText('Add plant')).toBeTruthy();
  });
});
