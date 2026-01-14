import React from 'react';

import { renderWithTheme } from '../../test/renderWithTheme';
import { Button } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    const { getByText } = renderWithTheme(<Button label="Save" />);

    expect(getByText('Save')).toBeTruthy();
  });

  it('renders secondary variant label', () => {
    const { getByText } = renderWithTheme(<Button label="Cancel" variant="secondary" />);

    expect(getByText('Cancel')).toBeTruthy();
  });
});
