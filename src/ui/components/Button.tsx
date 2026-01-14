import React from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@ui/theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  testID?: string;
};

const getContainerStyle = (
  variant: ButtonVariant,
  pressed: boolean,
  disabled: boolean,
  theme: ReturnType<typeof useTheme>,
): StyleProp<ViewStyle> => {
  if (variant === 'tertiary') {
    return [
      {
        height: theme.sizing.minTouch,
        justifyContent: 'center',
      },
    ];
  }

  if (variant === 'secondary') {
    return [
      {
        height: theme.sizing.minTouch,
        borderRadius: theme.radius.button,
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: theme.borders.thin,
      },
      {
        backgroundColor: theme.colors.surface,
        borderColor: disabled ? theme.colors.borderDisabled : theme.colors.primary,
      },
      pressed && { backgroundColor: theme.colors.surfacePressed },
    ];
  }

  return [
    {
      height: theme.sizing.minTouch,
      borderRadius: theme.radius.button,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: theme.borders.thin,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    pressed && { backgroundColor: theme.colors.primaryPressed },
    disabled && { backgroundColor: theme.colors.primaryDisabled, borderColor: theme.colors.primaryDisabled },
  ];
};

const getLabelColor = (
  variant: ButtonVariant,
  disabled: boolean,
  pressed: boolean,
  theme: ReturnType<typeof useTheme>,
): string => {
  if (variant === 'primary') {
    return theme.colors.surface;
  }

  if (variant === 'secondary') {
    return disabled ? theme.colors.textDisabled : theme.colors.primary;
  }

  if (disabled) {
    return theme.colors.textDisabled;
  }

  return pressed ? theme.colors.primaryPressed : theme.colors.primary;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  testID,
}: ButtonProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => getContainerStyle(variant, pressed, disabled, theme)}
    >
      {({ pressed }) => (
        <Text
          style={{
            color: getLabelColor(variant, disabled, pressed, theme),
            fontFamily: theme.typography.fontFamily.body,
            fontSize: theme.typography.sizes.button,
            fontWeight: theme.typography.weights.semiBold,
            letterSpacing: theme.typography.letterSpacing.button,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};
