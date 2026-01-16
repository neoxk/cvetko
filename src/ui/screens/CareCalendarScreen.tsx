import React from 'react';
import { FlatList, Text, View, type ListRenderItemInfo } from 'react-native';

import type { GardenEntry } from '@domain/garden/types';
import { resolveWaterEveryDays } from '@domain/garden/care';
import {
  addDaysUtc,
  daysBetweenUtc,
  daysInMonthUtc,
  formatDateOnly,
  getTodayUtc,
  isWithinRange,
} from '@utils/dates';
import { Button } from '@ui/components/Button';
import { Card } from '@ui/components/Card';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useCareEvents } from '@ui/hooks/useCareEvents';
import { useGarden } from '@ui/hooks/useGarden';
import { useTheme } from '@ui/theme';

type CalendarView = 'day' | 'week' | 'month';

type WateringTask = {
  entry: GardenEntry;
  dueDate: string;
  isToday: boolean;
};

const getViewRange = (view: CalendarView): { start: Date; end: Date } => {
  const start = getTodayUtc();
  if (view === 'day') {
    return { start, end: start };
  }
  if (view === 'week') {
    return { start, end: addDaysUtc(start, 6) };
  }
  const endOfMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0));
  return { start, end: endOfMonth };
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

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getStartOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const getMonthGrid = (monthStart: Date): (Date | null)[] => {
  const monthDays = daysInMonthUtc(monthStart.getUTCFullYear(), monthStart.getUTCMonth());
  const startWeekday = monthStart.getUTCDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= monthDays; day += 1) {
    cells.push(new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), day)));
  }
  return cells;
};

export const CareCalendarScreen = (): React.ReactElement => {
  const theme = useTheme();
  const garden = useGarden();
  const careEvents = useCareEvents();
  const [view, setView] = React.useState<CalendarView>('week');

  const today = getTodayUtc();
  const todayKey = formatDateOnly(today);
  const range = React.useMemo(() => getViewRange(view), [view]);

  const resolveLastWateredAt = React.useCallback(
    (entry: GardenEntry) => {
      const latestEvent = careEvents.getLatestWaterEvent(entry.id);
      return latestEvent?.occurredAt ?? entry.lastWateredAt ?? entry.plantedAt ?? null;
    },
    [careEvents],
  );

  const deriveTasksForEntry = React.useCallback(
    (entry: GardenEntry, start: Date, end: Date): WateringTask[] => {
      const lastWateredAt = resolveLastWateredAt(entry);
      if (!lastWateredAt) {
        return [];
      }
      const intervalDays = resolveWaterEveryDays(entry.watering);
      if (intervalDays <= 0) {
        return [];
      }
      const lastDate = new Date(lastWateredAt);
      if (Number.isNaN(lastDate.getTime())) {
        return [];
      }
      const lastUtc = new Date(
        Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate()),
      );
      let dueDate = addDaysUtc(lastUtc, intervalDays);
      if (dueDate.getTime() < start.getTime()) {
        const diffDays = daysBetweenUtc(dueDate, start);
        const skips = Math.floor(diffDays / intervalDays);
        if (skips > 0) {
          dueDate = addDaysUtc(dueDate, skips * intervalDays);
        }
        while (dueDate.getTime() < start.getTime()) {
          dueDate = addDaysUtc(dueDate, intervalDays);
        }
      }
      const tasks: WateringTask[] = [];
      while (dueDate.getTime() <= end.getTime()) {
        const dueKey = formatDateOnly(dueDate);
        tasks.push({
          entry,
          dueDate: dueKey,
          isToday: dueKey === todayKey,
        });
        dueDate = addDaysUtc(dueDate, intervalDays);
      }
      return tasks;
    },
    [resolveLastWateredAt, todayKey],
  );

  const tasksInRange = React.useMemo(() => {
    const entries = garden.entries;
    const nextTasks: WateringTask[] = [];
    for (const entry of entries) {
      nextTasks.push(...deriveTasksForEntry(entry, range.start, range.end));
    }
    return nextTasks.filter((task) => {
      const due = new Date(`${task.dueDate}T00:00:00.000Z`);
      return !Number.isNaN(due.getTime()) && isWithinRange(due, range.start, range.end);
    });
  }, [deriveTasksForEntry, garden.entries, range.end, range.start]);

  const tasksByDay = React.useMemo(() => {
    const map = new Map<string, WateringTask[]>();
    for (const task of tasksInRange) {
      const list = map.get(task.dueDate) ?? [];
      list.push(task);
      map.set(task.dueDate, list);
    }
    return map;
  }, [tasksInRange]);

  const renderDayTask = React.useCallback(
    ({ item }: ListRenderItemInfo<WateringTask>) => (
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: theme.typography.sizes.h3,
              }}
            >
              {item.entry.name}
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.sizes.bodyM,
              }}
            >
              {item.entry.scientificName}
            </Text>
          </View>
          {item.isToday ? (
            <Button label="Water" onPress={() => careEvents.addWaterEvent(item.entry.id, item.entry.plantId)} />
          ) : null}
        </View>
      </Card>
    ),
    [careEvents, theme],
  );

  let content = null;
  if (garden.isLoading || careEvents.isLoading) {
    content = <LoadingState message="Loading your care calendar..." />;
  } else if (garden.error || careEvents.error) {
    content = (
      <ErrorState
        title="Calendar unavailable"
        message={(garden.error ?? careEvents.error)?.message ?? 'Something went wrong.'}
        actionLabel="Retry"
        onAction={() => {
          garden.refresh();
          careEvents.refresh();
        }}
      />
    );
  } else if (tasksInRange.length === 0) {
    const emptyCopy = getEmptyMessage(view);
    content = <EmptyState title={emptyCopy.title} message={emptyCopy.message} />;
  } else if (view === 'month') {
    const monthStart = getStartOfMonth(today);
    const cells = getMonthGrid(monthStart);
    content = (
      <View>
        <View style={{ flexDirection: 'row', marginBottom: theme.spacing.sm }}>
          {weekdayLabels.map((label) => (
            <Text
              key={label}
              style={{
                flex: 1,
                textAlign: 'center',
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.sizes.caption,
              }}
            >
              {label}
            </Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {cells.map((cell, index) => {
            const dateLabel = cell ? formatDateOnly(cell) : null;
            const count = dateLabel ? tasksByDay.get(dateLabel)?.length ?? 0 : 0;
            const isToday = dateLabel === todayKey;
            return (
              <View
                key={`${dateLabel ?? 'empty'}-${index}`}
                style={{
                  width: '14.2857%',
                  padding: theme.spacing.xs,
                  minHeight: 56,
                }}
              >
                {cell ? (
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: isToday ? theme.colors.primary : theme.colors.textPrimary,
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.sizes.caption,
                      }}
                    >
                      {cell.getUTCDate()}
                    </Text>
                    {count > 0 ? (
                      <View
                        style={{
                          marginTop: theme.spacing.xs,
                          alignSelf: 'center',
                          paddingHorizontal: theme.spacing.xs,
                          paddingVertical: 2,
                          borderRadius: theme.radius.button,
                          backgroundColor: theme.colors.warningBackground,
                          borderColor: theme.colors.warning,
                          borderWidth: theme.borders.thin,
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.warning,
                            fontFamily: theme.typography.fontFamily.body,
                            fontSize: theme.typography.sizes.caption,
                          }}
                        >
                          {count} water
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  } else if (view === 'week') {
    const days: { date: Date; key: string }[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = addDaysUtc(range.start, i);
      days.push({ date, key: formatDateOnly(date) });
    }
    content = (
      <FlatList
        data={days}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
        renderItem={({ item }) => {
          const dayTasks = tasksByDay.get(item.key) ?? [];
          const isToday = item.key === todayKey;
          return (
            <View>
              <Text
                style={{
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily.heading,
                  fontSize: theme.typography.sizes.h3,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {weekdayLabels[item.date.getUTCDay()]}
              </Text>
              {dayTasks.length === 0 ? (
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.sizes.bodyM,
                  }}
                >
                  No tasks
                </Text>
              ) : (
                <FlatList
                  data={dayTasks.map((task) => ({ ...task, isToday }))}
                  renderItem={renderDayTask}
                  keyExtractor={(task) => `${task.entry.id}-${task.dueDate}`}
                  ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
                />
              )}
            </View>
          );
        }}
      />
    );
  } else {
    content = (
      <FlatList
        data={tasksInRange}
        renderItem={renderDayTask}
        keyExtractor={(item) => `${item.entry.id}-${item.dueDate}`}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
      />
    );
  }

  return (
    <ScreenLayout title="Care calendar">
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
    </ScreenLayout>
  );
};
