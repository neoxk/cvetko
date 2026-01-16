import React, { type ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@ui/theme';
import { AppHeader } from './AppHeader';
import { OfflineBanner } from './OfflineBanner';
import { useNetworkStatus } from '@ui/hooks/useNetworkStatus';

type ScreenLayoutProps = {
  title: string;
  children?: ReactNode;
  onBack?: () => void;
};

export const ScreenLayout = ({
  title,
  children,
  onBack,
}: ScreenLayoutProps): React.ReactElement => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { status, refresh } = useNetworkStatus();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader title={title} onBack={onBack} />
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: isLandscape ? theme.spacing.lg : theme.spacing.xl,
            paddingVertical: isLandscape ? theme.spacing.md : theme.spacing.lg,
          },
        ]}
      >
        {status === 'offline' ? (
          <View style={{ marginBottom: theme.spacing.md }}>
            <OfflineBanner status={status} onRetry={refresh} />
          </View>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
