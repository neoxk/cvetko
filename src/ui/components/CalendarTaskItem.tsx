import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { CalendarTask } from '@domain/calendar/types';
import { Card } from '@ui/components/Card';
import { useTheme } from '@ui/theme';

type CalendarTaskItemProps = {
  task: CalendarTask;
  onPress?: () => void;
};

const CalendarTaskItemBase = ({
  task,
  onPress,
}: CalendarTaskItemProps): React.ReactElement => {
  const theme = useTheme();
  const statusConfig =
    task.status === 'done'
      ? {
          label: 'Done',
          backgroundColor: theme.colors.surfacePressed,
          borderColor: theme.colors.success,
          textColor: theme.colors.success,
        }
      : task.status === 'skipped'
        ? {
            label: 'Skipped',
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            textColor: theme.colors.textSecondary,
          }
        : {
            label: 'Upcoming',
            backgroundColor: theme.colors.warningBackground,
            borderColor: theme.colors.warning,
            textColor: theme.colors.warning,
          };

  return (
    <Card>
      <Pressable
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: theme.typography.sizes.h3,
              fontWeight: theme.typography.weights.semiBold,
            }}
          >
            {task.title}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.bodyM,
              marginTop: theme.spacing.xs,
            }}
          >
            {task.plantName} · {task.dueDate}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.radius.button,
            backgroundColor: statusConfig.backgroundColor,
            borderWidth: theme.borders.thin,
            borderColor: statusConfig.borderColor,
          }}
        >
          <Text
            style={{
              color: statusConfig.textColor,
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.sizes.caption,
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </Pressable>
    </Card>
  );
};

export const CalendarTaskItem = React.memo(CalendarTaskItemBase);

CalendarTaskItem.displayName = 'CalendarTaskItem';
