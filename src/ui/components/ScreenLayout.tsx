import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@ui/theme';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';

type ScreenLayoutProps = {
  title: string;
  footerText?: string;
  children?: ReactNode;
};

export const ScreenLayout = ({
  title,
  footerText,
  children,
}: ScreenLayoutProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppHeader title={title} />
      <View style={[styles.content, { padding: theme.spacing.xl }]}>{children}</View>
      {footerText ? <AppFooter text={footerText} /> : null}
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
