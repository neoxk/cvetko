import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { useTheme } from '@ui/theme';

type InputProps = {
  label?: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  editable?: boolean;
  testID?: string;
};

export const Input = ({
  label,
  value,
  placeholder,
  helperText,
  errorText,
  onChangeText,
  onBlur,
  editable = true,
  testID,
}: InputProps): React.ReactElement => {
  const theme = useTheme();
  const showError = Boolean(errorText);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View>
      {label ? (
        <Text
          style={[
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
              marginBottom: theme.spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        testID={testID}
        accessibilityLabel={label ?? placeholder ?? 'Input'}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        onChangeText={onChangeText}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        style={[
          {
            color: editable ? theme.colors.textPrimary : theme.colors.textDisabled,
            fontFamily: theme.typography.fontFamily.body,
            fontSize: theme.typography.sizes.bodyL,
            backgroundColor: theme.colors.surface,
            borderColor: showError
              ? theme.colors.alert
              : isFocused
                ? theme.colors.primary
                : editable
                  ? theme.colors.border
                  : theme.colors.borderDisabled,
            borderWidth: showError || isFocused ? theme.borders.thick : theme.borders.thin,
            borderRadius: theme.radius.button,
            height: theme.sizing.inputHeight,
            paddingHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xs,
          },
        ]}
      />
      {helperText && !showError ? (
        <Text
          style={[
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
            },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
      {showError ? (
        <Text
          style={[
            {
              color: theme.colors.alert,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
            },
          ]}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};
