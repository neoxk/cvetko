import React from 'react';
import { Text } from 'react-native';

import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useTheme } from '@ui/theme';

export const GardenScreen = (): React.ReactElement => {
  const theme = useTheme();

  return (
    <ScreenLayout title="My garden" footerText="Cvetko">
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.bodyM,
        }}
      >
        Track the plants you own.
      </Text>
    </ScreenLayout>
  );
};
