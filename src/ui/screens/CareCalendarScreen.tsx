import React from 'react';
import { FlatList, View, type ListRenderItemInfo } from 'react-native';

import type { CalendarTask } from '@domain/calendar/types';
import { addDaysUtc, getTodayUtc, isWithinRange, parseDateOnly } from '@utils/dates';
import { Button } from '@ui/components/Button';
import { CalendarTaskItem } from '@ui/components/CalendarTaskItem';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { TaskDetailSheet } from '@ui/components/TaskDetailSheet';
import { useCalendar } from '@ui/hooks/useCalendar';
import { useSettings } from '@ui/hooks/useSettings';
import { useTheme } from '@ui/theme';
import { uiStrings } from '@ui/strings';

type CalendarView = 'day' | 'week' | 'month';

const getViewRange = (view: CalendarView): { start: Date; end: Date } => {
  const start = getTodayUtc();
  if (view === 'day') {
    return { start, end: start };
  }
  if (view === 'week') {
    return { start, end: addDaysUtc(start, 6) };
  }
  return { start, end: addDaysUtc(start, 29) };
};

const getEmptyMessage = (view: CalendarView): { title: string; message: string } => {
  if (view === 'day') {
    return {
      title: 'No tasks today',
      message: 'Your care calendar is clear for today.',
    };
  }
  if (view === 'week') {
    return {
      title: 'No tasks this week',
      message: 'You are all caught up for the next seven days.',
    };
  }
  return {
    title: 'No tasks this month',
    message: 'Plan upcoming care tasks to keep plants thriving.',
  };
};

export const CareCalendarScreen = (): React.ReactElement => {
  const theme = useTheme();
  const settingsState = useSettings();
  const calendarParams = settingsState.isLoading
    ? {}
    : {
        notificationsEnabled: settingsState.settings.notificationsEnabled,
        reminderHour: settingsState.settings.reminderHour,
      };
  const calendar = useCalendar(calendarParams);
  const [view, setView] = React.useState<CalendarView>('week');
  const [selectedTask, setSelectedTask] = React.useState<CalendarTask | null>(null);
  const [isSheetVisible, setIsSheetVisible] = React.useState(false);

  const closeSheet = React.useCallback(() => {
    setIsSheetVisible(false);
    setSelectedTask(null);
  }, []);

  const range = React.useMemo(() => getViewRange(view), [view]);
  const filteredTasks = React.useMemo(() => {
    return calendar.tasks
      .filter((task) => {
        const dueDate = parseDateOnly(task.dueDate);
        return dueDate ? isWithinRange(dueDate, range.start, range.end) : false;
      })
      .sort((a, b) => {
        const first = parseDateOnly(a.dueDate);
        const second = parseDateOnly(b.dueDate);
        if (!first || !second) {
          return 0;
        }
        return first.getTime() - second.getTime();
      });
  }, [calendar.tasks, range.end, range.start]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<CalendarTask>) => (
      <CalendarTaskItem
        task={item}
        onPress={() => {
          setSelectedTask(item);
          setIsSheetVisible(true);
        }}
      />
    ),
    [],
  );

  let content = null;
  if (calendar.isLoading) {
    content = <LoadingState message="Loading your care calendar..." />;
  } else if (calendar.error) {
    content = (
      <ErrorState
        title="Calendar unavailable"
        message={calendar.error.message}
        actionLabel="Retry"
        onAction={calendar.refresh}
      />
    );
  } else if (filteredTasks.length === 0) {
    const emptyCopy = getEmptyMessage(view);
    content = <EmptyState title={emptyCopy.title} message={emptyCopy.message} />;
  } else {
    content = (
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
      />
    );
  }

  return (
    <ScreenLayout title="Care calendar" footerText={uiStrings.common.appName}>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
        <View style={{ marginRight: theme.spacing.sm }}>
          <Button
            label="Day"
            variant={view === 'day' ? 'primary' : 'secondary'}
            onPress={() => setView('day')}
          />
        </View>
        <View style={{ marginRight: theme.spacing.sm }}>
          <Button
            label="Week"
            variant={view === 'week' ? 'primary' : 'secondary'}
            onPress={() => setView('week')}
          />
        </View>
        <Button
          label="Month"
          variant={view === 'month' ? 'primary' : 'secondary'}
          onPress={() => setView('month')}
        />
      </View>
      {content}
      <TaskDetailSheet
        task={selectedTask}
        visible={isSheetVisible}
        onClose={closeSheet}
        onMarkDone={(task) => {
          calendar.updateTask({
            ...task,
            status: 'done',
            completedAt: new Date().toISOString(),
          });
          closeSheet();
        }}
        onReschedule={(task, nextDate) => {
          calendar.updateTask({
            ...task,
            dueDate: nextDate,
            status: 'pending',
            completedAt: null,
          });
          closeSheet();
        }}
      />
    </ScreenLayout>
  );
};
