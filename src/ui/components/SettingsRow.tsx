import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { useTheme } from '@ui/theme';

type SettingsToggleRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  testID?: string;
};

export const SettingsToggleRow = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  testID,
}: SettingsToggleRowProps): React.ReactElement => {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingVertical: theme.spacing.md,
        borderBottomWidth: theme.borders.thin,
        borderBottomColor: theme.colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.bodyL,
            }}
          >
            {label}
          </Text>
          {description ? (
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.sizes.caption,
                marginTop: theme.spacing.xs,
              }}
            >
              {description}
            </Text>
          ) : null}
        </View>
        <Switch
          testID={testID}
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
          accessibilityRole="switch"
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surface}
        />
      </View>
    </View>
  );
};

type Option<T> = {
  label: string;
  value: T;
};

type SettingsOptionRowProps<T> = {
  label: string;
  description?: string;
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
};

export const SettingsOptionRow = <T extends string>({
  label,
  description,
  options,
  value,
  onChange,
}: SettingsOptionRowProps<T>): React.ReactElement => {
  const theme = useTheme();

  return (
    <View
      style={{
        paddingVertical: theme.spacing.md,
        borderBottomWidth: theme.borders.thin,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.bodyL,
        }}
      >
        {label}
      </Text>
      {description ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily.body,
            fontSize: theme.typography.sizes.caption,
            marginTop: theme.spacing.xs,
          }}
        >
          {description}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={{
                borderRadius: theme.radius.button,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.lg,
                marginRight: theme.spacing.sm,
                borderWidth: theme.borders.thin,
                borderColor: isActive ? theme.colors.primary : theme.colors.border,
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
              }}
            >
              <Text
                style={{
                  color: isActive ? theme.colors.surface : theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.sizes.button,
                  fontWeight: theme.typography.weights.semiBold,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
