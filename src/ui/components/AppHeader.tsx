import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@ui/theme';

type AppHeaderProps = {
  title: string;
};

export const AppHeader = ({ title }: AppHeaderProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: theme.borders.thin,
          height: theme.sizing.appBarHeight,
          paddingHorizontal: theme.spacing.xl,
        },
      ]}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily.heading,
          fontSize: theme.typography.sizes.h2,
          fontWeight: theme.typography.weights.bold,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
