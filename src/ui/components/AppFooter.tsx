import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@ui/theme';

type AppFooterProps = {
  text: string;
};

export const AppFooter = ({ text }: AppFooterProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingVertical: theme.spacing.md },
      ]}
    >
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.caption,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
