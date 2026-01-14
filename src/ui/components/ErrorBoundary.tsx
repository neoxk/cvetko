import React, { Component, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { logger } from '@utils/logger';
import { ErrorState } from './ErrorState';
import { useTheme } from '../theme';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorFallbackProps = {
  onReset: () => void;
};

const ErrorFallback = ({ onReset }: ErrorFallbackProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ErrorState
        title="Something went wrong"
        message="Try again, and if the issue persists, restart the app."
        actionLabel="Try again"
        onAction={onReset}
      />
    </View>
  );
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error): void {
    logger.error('Unhandled UI error', { error });
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});
