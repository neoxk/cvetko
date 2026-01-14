import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@ui/theme';

type LoadingStateProps = {
  message?: string;
};

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
  },
});
