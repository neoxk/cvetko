import React from 'react';
import { FlatList, View, type ListRenderItemInfo } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import type { GardenEntry } from '@domain/garden/types';
import { getGardenStatus } from '@domain/garden/status';
import { resolveWaterEveryDays } from '@domain/garden/care';
import { EmptyState } from '@ui/components/EmptyState';
import { ErrorState } from '@ui/components/ErrorState';
import { LoadingState } from '@ui/components/LoadingState';
import { PlantListItemCard } from '@ui/components/PlantListItemCard';
import { ScreenLayout } from '@ui/components/ScreenLayout';
import { useGarden } from '@ui/hooks/useGarden';
import { useCareEvents } from '@ui/hooks/useCareEvents';
import { Routes } from '@navigation/routes';
import { useRootNavigation } from '@navigation/navigationHelpers';
import { Button } from '@ui/components/Button';
import { useTheme } from '@ui/theme';

type GardenFilter = 'all' | 'needsWater';

export const MyGardenScreen = (): React.ReactElement => {
  const theme = useTheme();
  const navigation = useRootNavigation();
  const garden = useGarden();
  const careEvents = useCareEvents();
  const [filter, setFilter] = React.useState<GardenFilter>('all');
  useFocusEffect(
    React.useCallback(() => {
      garden.refresh();
      careEvents.refresh();
    }, [garden.refresh, careEvents.refresh]),
  );

  const resolveLastWateredAt = React.useCallback(
    (entry: GardenEntry) => {
      const latestEvent = careEvents.getLatestWaterEvent(entry.id);
      if (latestEvent) {
        return latestEvent.occurredAt;
      }
      return entry.lastWateredAt ?? entry.plantedAt;
    },
    [careEvents],
  );

  const filteredEntries = React.useMemo(() => {
    if (filter === 'all') {
      return garden.entries;
    }
    return garden.entries.filter((entry) => {
      const status = getGardenStatus(entry, Date.now(), {
        lastWateredAt: resolveLastWateredAt(entry),
        waterEveryDays: resolveWaterEveryDays(entry.watering),
      });
      return status === filter;
    });
  }, [filter, garden.entries, resolveLastWateredAt]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<GardenEntry>) => {
      const status = getGardenStatus(item, Date.now(), {
        lastWateredAt: resolveLastWateredAt(item),
        waterEveryDays: resolveWaterEveryDays(item.watering),
      });
      const statusLabel =
        status === 'needsWater'
          ? 'Needs water'
          : 'Healthy';
      const statusTone = status === 'needsWater' ? 'warning' : 'neutral';

      return (
        <PlantListItemCard
          title={item.name}
          subtitle={item.scientificName}
          imageUrl={item.imageUrl}
          statusLabel={statusLabel}
          statusTone={statusTone}
          onPress={() =>
            navigation.navigate({
              name: Routes.GardenDetail,
              params: { id: item.id },
            })
          }
          actionLabel="Watered"
          onAction={() => careEvents.addWaterEvent(item.id, item.plantId)}
          secondaryActionLabel="Remove"
          onSecondaryAction={() => garden.removeEntry(item.id)}
        />
      );
    },
    [careEvents, garden, navigation, resolveLastWateredAt],
  );

  let content = null;
  if (garden.isLoading || careEvents.isLoading) {
    content = <LoadingState message="Loading your garden..." />;
  } else if (garden.error || careEvents.error) {
    content = (
      <ErrorState
        title="Garden unavailable"
        message={(garden.error ?? careEvents.error)?.message ?? 'Something went wrong.'}
        actionLabel="Retry"
        onAction={() => {
          garden.refresh();
          careEvents.refresh();
        }}
      />
    );
  } else if (filteredEntries.length === 0) {
    content = (
      <EmptyState
        title="Your garden is empty"
        message="Add your first plant to start tracking care."
        actionLabel="Add plant"
        onAction={() => navigation.navigate({ name: Routes.GardenForm, params: {} })}
      />
    );
  } else {
    content = (
      <FlatList
        data={filteredEntries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.lg }} />}
      />
    );
  }

  return (
    <ScreenLayout title="My garden">
      <View style={{ marginBottom: theme.spacing.md }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: theme.spacing.sm }}>
            <Button
              label="All"
              variant={filter === 'all' ? 'primary' : 'secondary'}
              onPress={() => setFilter('all')}
            />
          </View>
          <Button
            label="Needs water"
            variant={filter === 'needsWater' ? 'primary' : 'secondary'}
            onPress={() => setFilter('needsWater')}
          />
        </View>
      </View>
      {content}
    </ScreenLayout>
  );
};
