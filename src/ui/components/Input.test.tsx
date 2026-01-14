import React from 'react';

import { renderWithTheme } from '../../test/renderWithTheme';
import { Input } from './Input';

describe('Input', () => {
  it('renders label and helper text', () => {
    const { getByText } = renderWithTheme(
      <Input
        label="Plant name"
        value=""
        helperText="Enter at least 3 characters."
        onChangeText={() => undefined}
      />,
    );

    expect(getByText('Plant name')).toBeTruthy();
    expect(getByText('Enter at least 3 characters.')).toBeTruthy();
  });

  it('renders error text when provided', () => {
    const { getByText } = renderWithTheme(
      <Input
        label="Plant name"
        value=""
        errorText="This field is required."
        onChangeText={() => undefined}
      />,
    );

    expect(getByText('This field is required.')).toBeTruthy();
  });
});
