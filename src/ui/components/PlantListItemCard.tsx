import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { Card } from '@ui/components/Card';
import { Button } from '@ui/components/Button';
import { useTheme } from '@ui/theme';

type PlantListItemCardProps = {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  statusLabel?: string | null;
  statusTone?: 'neutral' | 'warning' | 'alert';
  onPress?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionDisabled?: boolean;
};

export const PlantListItemCard = ({
  title,
  subtitle,
  imageUrl,
  statusLabel,
  statusTone = 'neutral',
  onPress,
  actionLabel,
  onAction,
  actionDisabled = false,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionDisabled = false,
}: PlantListItemCardProps): React.ReactElement => {
  const theme = useTheme();
  const statusStyles = {
    neutral: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      textColor: theme.colors.textSecondary,
    },
    warning: {
      backgroundColor: theme.colors.warningBackground,
      borderColor: theme.colors.warning,
      textColor: theme.colors.warning,
    },
    alert: {
      backgroundColor: theme.colors.alertBackground,
      borderColor: theme.colors.alert,
      textColor: theme.colors.alert,
    },
  } as const;
  const statusStyle = statusStyles[statusTone];

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={onPress}
          accessibilityRole={onPress ? 'button' : undefined}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{
                borderRadius: theme.radius.image,
                width: theme.sizing.listItemImage,
                height: theme.sizing.listItemImage,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                borderRadius: theme.radius.image,
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                borderWidth: theme.borders.thin,
                width: theme.sizing.listItemImage,
                height: theme.sizing.listItemImage,
              }}
            />
          )}
          <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: theme.typography.sizes.h3,
                fontWeight: theme.typography.weights.semiBold,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.sizes.bodyM,
                }}
              >
                {subtitle}
              </Text>
            ) : null}
            {statusLabel ? (
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radius.button,
                  backgroundColor: statusStyle.backgroundColor,
                  borderWidth: theme.borders.thin,
                  borderColor: statusStyle.borderColor,
                }}
              >
                <Text
                  style={{
                    color: statusStyle.textColor,
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.sizes.caption,
                  }}
                >
                  {statusLabel}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
        {actionLabel && onAction ? (
          <View style={{ marginLeft: theme.spacing.sm, gap: theme.spacing.xs }}>
            <Button
              label={actionLabel}
              variant="tertiary"
              onPress={onAction}
              disabled={actionDisabled}
            />
            {secondaryActionLabel && onSecondaryAction ? (
              <Button
                label={secondaryActionLabel}
                variant="tertiary"
                onPress={onSecondaryAction}
                disabled={secondaryActionDisabled}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </Card>
  );
};
