import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '@ui/theme';

type PlantDetailRowProps = {
  label: string;
  value: string;
};

export const PlantDetailRow = ({ label, value }: PlantDetailRowProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.sm }}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.caption,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.bodyM,
        }}
      >
        {value}
      </Text>
    </View>
  );
};
