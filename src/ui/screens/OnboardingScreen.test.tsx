import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithTheme } from '../../test/renderWithTheme';
import { OnboardingScreen } from './OnboardingScreen';

describe('OnboardingScreen', () => {
  it('invokes completion on continue', () => {
    const onComplete = jest.fn();
    const { getByText } = renderWithTheme(<OnboardingScreen onComplete={onComplete} />);

    fireEvent.press(getByText('Continue'));

    expect(onComplete).toHaveBeenCalled();
  });

  it('invokes completion on skip', () => {
    const onComplete = jest.fn();
    const { getByText } = renderWithTheme(<OnboardingScreen onComplete={onComplete} />);

    fireEvent.press(getByText('Skip for now'));

    expect(onComplete).toHaveBeenCalled();
  });
});
