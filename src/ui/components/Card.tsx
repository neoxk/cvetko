import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@ui/theme';

type CardProps = {
  children: ReactNode;
};

export const Card = ({ children }: CardProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.textPrimary,
          borderRadius: theme.radius.card,
          borderWidth: theme.borders.thin,
          padding: theme.spacing.lg,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
