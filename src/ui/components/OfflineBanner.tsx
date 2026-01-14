import React from 'react';
import { Text, View } from 'react-native';

import type { NetworkStatus } from '@data/network/status';
import { Button } from '@ui/components/Button';
import { useTheme } from '@ui/theme';
import { uiStrings } from '@ui/strings';

type OfflineBannerProps = {
  status: NetworkStatus;
  onRetry?: () => void;
};

export const OfflineBanner = ({
  status,
  onRetry,
}: OfflineBannerProps): React.ReactElement | null => {
  const theme = useTheme();

  if (status !== 'offline') {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.warningBackground,
        borderColor: theme.colors.warning,
        borderWidth: theme.borders.thin,
        borderRadius: theme.radius.card,
        padding: theme.spacing.md,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.bodyM,
        }}
      >
        {uiStrings.offline.title}
      </Text>
      {onRetry ? (
        <View style={{ marginTop: theme.spacing.sm }}>
          <Button label={uiStrings.offline.retry} variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
};
