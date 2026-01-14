import React from 'react';
import { Text } from 'react-native';

import { renderWithTheme } from '../../test/renderWithTheme';
import { Card } from './Card';

describe('Card', () => {
  it('renders children content', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>Card content</Text>
      </Card>,
    );

    expect(getByText('Card content')).toBeTruthy();
  });
});
