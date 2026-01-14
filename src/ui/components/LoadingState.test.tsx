import React from 'react';

import { renderWithTheme } from '../../test/renderWithTheme';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders default message', () => {
    const { getByText } = renderWithTheme(<LoadingState />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders custom message', () => {
    const { getByText } = renderWithTheme(<LoadingState message="Fetching plants" />);

    expect(getByText('Fetching plants')).toBeTruthy();
  });
});
