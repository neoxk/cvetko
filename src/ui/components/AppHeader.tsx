import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '@ui/theme';

type AppHeaderProps = {
  title: string;
  onBack?: () => void;
};

export const AppHeader = ({ title, onBack }: AppHeaderProps): React.ReactElement => {
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
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { backgroundColor: theme.colors.surfacePressed },
            ]}
          >
            <Ionicons name="chevron-back" size={theme.sizing.iconSize} color={theme.colors.primary} />
          </Pressable>
        ) : null}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
