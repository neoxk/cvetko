import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@ui/components/Button';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useTheme } from '@ui/theme';
import { uiStrings } from '@ui/strings';

type OnboardingScreenProps = {
  onComplete: () => void;
};

export const OnboardingScreen = ({
  onComplete,
}: OnboardingScreenProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <ScreenLayout title={uiStrings.onboarding.title} footerText={uiStrings.common.appName}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: theme.typography.sizes.h1,
              fontWeight: theme.typography.weights.bold,
              marginBottom: theme.spacing.md,
            }}
          >
            {uiStrings.onboarding.headline}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.bodyL,
              lineHeight: theme.typography.lineHeights.bodyL,
            }}
          >
            {uiStrings.onboarding.body}
          </Text>
        </View>
        <View>
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Button label={uiStrings.onboarding.continue} onPress={onComplete} />
          </View>
          <Button label={uiStrings.onboarding.skip} variant="tertiary" onPress={onComplete} />
        </View>
      </View>
    </ScreenLayout>
  );
};
