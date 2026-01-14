import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { useTheme } from '@ui/theme';

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fontFamily.heading,
            fontSize: theme.typography.sizes.h2,
            fontWeight: theme.typography.weights.bold,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily.body,
            fontSize: theme.typography.sizes.bodyM,
          },
        ]}
      >
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 12,
  },
});
